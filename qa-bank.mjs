#!/usr/bin/env node
// @ts-check
/**
 * qa-bank.mjs — self-learning application answer bank helper (§6).
 *
 * Wired into apply mode. For every application-form question:
 *   1. Normalize + search the bank (LOCAL only — Ollama embeddings, else
 *      deterministic string similarity. NEVER Gemini for matching).
 *   2. Exact/near match → return the stored answer as-is (fill placeholders).
 *   3. Similar-but-not-identical → ADAPT the closest answers via the LLM router
 *      (tier "eval"), return it, and APPEND to the bank (dedup-checked first).
 *   4. No match AND subjective/personal (salary, motivation, availability, visa)
 *      → return status "needs-input" so apply mode PAUSES and asks Makilesh.
 *      Never invent answers to unmatched personal questions.
 *
 * CLI:
 *   node qa-bank.mjs answer "question?" --company Acme --role "AI Engineer"
 *   node qa-bank.mjs add "question?" "answer" --tags a,b
 *   node qa-bank.mjs list
 *
 * `answer` prints JSON: {status, answer, matched_q, score, source}.
 *   status ∈ matched | adapted | needs-input
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import yaml from 'js-yaml';

const QA_PATH = 'data/qa-bank.yml';

// Thresholds (embeddings cosine / deterministic Dice have different scales).
const TH = {
  embed: { exact: 0.92, similar: 0.75 },
  dice:  { exact: 0.85, similar: 0.45 },
};

const SUBJECTIVE_HINTS = [
  'salary', 'ctc', 'compensation', 'expected pay', 'expected package',
  'why do you want', 'why are you interested', 'motivation', 'why this company',
  'why should we', 'availability', 'when can you', 'joining date', 'start date',
  'notice period', 'relocate', 'relocation', 'visa', 'sponsorship',
  'strength', 'weakness', 'tell us about yourself', 'cover letter',
];

// ── Load / save ──────────────────────────────────────────────────────
export function loadBank() {
  if (!existsSync(QA_PATH)) return { version: 1, entries: [] };
  const data = yaml.load(readFileSync(QA_PATH, 'utf-8')) || {};
  if (!Array.isArray(data.entries)) data.entries = [];
  return data;
}

export function saveBank(bank) {
  writeFileSync(QA_PATH, yaml.dump(bank, { lineWidth: 100 }), 'utf-8');
}

// ── Normalization + deterministic similarity (no LLM) ────────────────
export function normalize(q) {
  return String(q || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bigrams(s) {
  const t = normalize(s).replace(/\s/g, '');
  const grams = new Set();
  for (let i = 0; i < t.length - 1; i++) grams.add(t.slice(i, i + 2));
  return grams;
}

/** Sørensen–Dice coefficient over character bigrams (0..1). */
function dice(a, b) {
  const A = bigrams(a), B = bigrams(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return (2 * inter) / (A.size + B.size);
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

export function isSubjective(question) {
  const n = normalize(question);
  return SUBJECTIVE_HINTS.some((h) => n.includes(h));
}

// ── Embedding cache (avoids re-embedding the whole bank per question) ─
const EMB_CACHE_PATH = 'data/qa-embeddings.json';

function loadEmbCache() {
  try { return JSON.parse(readFileSync(EMB_CACHE_PATH, 'utf-8')); } catch { return {}; }
}

function saveEmbCache(cache) {
  try { writeFileSync(EMB_CACHE_PATH, JSON.stringify(cache), 'utf-8'); } catch { /* non-fatal */ }
}

async function embedCached(embed, text, cache) {
  const key = normalize(text);
  if (cache[key]) return cache[key];
  const v = await embed(text);
  cache[key] = v;
  return v;
}

// ── Matching (local embeddings preferred, deterministic fallback) ────
export async function matchQuestion(question, bank = loadBank()) {
  const entries = bank.entries;
  if (entries.length === 0) return { type: 'none', score: 0 };

  // Try local embeddings first.
  let scored = null;
  try {
    const { embed } = await import('./llm-router.mjs');
    const cache = loadEmbCache();
    const qv = await embedCached(embed, question, cache);
    const vecs = await Promise.all(entries.map((e) => embedCached(embed, e.q, cache)));
    saveEmbCache(cache);
    scored = entries.map((e, i) => ({ entry: e, score: cosine(qv, vecs[i]) }));
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    if (best.score >= TH.embed.exact) return { type: 'exact', ...best, method: 'embed' };
    if (best.score >= TH.embed.similar) return { type: 'similar', ...best, method: 'embed', top: scored.slice(0, 3) };
    return { type: 'none', ...best, method: 'embed' };
  } catch {
    // Ollama/embeddings unavailable → deterministic Dice similarity.
    scored = entries.map((e) => ({ entry: e, score: dice(question, e.q) }));
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    if (best.score >= TH.dice.exact) return { type: 'exact', ...best, method: 'dice' };
    if (best.score >= TH.dice.similar) return { type: 'similar', ...best, method: 'dice', top: scored.slice(0, 3) };
    return { type: 'none', ...best, method: 'dice' };
  }
}

// ── Placeholder fill ─────────────────────────────────────────────────
export function fill(answer, { company = '', role = '' } = {}) {
  return String(answer || '')
    .replace(/\{\{\s*company\s*\}\}/gi, company)
    .replace(/\{\{\s*role\s*\}\}/gi, role);
}

// ── Append (dedup-checked) ───────────────────────────────────────────
export function appendEntry(bank, entry) {
  const exists = bank.entries.some((e) => normalize(e.q) === normalize(entry.q));
  if (exists) return false;
  bank.entries.push({
    q: entry.q,
    a: entry.a,
    tags: entry.tags || [],
    added: new Date().toISOString().slice(0, 10),
  });
  saveBank(bank);
  return true;
}

// ── High-level answer resolution ─────────────────────────────────────
/**
 * Returns { status, answer, matched_q, score, method, source }.
 * status: matched | adapted | needs-input
 */
export async function answerQuestion(question, { company = '', role = '' } = {}) {
  const bank = loadBank();
  const m = await matchQuestion(question, bank);

  if (m.type === 'exact') {
    return {
      status: 'matched', answer: fill(m.entry.a, { company, role }),
      matched_q: m.entry.q, score: Number(m.score.toFixed(3)), method: m.method, source: 'bank',
    };
  }

  if (m.type === 'similar') {
    // Adapt closest stored answers via the router (tier "eval" — high-value).
    try {
      const { route } = await import('./llm-router.mjs');
      const context = (m.top || [{ entry: m.entry }])
        .map((s, i) => `${i + 1}. Q: ${s.entry.q}\n   A: ${s.entry.a}`).join('\n');
      const prompt =
        `You are filling a job application for Makilesh M (AI/ML fresher). ` +
        `Adapt the closest stored answers into a concise, honest answer to the NEW question. ` +
        `Do not invent facts not present in the stored answers. Keep it 1-3 sentences.\n\n` +
        `NEW QUESTION: ${question}\n\nCLOSEST STORED ANSWERS:\n${context}\n\nADAPTED ANSWER:`;
      // tier 'local' = free local Qwen, ZERO cloud tokens. Direct matches never
      // hit an LLM at all; only genuinely-new near-matches reach this, and even
      // then it stays on the local model. Override to 'eval' only if you want
      // Gemini-quality adaptation for a specific run.
      const out = await route({ tier: 'local', prompt, label: 'qa-bank-adapt', temperature: 0.3 });
      const adapted = fill(out.text.trim(), { company, role });
      // Store the new Q+A for reuse (dedup-checked).
      appendEntry(bank, { q: question, a: out.text.trim(), tags: ['adapted'] });
      return {
        status: 'adapted', answer: adapted, matched_q: m.entry.q,
        score: Number(m.score.toFixed(3)), method: m.method, source: `router:${out.backend}`,
      };
    } catch (err) {
      // If the router is unavailable, fall back to the closest answer verbatim.
      return {
        status: 'matched', answer: fill(m.entry.a, { company, role }),
        matched_q: m.entry.q, score: Number(m.score.toFixed(3)), method: m.method,
        source: 'bank(fallback)', note: `adapt failed: ${err.message}`,
      };
    }
  }

  // No match. If subjective/personal → pause and ask Makilesh.
  return {
    status: 'needs-input',
    answer: null,
    subjective: isSubjective(question),
    reason: isSubjective(question)
      ? 'Subjective/personal question with no bank match — ask Makilesh, then store the answer.'
      : 'No bank match — ask Makilesh (or answer from profile.yml), then store the answer.',
    method: m.method || 'none',
    score: m.score ? Number(m.score.toFixed(3)) : 0,
  };
}

// ── CLI ──────────────────────────────────────────────────────────────
const isMain = process.argv[1] && process.argv[1].endsWith('qa-bank.mjs');
if (isMain) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const getFlag = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : ''; };

  if (cmd === 'list') {
    const bank = loadBank();
    for (const e of bank.entries) console.log(`• ${e.q}\n    → ${e.a}  [${(e.tags || []).join(', ')}]`);
    console.log(`\n${bank.entries.length} entries.`);
  } else if (cmd === 'add') {
    const q = args[1], a = args[2];
    if (!q || !a) { console.error('Usage: node qa-bank.mjs add "question" "answer" [--tags a,b]'); process.exit(1); }
    const bank = loadBank();
    const tags = getFlag('--tags') ? getFlag('--tags').split(',').map((t) => t.trim()) : [];
    const ok = appendEntry(bank, { q, a, tags });
    console.log(ok ? '✅ added' : '⚠️  duplicate — not added');
  } else if (cmd === 'answer') {
    const q = args[1];
    if (!q) { console.error('Usage: node qa-bank.mjs answer "question" [--company X --role Y]'); process.exit(1); }
    const out = await answerQuestion(q, { company: getFlag('--company'), role: getFlag('--role') });
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log('Usage: node qa-bank.mjs {answer|add|list}');
  }
}
