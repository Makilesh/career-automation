#!/usr/bin/env node
// @ts-check
/**
 * resolve-company.mjs — deterministic ATS resolver + verifier (zero-token).
 *
 * Given a company NAME or a careers/ATS URL, figure out which ATS it's on and
 * VERIFY the board actually resolves (returns jobs). Powers two things:
 *   - `add-startup <name>`  (single company → verified startups.yml entry)
 *   - `discover` mode       (verify each auto-discovered company before saving)
 *
 * It probes the public APIs of the ATSs we support zero-token:
 *   greenhouse · ashby · lever · smartrecruiters
 * (Workday can't be guessed from a name — it needs tenant+shard+site — so a
 *  Workday careers_url is accepted directly. Keka/custom need the browser.)
 *
 * Usage:
 *   node resolve-company.mjs "Juspay"
 *   node resolve-company.mjs "https://jobs.ashbyhq.com/Sarvam"
 *   node resolve-company.mjs "Juspay" --json
 *
 * Output (JSON): { name, resolved, ats, careers_url, jobs_count, note }
 *   resolved:false + note when nothing verifiable was found.
 */

const UA = 'Mozilla/5.0 (compatible; career-ops/1.9)';

async function getJson(url, opts = {}) {
  const r = await fetch(url, { redirect: 'follow', headers: { 'user-agent': UA }, ...opts });
  if (!r.ok) return { ok: false, status: r.status };
  try { return { ok: true, json: await r.json() }; } catch { return { ok: false, status: r.status }; }
}

// Count jobs from each ATS's payload shape.
function countGreenhouse(j) { return Array.isArray(j?.jobs) ? j.jobs.length : null; }
function countAshby(j) { return Array.isArray(j?.jobs) ? j.jobs.length : null; }
function countLever(j) { return Array.isArray(j) ? j.length : null; }
function countSR(j) { return typeof j?.totalFound === 'number' ? j.totalFound : (Array.isArray(j?.content) ? j.content.length : null); }

// Candidate slugs from a company name: "Juspay" → ["juspay"], "Mad Street Den"
// → ["madstreetden","mad-street-den","madstreet"].
function slugCandidates(name) {
  const base = name.toLowerCase().trim();
  const nospace = base.replace(/[^a-z0-9]/g, '');
  const dashed = base.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const noSuffix = nospace.replace(/(ai|inc|labs|technologies|tech|hq)$/i, '');
  return [...new Set([nospace, dashed, noSuffix].filter(Boolean))];
}

