# Mode: discover — Find ANY startup hiring in a location (§discover)

Discovers companies you did NOT name — any startup hiring AI/ML roles in a target
location, recently posted — then goes into each company's OWN career site to pull
their openings. Feeds the same pipeline as everything else.

**Policy chosen by Makilesh: Discover → review → crawl.** Discovery adds companies
to `discovered-companies.yml` with `status: pending-review`. Their roles only enter
the pipeline after Makilesh approves the company list. Nothing auto-applies.

## Why it works this way (read once)

There is no single free API for "every startup in Bangalore hiring an AI role."
That index is fragmented across ATS platforms and aggregators. So discovery has
three layers:

```
LAYER 1  DISCOVER   ATS-wide site: searches + aggregators, scoped to
                    role + location + recency  →  company names / careers URLs
                         ↓
LAYER 2  RESOLVE     resolve-company.mjs verifies each NEW company's board
                     resolves (zero-token) → append to discovered-companies.yml
                         ↓  (Makilesh reviews the list)
LAYER 3  CRAWL       scan.mjs crawls each company's FULL board (zero-token for
                     greenhouse/ashby/lever/smartrecruiters/workday; browser for
                     keka/custom), recency + title + location filtered
                         ↓
                    pipeline → evaluate → apply queue  (existing modes)
```

## Command

```
/career-ops discover "Bangalore" "AI intern, AI engineer, ML engineer"
```
Defaults if omitted: location from `config/profile.yml` location_tiers (Bangalore →
Hyderabad → Chennai); roles from the archetype keywords; recency `7d`.

## Step 1 — Discover candidate companies (agent-driven, WebSearch)

Run these searches (fill {LOC} and {ROLE} from the args; add a recency term like
"posted this week"). Each ATS-scoped search surfaces companies you don't already track:

- `site:jobs.smartrecruiters.com ({ROLE}) {LOC}`
- `site:job-boards.greenhouse.io ({ROLE}) {LOC}`
- `site:jobs.ashbyhq.com ({ROLE}) {LOC}`
- `site:jobs.lever.co ({ROLE}) {LOC}`
- `site:apply.workable.com ({ROLE}) {LOC}`
- `site:myworkdayjobs.com ({ROLE}) {LOC}`
- Aggregators that list startups by location (harvest company names, then resolve
  their own site): Wellfound `wellfound.com/jobs`, YC `workatastartup.com/jobs`,
  Instahyre, Cutshort — `"{ROLE}" {LOC} startup`.

From each result extract the **company** (from the ATS slug in the URL, or the
"@ Company" in the title) and the **careers URL**. Deterministic parsing — no LLM.

## Step 2 — Resolve + verify each NEW company (zero-token)

For every candidate NOT already in `startups.yml` or `discovered-companies.yml`:

```bash
node resolve-company.mjs "<company name>"        # tries greenhouse/ashby/lever/smartrecruiters by name
node resolve-company.mjs "<careers URL>"         # or resolve a URL you extracted
```

- `resolved: true` → append to `discovered-companies.yml` `tracked_companies` with
  `ats`, `careers_url`, `city` (from the search location), `discovered: <today>`,
  `source: "<which query>"`, `status: pending-review`, `enabled: true`.
  For smartrecruiters-by-name also store `sr_slug` and `provider: smartrecruiters`.
- Workday URL → store as-is (`ats: workday`); the provider crawls it zero-token.
- KekaHire / custom / self-hosted (Eightfold, Opkey…) → `resolved: false`. Store
  with `ats: keka|custom` and `crawl: browser` so Layer 3 uses Playwright, OR skip
  if you can't confirm a real jobs page. NEVER save a dead/unverified link.
- Dedup by normalized company name + careers_url.

## Step 3 — Review gate (Makilesh approves)

Present the new finds compactly:

```
Discovered {N} new companies hiring {ROLE} in {LOC} (pending review):
  1. {company}  [{ats}, {city}]  — {jobs_count or '?'} open  ({source})
  ...
Approve which to crawl? ("all" / "1,3,5" / "none")
```

Set `status: approved` on the chosen ones (leave the rest `pending-review`; mark
clearly-irrelevant ones `rejected` so they're skipped next time).

## Step 4 — Crawl approved companies (Layer 3)

```bash
node scan.mjs --config discovered-companies.yml --posted {window}
```

This hits each approved company's own board zero-token (SR/greenhouse/ashby/lever/
workday) or via the browser (keka/custom), applies title + location + recency
filters, dedups against history, and adds new roles to `data/pipeline.md`.

Then evaluate + apply as usual (`/career-ops pipeline` or `/career-ops hunt`).

## Step 5 — Promote the keepers

Companies that consistently post good roles → move the entry from
`discovered-companies.yml` into `startups.yml` (your permanent watchlist) so every
future `scan-startups`/`hunt` includes them without re-discovery.

## Limits (be honest with Makilesh)

- Discovery reach = WebSearch coverage + ATS reach. It catches most ATS-based
  startups automatically; a fully custom, poorly-indexed career site can still be
  missed until named.
- Custom/self-hosted sites (no ATS) are best-effort via the browser — slower,
  per-site, and may need a manual careers URL.
- KekaHire has no zero-token API (needs a per-tenant GUID) → browser path only.
- Respect anti-ban: throttle WebSearch/Playwright, one browser session at a time,
  back off on 403/429.
