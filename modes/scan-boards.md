# Mode: scan-boards — Job Boards & Aggregators (§3A)

Scans job boards and aggregators for fresher AI/ML roles, applies board-native
recency + experience filters, dedups, and adds new offers to the pipeline.

**Config:** `portals-boards.yml`
**Sources:** LinkedIn Jobs, Naukri, Instahyre, Cutshort, Wellfound, Internshala
(jobs/PPO), Hirist, foundit, YC Work at a Startup, plus Ashby/Greenhouse/Lever/
Workable `site:` search queries scoped to India/remote.

## Recency (§2)

Default window `24h` (override: `--posted 1h|same-day|24h|3d|7d`, or
`default_posted_window` in the config). Apply board-native date filters FIRST,
fall back to parsing posted dates. **Never surface listings older than the window.**
- LinkedIn: `f_TPR=r3600` (1h) / `r86400` (24h) / `r604800` (7d); `f_E=1,2` (intern/entry)
- Naukri: freshness "Last 1 day / 3 days"
- ATS `site:` results: use `updated_at`/posted date; `node scan.mjs --posted` also filters.

## Workflow

1. Read `portals-boards.yml` (`title_filter`, `location_filter`, `search_queries`, `default_posted_window`).
2. Read dedup sources: `data/scan-history.tsv`, `data/pipeline.md`, `data/applications.md`.
3. For each `search_queries` entry with `enabled: true`, run **WebSearch** with the
   board's native recency/experience params baked into the URL/query.
4. Extract `{title, url, company, posted}` from each result.
5. **Filter (deterministic, no LLM):**
   - title: ≥1 `positive` keyword, 0 `negative` keywords (case-insensitive)
   - location: `block` wins over `allow`; empty location passes
   - recency: drop anything older than the window
   - experience: hard-reject 2+ years unless JD accepts portfolio/projects
6. **Dedup** against the 3 sources (exact URL + company::role).
7. **Verify liveness** of each new WebSearch URL with Playwright (sequential, NEVER
   parallel) before adding — Google caches stale results. Mark expired as
   `skipped_expired` in scan-history.
8. Add survivors to `data/pipeline.md` (`- [ ] {url} | {company} | {title}`) and log
   in `data/scan-history.tsv`.

## LLM policy (§7.1)

Extraction, title/location/recency filtering, and dedup are **plain code — no LLM**.
Only borderline title relevance may use **local Qwen** (`route({tier:'local'})`).
Never call Gemini during scanning.

## Output

```
Board Scan — {date}  (--posted {window})
Queries run:        N
Found:              N
Filtered (title):   N   Filtered (loc): N   Filtered (recency): N
Duplicates:         N
Expired dropped:    N
Added to pipeline:  N
  + {company} | {title} | {board}
→ Run /career-ops hunt or /career-ops pipeline to evaluate.
```

Zero-token ATS entries can also be pulled directly with:
`node scan.mjs --config portals-boards.yml --posted {window}` (only hits
greenhouse/ashby/lever `site:` companies that expose APIs).