// Detect ATS from an explicit URL and build the API endpoint.
function detectFromUrl(url) {
  let m;
  if ((m = url.match(/job-boards(?:\.eu)?\.greenhouse\.io\/([^/?#]+)/))) return { ats: 'greenhouse', slug: m[1], api: `https://boards-api.greenhouse.io/v1/boards/${m[1]}/jobs`, count: countGreenhouse };
  if ((m = url.match(/jobs\.ashbyhq\.com\/([^/?#]+)/i))) return { ats: 'ashby', slug: m[1], api: `https://api.ashbyhq.com/posting-api/job-board/${m[1]}`, count: countAshby };
  if ((m = url.match(/jobs\.lever\.co\/([^/?#]+)/i))) return { ats: 'lever', slug: m[1], api: `https://api.lever.co/v0/postings/${m[1]}`, count: countLever };
  if ((m = url.match(/smartrecruiters\.com\/([^/?#]+)/i))) return { ats: 'smartrecruiters', slug: m[1], api: `https://api.smartrecruiters.com/v1/companies/${m[1]}/postings?limit=1`, count: countSR };
  if (/myworkdayjobs\.com/i.test(url)) return { ats: 'workday', slug: null, api: null, count: null, workdayUrl: url };
  if (/kekahire\.com/i.test(url)) return { ats: 'keka', slug: null, api: null, count: null, browser: true };
  return null;
}

async function verifyEndpoint(cand) {
  const res = await getJson(cand.api);
  if (!res.ok) return null;
  const n = cand.count(res.json);
  if (n === null || n === 0) return null;   // resolves but empty → treat as no-hire
  return { ats: cand.ats, slug: cand.slug, jobs_count: n };
}

// Public careers_url per ATS (what we store in the watchlist).
function careersUrlFor(ats, slug) {
  switch (ats) {
    case 'greenhouse': return `https://job-boards.greenhouse.io/${slug}`;
    case 'ashby': return `https://jobs.ashbyhq.com/${slug}`;
    case 'lever': return `https://jobs.lever.co/${slug}`;
    case 'smartrecruiters': return `https://jobs.smartrecruiters.com/${slug}`;
    default: return null;
  }
}

export async function resolveCompany(input) {
  const trimmed = String(input || '').trim();
  if (!trimmed) return { name: input, resolved: false, note: 'empty input' };

  // 1. If it's a URL, detect + verify directly.
  if (/^https?:\/\//i.test(trimmed)) {
    const d = detectFromUrl(trimmed);
    if (!d) return { name: trimmed, resolved: false, note: 'URL not on a known ATS — use the browser path (custom/self-hosted).' };
    if (d.ats === 'workday') return { name: trimmed, resolved: true, ats: 'workday', careers_url: d.workdayUrl, jobs_count: null, note: 'Workday — provider crawls it zero-token; jobs_count unknown until scanned.' };
    if (d.browser) return { name: trimmed, resolved: false, ats: 'keka', careers_url: trimmed, note: 'KekaHire — no zero-token API; crawl via the browser in discover/scan-startups.' };
    const v = await verifyEndpoint(d);
    if (!v) return { name: trimmed, resolved: false, ats: d.ats, note: `board ${d.slug} did not resolve with open jobs` };
    return { name: trimmed, resolved: true, ats: v.ats, careers_url: careersUrlFor(v.ats, v.slug), jobs_count: v.jobs_count, note: 'verified' };
  }

  // 2. It's a name → try slug candidates across the zero-token ATSs.
  const slugs = slugCandidates(trimmed);
  const atsBuilders = [
    (s) => ({ ats: 'greenhouse', slug: s, api: `https://boards-api.greenhouse.io/v1/boards/${s}/jobs`, count: countGreenhouse }),
    (s) => ({ ats: 'ashby', slug: s, api: `https://api.ashbyhq.com/posting-api/job-board/${s}`, count: countAshby }),
    (s) => ({ ats: 'lever', slug: s, api: `https://api.lever.co/v0/postings/${s}`, count: countLever }),
    (s) => ({ ats: 'smartrecruiters', slug: s, api: `https://api.smartrecruiters.com/v1/companies/${s}/postings?limit=1`, count: countSR }),
  ];
  for (const s of slugs) {
    for (const build of atsBuilders) {
      const v = await verifyEndpoint(build(s)).catch(() => null);
      if (v) return { name: trimmed, resolved: true, ats: v.ats, careers_url: careersUrlFor(v.ats, v.slug), jobs_count: v.jobs_count, note: `verified (slug "${v.slug}")` };
    }
  }
  return {
    name: trimmed, resolved: false,
    note: 'Not found on greenhouse/ashby/lever/smartrecruiters by name. It may use Workday/Keka/custom — find the careers URL (WebSearch) and pass the URL, or crawl via the browser.',
  };
}

// ── CLI ──────────────────────────────────────────────────────────────
const isMain = process.argv[1] && process.argv[1].endsWith('resolve-company.mjs');
if (isMain) {
  const args = process.argv.slice(2).filter((a) => a !== '--json');
  const input = args.join(' ');
  if (!input) { console.error('Usage: node resolve-company.mjs "<company name or careers URL>"'); process.exit(1); }
  const out = await resolveCompany(input);
  console.log(JSON.stringify(out, null, 2));
  process.exit(out.resolved ? 0 : 2);
}
