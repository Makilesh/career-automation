# Mode: apply — Live Application Assistant (§10, fast human gate)

Fills application forms from `config/profile.yml` + `qa-bank.mjs`, attaches the
fixed resume, inserts the fixed cover letter, then shows a compact review card and
waits for Makilesh's batch approval before submitting. The human gate is what makes
the qa-bank learning loop safe — never bypass it.

## Hard rules (Makilesh)

- **Resume = `Makilesh_M_AI_Engineer_Resume.pdf`, attached unmodified.** Never generate/tailor one.
- **Cover letter = `templates/cover-letter.md` verbatim** (only final-line role,
  optionally company after "Hi Team"). Never rewrite.
- **Answers come from `qa-bank.mjs`** (§6), not ad-hoc generation.
- **NEVER submit/send without approval.** Batch approval supported.
- **Email applications → Gmail MCP only** (`modes/email.md`, §9).
- **Threshold:** only queue/apply to offers scoring ≥ 3.5/5 (`apply.min_score_threshold`).
- **Browser:** Playwright, headed by default so Makilesh can watch (§8).

## Workflow

```text
1. DETECT   → Read the form (Playwright snapshot, headed) or screenshot/paste
2. IDENTIFY → company + role; match against reports/ (must be evaluated ≥ 3.5)
3. FIELDS   → Detect ALL fields deterministically (selectors) — no LLM
4. ANSWER   → For each question: qa-bank.mjs → matched / adapted / needs-input
5. FILL     → Fill fields, attach Makilesh_M_AI_Engineer_Resume.pdf, paste cover letter verbatim
6. REVIEW   → Show one compact review card; batch approval
7. SUBMIT   → Only approved ones; then tracker → Applied (timestamp + URL)
```

## Step 3 — Detect fields (deterministic, no LLM)

Use Playwright selectors / DOM parsing to enumerate every field: free text,
dropdowns, yes/no, salary, file uploads. Field detection, mapping, and dedup are
plain code (§7.1) — do not spend an LLM call on them.

## Step 4 — Answer each question via qa-bank

For each question:
```bash
node qa-bank.mjs answer "<question>" --company "<company>" --role "<role>"
```
- **matched** → use the stored answer as-is.
- **adapted** → use the adapted answer (router already appended it to the bank).
- **needs-input** → **PAUSE.** Ask Makilesh in chat (especially subjective/personal:
  salary, motivation, availability, visa). Store his answer with tags + date
  (`node qa-bank.mjs add "<q>" "<a>" --tags ...`), then continue. Never invent
  answers to unmatched personal questions.

Known fields (name, email, phone, location, notice period, CGPA, grad date, work
auth, links) resolve directly from `config/profile.yml` / the pre-seeded qa-bank.

## Step 5 — Fill

- Text fields: fill with the resolved answers.
- Cover-letter field: paste `templates/cover-letter.md` verbatim.
- Resume upload: `Makilesh_M_AI_Engineer_Resume.pdf`.
- Do not click Submit yet.

## Step 6 — Review card + batch approval

Show one compact card per application:

```
## Apply {n}: {Company} — {Role}   (score {X.X}/5, report #{NNN})
URL:     {url}
Answers used:
  • {question} → {matched|adapted|profile}: {short preview}
  ...
NEW questions asked (stored to qa-bank): {list or "none"}
Resume:  Makilesh_M_AI_Engineer_Resume.pdf   Cover letter: templates/cover-letter.md (verbatim)
```

Then: **"approve all" / "approve 1,3,5" / "skip N"**. For email-based applications,
follow `modes/email.md` with the same one-click approval.

## Step 7 — Submit + track

For each approved application:
1. Click Submit (form) OR send via Gmail MCP (email, §9).
2. Update tracker: status → `Applied`, with timestamp + URL. (Edit applications.md
   to UPDATE the existing row; new rows go via TSV + `merge-tracker.mjs`.)
3. For email applications, append to `data/email-log.json`.
4. Suggest `/career-ops referral {company}` for outreach and note the 6-day
   follow-up will auto-queue (`/career-ops followup`).

## Scroll handling

If the form has more fields than visible, scroll (Playwright) or ask Makilesh for
another screenshot, and process iteratively until the whole form is covered.
