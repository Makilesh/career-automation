# Mode: scan-startups — Direct Startup Career Pages (§3B)

Scans each company's OWN career page in `startups.yml`, detects the ATS, extracts
open roles matching Makilesh's filters, and can go straight to `apply` on that
company's portal. Feeds the same tracker + dedup as every other mode.

**Config:** `startups.yml` (watchlist: name, careers_url, ats, city, hr_email, tier).

## Two paths per company

1. **Zero-token (greenhouse / ashby / lever):** run
   `node scan.mjs --config startups.yml --posted {window}` — hits the public ATS
   JSON APIs directly. No LLM, no browser. This covers the ATS-backed entries.
2. **Playwright (workday / workable / notion / custom):** scan.mjs has no
   zero-token provider for these, so navigate each `careers_url` with Playwright
   (`browser_navigate` + `browser_snapshot`), respecting the headed/headless
   toggle (§8 — default headed so Makilesh can watch). Detect the ATS from the DOM,
   read all listings, extract `{title, url, company, posted}`.

## Workflow

1. Read `startups.yml` + dedup sources (scan-history, pipeline, applications).
2. Run path 1 for ATS-backed entries; run path 2 for the rest (batch Playwright
   3–5 at a time, but NEVER 2+ Playwright agents in parallel).
3. **Filter (deterministic, no LLM):** title positive/negative, location tier,
   recency window (`--posted`, default `7d` for startup pages), experience
   (reject 2+ yr unless portfolio accepted).
4. Dedup, then add survivors to `data/pipeline.md` + `data/scan-history.tsv`.
5. Optionally hand a high-fit role straight to `apply` mode (human gate still applies).

## add-startup command

`/career-ops add-startup <name>` (or "add <company> to my startups"):
1. Find the company's careers page (WebSearch + try known ATS patterns:
   `jobs.ashbyhq.com/{slug}`, `job-boards.greenhouse.io/{slug}`, `jobs.lever.co/{slug}`,
   `{co}.myworkdayjobs.com`, `apply.workable.com/{slug}`).
2. **VERIFY the URL resolves** (fetch 200, or Playwright loads a real jobs list).
   403 with a real page = keep (bot-blocked, Playwright can read it). Dead = drop.
3. Detect `ats`, note `city`, look for a careers/HR `hr_email` if visible.
4. Append the entry to `startups.yml`. Never save an unverified/dead link.

## LLM policy (§7.1)

ATS detection, listing extraction, and filtering are **plain code / Playwright
selectors — no LLM**. Company research on a shortlisted startup may use **Gemini
`pro` tier** (deep research is a reserved high-value task). Scanning itself: ₹0.

## Output

```
Startup Scan — {date}  (--posted {window})
Companies scanned:  N (ATS: N zero-token, Playwright: N)
Found:              N   Filtered: N   Duplicates: N
Added to pipeline:  N
  + {company} [{tier}] | {title} | {city}
→ Run /career-ops hunt or /career-ops pipeline to evaluate.
```
