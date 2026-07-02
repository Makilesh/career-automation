#!/usr/bin/env node
// @ts-check
/**
 * llm-router.mjs — provider router for career-ops (§7).
 *
 * Two backends:
 *   • LOCAL  — Ollama `qwen2.5:14b` (q4_K_M), falls back to `qwen2.5:7b` on OOM.
 *              Free + unlimited. Handles ALL cheap/discardable work.
 *   • GEMINI — free-tier, rotated across models by RPM/RPD/TPM limits,
 *              tracked persistently in data/llm-usage.json.
 *
 * ROUTING GATE (checked in order — the whole point is to keep Gemini ₹0):
 *   1. tier "deterministic" → REFUSED. Do it in plain code (regex/parsers). This
 *      router throws so callers can't accidentally burn a model on it.
 *   2. tier "local" / "cheap" → Ollama Qwen.
 *   3. tier "triage" → gemini-3.1-flash-lite (bulk classification / quick scoring).
 *   4. tier "eval"   → gemini-3.5-flash, overflow gemini-2.5-flash (full evals,
 *                      form-answer generation).
 *   5. tier "pro"    → gemini-3.1-pro-preview, overflow gemini-2.5-pro (shortlisted
 *                      final subjective answers, deep research). Scarcest budget.
 *
 * On 429/limit/model-unavailable: rotate within the tier group → exponential
 * backoff → if all Gemini exhausted, degrade to local Qwen with a warning.
 * Every routing decision is logged in llm-usage.json for audit.
 *
 * CLI:
 *   node llm-router.mjs usage                     # print usage counters
 *   node llm-router.mjs --tier eval "prompt..."   # route a prompt
 *   node llm-router.mjs --local "prompt..."       # force local Qwen
 *   node llm-router.mjs check                      # health-check backends
 *
 * Model IDs come straight from the prompt's limits table. If Google exposes
 * different IDs, override per-tier with env vars (GEMINI_MODEL_TRIAGE, _EVAL,
 * _EVAL_OVERFLOW, _PRO, _PRO_OVERFLOW) — limits stay attached to the slot.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

try { (await import('dotenv')).config(); } catch { /* optional */ }

// ── Config ───────────────────────────────────────────────────────────
const USAGE_PATH = 'data/llm-usage.json';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const LOCAL_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:14b';
const LOCAL_FALLBACK = process.env.OLLAMA_FALLBACK_MODEL || 'qwen2.5:7b';

// Gemini rotation slots. Each slot = one model + its free-tier limits.
// Order inside a tier group = rotation order (primary first, overflow after).
const GEMINI_MODELS = {
  triage: [
    { id: process.env.GEMINI_MODEL_TRIAGE || 'gemini-3.1-flash-lite', rpm: 15, rpd: 1000, tpm: 250_000 },
  ],
  eval: [
    { id: process.env.GEMINI_MODEL_EVAL || 'gemini-3.5-flash', rpm: 10, rpd: 1500, tpm: 250_000 },
    { id: process.env.GEMINI_MODEL_EVAL_OVERFLOW || 'gemini-2.5-flash', rpm: 10, rpd: 1500, tpm: 250_000 },
  ],
  pro: [
    { id: process.env.GEMINI_MODEL_PRO || 'gemini-3.1-pro-preview', rpm: 5, rpd: 100, tpm: 250_000 },
    { id: process.env.GEMINI_MODEL_PRO_OVERFLOW || 'gemini-2.5-pro', rpm: 5, rpd: 50, tpm: 150_000 },
  ],
};

const LOCAL_TIERS = new Set(['local', 'cheap']);
const GEMINI_TIERS = new Set(['triage', 'eval', 'pro']);

// ── Usage persistence ────────────────────────────────────────────────
function loadUsage() {
  if (!existsSync(USAGE_PATH)) {
    return { models: {}, routing_log: [] };
  }
  try {
    return JSON.parse(readFileSync(USAGE_PATH, 'utf-8'));
  } catch {
    return { models: {}, routing_log: [] };
  }
}

function saveUsage(usage) {
  mkdirSync('data', { recursive: true });
  // Cap the routing log so the file doesn't grow without bound.
  if (usage.routing_log.length > 500) {
    usage.routing_log = usage.routing_log.slice(-500);
  }
  writeFileSync(USAGE_PATH, JSON.stringify(usage, null, 2), 'utf-8');
}

