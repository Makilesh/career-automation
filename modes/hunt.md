# Mode: hunt — Full Pipeline in One Shot (§3)

`/career-ops hunt` = scan-boards + scan-startups → dedup → evaluate → apply queue.
One command, end to end, with the human gate at the very end.

## Steps

1. **Scan boards** (`modes/scan-boards.md`, config `portals-boards.yml`).
2. **Scan startups** (`modes/scan-startups.md`, config `startups.yml`).
3. **Merge + dedup** all discovered offers against `scan-history.tsv`,
   `pipeline.md`, `applications.md` (exact URL + company::role). Plain code, no LLM.
4. **Evaluate** each new offer (fresher-weighted A–G scoring, `modes/oferta.md`):
   - Prefilter relevance with **local Qwen** (`route({tier:'local'})`).
   - Full evaluation with **Gemini `eval` tier** (overflow to 2.5-flash).
   - Threshold: default **3.5/5** (`apply.min_score_threshold`). Below → SKIP,
     don't queue (Ethical Use — quality over quantity).
   - Register every evaluated offer in the tracker (TSV → `merge-tracker.mjs`).
5. **Build the apply queue** from offers ≥ threshold.
6. **Apply** (`modes/apply.md`): fill forms from `config/profile.yml` + `qa-bank.mjs`,
   attach `Makilesh_M_AI_Engineer_Resume.pdf`, insert `templates/cover-letter.md` verbatim →
   show a **compact review card per application** → batch approval
   ("approve all" / "approve 1,3,5") → submit approved → tracker → `Applied`.

## Flags

- `--posted <window>` — recency for both scans (default: board 24h, startup 7d).
- `--headed` / `--headless` — browser visibility for Playwright steps (§8).
- `--threshold <n>` — override the apply threshold for this run.

## Guardrails

- NEVER auto-submit. The human gate (step 6) is mandatory.
- NEVER generate a resume; always attach `Makilesh_M_AI_Engineer_Resume.pdf`.
- Email applications (companies with `hr_email`) go via Gmail MCP only (§9),
  same batch approval, respecting the daily cap and email-log dedup.
- Keep Gemini spend on evaluation + shortlisted final answers only (§7.1).

## Output

A single roll-up: offers found → deduped → evaluated (score histogram) →
queued → review cards → applied count, plus any `needs-input` qa-bank questions
that paused for Makilesh.
