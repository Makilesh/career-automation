# Mode: scan — Portal Scanner (legacy / shared internals)

> **Makilesh setup:** prefer the two purpose-built modes:
> - **`/career-ops scan-boards`** — job boards & aggregators (`portals-boards.yml`) → `modes/scan-boards.md`
> - **`/career-ops scan-startups`** — direct startup career pages (`startups.yml`) → `modes/scan-startups.md`
> - **`/career-ops hunt`** — both, then dedup → evaluate → apply queue → `modes/hunt.md`
>
> This file documents the shared scanner internals used by all three.

Scans configured portals, filters by title/location/recency, dedups, and adds new
offers to `data/pipeline.md` for later evaluation.

> **Zero-token default:** `scan.mjs` (`node scan.mjs [--config <file>] [--posted <window>]`)
> queries Greenhouse/Ashby/Lever public APIs directly — no LLM cost. Companies
> without one of those APIs (workday/workable/notion/custom) are skipped by
> `scan.mjs`; the agent handles them with Playwright (see scan-startups) or
> WebSearch (see scan-boards).

## Configuration

Config file (default `portals.yml`; pass `--config portals-boards.yml` or
`--config startups.yml`):
- `search_queries` — WebSearch queries with `site:` filters (broad discovery)
- `tracked_companies` — specific companies with `careers_url` for direct fetch
- `title_filter` — positive/negative keywords for title filtering
- `location_filter` — optional allow/block location gate
- `default_posted_window` — recency default (overridden by `--posted`)

## Discovery levels

### Level 1 — Playwright direct (for custom/workday pages)
For each tracked company, navigate `careers_url` (`browser_navigate` +
`browser_snapshot`), read all listings, extract `{title, url, company, posted}`.
Real-time, works with SPAs (Ashby/Lever/Workday). Honor the headed/headless
toggle (§8). Every company MUST have a `careers_url`; if missing, find it once,
verify it resolves, and save it.

### Level 2 — ATS APIs (zero-token, via scan.mjs)
Greenhouse `boards-api.greenhouse.io/v1/boards/{slug}/jobs`; Ashby
`api.ashbyhq.com/posting-api/job-board/{slug}`; Lever
`api.lever.co/v0/postings/{slug}`. Providers live in `providers/*.mjs` and each
returns `title`, `url`, `company`, `location`, and `posted` (for `--posted`).

### Level 3 — WebSearch queries (broad discovery)
`search_queries` with `site:` filters cover portals transversally. Results can be
stale, so **verify liveness with Playwright** (sequential) before adding.

Levels are additive: run all, merge, dedup.

## Workflow

1. Read config (`--config` or `portals.yml`).
2. Read dedup sources: `scan-history.tsv`, `applications.md`, `pipeline.md`.
3. Run levels 1–3 as applicable.
4. **Filter (deterministic, no LLM):** title (≥1 positive, 0 negative), location
   (block > allow, empty passes), recency (drop older than `--posted` window).
5. **Dedup** against the 3 sources (exact URL + normalized company+role).
6. **Verify** Level-3 (WebSearch) URLs with Playwright; mark expired as
   `skipped_expired`. Levels 1–2 are real-time and skip this.
7. Add survivors to `pipeline.md` (`- [ ] {url} | {company} | {title}`) and log in
   `scan-history.tsv`.

## scan-history.tsv statuses

`added` | `skipped_title` | `skipped_dup` | `skipped_expired` |
`skipped_no_apply_control` | `skipped_invalid_url` | `skipped_blocked_host`.

## careers_url management

Always store `careers_url` when adding a company. Prefer the company's own
corporate careers page; fall back to the direct ATS URL only when there's no
corporate page. Known patterns:
- Ashby `https://jobs.ashbyhq.com/{slug}`
- Greenhouse `https://job-boards.greenhouse.io/{slug}` (or `.eu`)
- Lever `https://jobs.lever.co/{slug}`
- Workday `https://{co}.{shard}.myworkdayjobs.com/{site}`
- Custom: the company's own URL

If a `careers_url` 404s/redirects: note it, try a `scan_query` fallback, and flag
for manual update. Verify `careers_url`s periodically — companies change ATS.