function modelState(usage, id) {
  if (!usage.models[id]) {
    usage.models[id] = {
      rpm: { window_start: 0, count: 0 },
      rpd: { day: '', count: 0 },
      tpm: { window_start: 0, tokens: 0 },
    };
  }
  return usage.models[id];
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/** Roll minute/day windows forward and report remaining headroom. */
function refreshWindows(state) {
  const now = Date.now();
  const day = todayStr();
  if (now - state.rpm.window_start >= 60_000) { state.rpm.window_start = now; state.rpm.count = 0; }
  if (now - state.tpm.window_start >= 60_000) { state.tpm.window_start = now; state.tpm.tokens = 0; }
  if (state.rpd.day !== day) { state.rpd.day = day; state.rpd.count = 0; }
}

/** Can this slot take one more request of ~estTokens without breaching a limit? */
function hasHeadroom(state, slot, estTokens) {
  refreshWindows(state);
  if (state.rpm.count + 1 > slot.rpm) return false;
  if (state.rpd.count + 1 > slot.rpd) return false;
  if (state.tpm.tokens + estTokens > slot.tpm) return false;
  return true;
}

function recordUse(state, tokens) {
  state.rpm.count += 1;
  state.rpd.count += 1;
  state.tpm.tokens += tokens;
}

// Rough token estimate (~4 chars/token) — good enough for TPM budgeting.
function estimateTokens(text) {
  return Math.ceil((text || '').length / 4) + 256; // +completion headroom
}

// ── Ollama (local Qwen) ──────────────────────────────────────────────
export async function localChat(prompt, { system = '', model = LOCAL_MODEL, temperature = 0.3 } = {}) {
  const body = {
    model,
    prompt,
    system: system || undefined,
    stream: false,
    options: { temperature },
  };
  let res;
  try {
    res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(`Ollama unreachable at ${OLLAMA_URL} (is it running? \`ollama serve\`): ${err.message}`);
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    // OOM / model-too-big → retry with the smaller fallback model once.
    if (model === LOCAL_MODEL && /memory|oom|out of|cannot allocate/i.test(txt)) {
      console.error(`⚠️  ${LOCAL_MODEL} OOM — falling back to ${LOCAL_FALLBACK}`);
      return localChat(prompt, { system, model: LOCAL_FALLBACK, temperature });
    }
    throw new Error(`Ollama HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const json = await res.json();
  return { text: json.response ?? '', backend: 'local', model };
}

/** Local embeddings for semantic similarity / qa-bank retrieval (§6). */
export async function embed(text, { model = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text' } = {}) {
  let res;
  try {
    res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model, prompt: text }),
    });
  } catch (err) {
    throw new Error(`Ollama embeddings unreachable: ${err.message}`);
  }
  if (!res.ok) throw new Error(`Ollama embeddings HTTP ${res.status}`);
  const json = await res.json();
  return json.embedding;
}

// ── Gemini ───────────────────────────────────────────────────────────
async function geminiChat(modelId, prompt, { system = '', temperature = 0.4, maxTokens = 4096 } = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('GEMINI_API_KEY not set'), { code: 'no_key' });
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: system || undefined,
    generationConfig: { temperature, maxOutputTokens: maxTokens },
  });
  try {
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), backend: 'gemini', model: modelId };
  } catch (err) {
    const msg = (err.message || '').toLowerCase();
    if (msg.includes('429') || msg.includes('quota') || msg.includes('rate')) {
      throw Object.assign(err, { code: 'rate_limited' });
    }
    if (msg.includes('not found') || msg.includes('404') || msg.includes('unsupported')) {
      throw Object.assign(err, { code: 'model_unavailable' });
    }
    throw err;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Router ───────────────────────────────────────────────────────────
/**
 * route(task) — main entry point.
 * @param {{tier: string, prompt: string, system?: string, temperature?: number,
 *          maxTokens?: number, label?: string}} task
 */
export async function route(task) {
  const { tier, prompt, system = '', temperature, maxTokens, label = '' } = task;

  if (tier === 'deterministic') {
    throw new Error(
      `Router refused tier "deterministic" (${label}). Do this in plain code — no LLM. ` +
      `See AGENTS.md → LLM Strategy gate step 1.`,
    );
  }

  const usage = loadUsage();
  const logDecision = (backend, model, reason, tokens = 0) => {
    usage.routing_log.push({
      ts: new Date().toISOString(), label, tier, backend, model, reason, tokens_est: tokens,
    });
  };

  // Local tiers → Qwen directly.
  if (LOCAL_TIERS.has(tier)) {
    logDecision('local', LOCAL_MODEL, 'cheap tier → local Qwen');
    saveUsage(usage);
    return localChat(prompt, { system, temperature });
  }

  if (!GEMINI_TIERS.has(tier)) {
    throw new Error(`Unknown tier "${tier}". Use: deterministic|local|cheap|triage|eval|pro`);
  }

  // Gemini tiers → try each slot in order, respecting persisted limits.
  const slots = GEMINI_MODELS[tier];
  const est = estimateTokens(prompt + system);
  let lastErr = null;

  for (const slot of slots) {
    const state = modelState(usage, slot.id);
    if (!hasHeadroom(state, slot, est)) {
      logDecision('gemini-skip', slot.id, 'no headroom (limit window)');
      continue;
    }
    // Up to 2 attempts per slot with exponential backoff on transient rate limits.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const out = await geminiChat(slot.id, prompt, { system, temperature, maxTokens });
        recordUse(state, est);
        logDecision('gemini', slot.id, attempt ? 'ok after backoff' : 'ok', est);
        saveUsage(usage);
        return out;
      } catch (err) {
        lastErr = err;
        if (err.code === 'no_key') { lastErr = err; break; } // no point retrying
        if (err.code === 'rate_limited' && attempt === 0) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        // model_unavailable or repeated rate limit → next slot
        logDecision('gemini-fail', slot.id, err.code || 'error');
        break;
      }
    }
  }

  // All Gemini slots exhausted/unavailable → degrade to local Qwen with a warning.
  console.error(
    `⚠️  All Gemini "${tier}" models exhausted/unavailable` +
    (lastErr ? ` (${lastErr.code || lastErr.message})` : '') +
    ` — degrading to local Qwen. Quality may drop for: ${label || 'this task'}.`,
  );
  logDecision('local-degraded', LOCAL_MODEL, `gemini ${tier} exhausted → local`);
  saveUsage(usage);
  const out = await localChat(prompt, { system, temperature });
  return { ...out, degraded: true };
}

// ── Health check ─────────────────────────────────────────────────────
export async function healthCheck() {
  const report = { ollama: false, ollama_models: [], gemini_key: Boolean(process.env.GEMINI_API_KEY) };
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    if (res.ok) {
      report.ollama = true;
      const json = await res.json();
      report.ollama_models = (json.models || []).map((m) => m.name);
    }
  } catch { /* ollama down */ }
  return report;
}

// ── CLI ──────────────────────────────────────────────────────────────
const isMain = process.argv[1] && process.argv[1].endsWith('llm-router.mjs');
if (isMain) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'usage') {
    const usage = loadUsage();
    console.log(JSON.stringify(usage.models, null, 2));
    console.log(`\nRouting decisions logged: ${usage.routing_log.length}`);
  } else if (cmd === 'check') {
    const report = await healthCheck();
    console.log(JSON.stringify(report, null, 2));
    if (!report.ollama) console.error('\n⚠️  Ollama not reachable — run `ollama serve` and `ollama pull qwen2.5:14b`.');
    if (!report.gemini_key) console.error('⚠️  GEMINI_API_KEY not set — Gemini tiers will degrade to local.');
  } else if (args.length) {
    const forceLocal = args.includes('--local');
    const tierFlag = args.indexOf('--tier');
    const tier = forceLocal ? 'local' : (tierFlag !== -1 ? args[tierFlag + 1] : 'eval');
    const prompt = args.filter((a, i) => !a.startsWith('--') && a !== tier && !(tierFlag !== -1 && i === tierFlag + 1)).join(' ');
    if (!prompt) { console.error('No prompt provided.'); process.exit(1); }
    const out = await route({ tier, prompt, label: 'cli' });
    console.log(`\n[${out.backend}${out.degraded ? ' (degraded)' : ''} · ${out.model}]\n`);
    console.log(out.text);
  } else {
    console.log('Usage: node llm-router.mjs {usage|check|--tier <t> "prompt"|--local "prompt"}');
  }
}
