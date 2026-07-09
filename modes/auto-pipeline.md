# Mode: auto-pipeline — Full Automatic Pipeline

> **Makilesh rules:** NO resume generation — attach `Makilesh_M_AI_Engineer_Resume.pdf` unmodified.
> Cover letter = `templates/cover-letter.md` verbatim. Apply threshold 3.5/5.
> Human gate before any submit/send. Email = Gmail MCP only.

When the user pastes a JD (text or URL) without an explicit sub-command, execute the ENTIRE pipeline in sequence:

## Step 0 — Extract JD

If the input is a **URL** (not pasted JD text), follow this strategy to extract the content:

**Priority order:**

1. **Playwright (preferred):** Most job portals (Lever, Ashby, Greenhouse, Workday) are SPAs. Use `browser_navigate` + `browser_snapshot` to render and read the JD.
2. **WebFetch (fallback):** For static pages (ZipRecruiter, WeLoveProduct, company career pages).
3. **WebSearch (last resort):** Search for the role title + company in secondary portals that index the JD in static HTML.

**If no method works:** Ask the candidate to paste the JD manually or share a screenshot.

**If the input is JD text** (not a URL): use directly, without needing to fetch.

## Step 1 — A-G Evaluation

Execute the same as the `oferta` mode (read `modes/oferta.md` for all A-F blocks + Block G Posting Legitimacy).

## Step 2 — Save Report .md

Save the full evaluation in `reports/{###}-{company-slug}-{YYYY-MM-DD}.md` (see format in `modes/oferta.md`).
Include Block G in the saved report. Add **URL:** {url} and **Legitimacy:** {tier} to the report header.

## Step 3 — Resume (FIXED — no generation)

Do NOT generate a PDF. The resume is `Makilesh_M_AI_Engineer_Resume.pdf`, attached unmodified.
In the report/tracker, treat PDF as ✅ (the fixed resume is always available).
Skip `pdf`/`latex` modes and `cv-sync-check.mjs` entirely.

## Step 4 — Draft Application Answers (only if score >= 3.5)

If the final score is >= 3.5 (fresher threshold), draft form responses:

1. **Extract form questions**: Use Playwright (respect headed/headless §8) to
   navigate the form and snapshot it. Fall back to the generic questions.
2. **Answer via `qa-bank.mjs`** (§6): for each question run
   `node qa-bank.mjs answer "<q>" --company <c> --role <r>`.
   - `matched` → use the stored answer.
   - `adapted` → use the adapted answer (already appended to the bank).
   - `needs-input` → PAUSE and ask Makilesh; store the answer, then continue.
3. **Cover letter**: if the form has one, paste `templates/cover-letter.md`
   verbatim (only the final-line role, optionally company after "Hi Team").
4. **Save** the answers in the report as `## H) Draft Application Answers`.
5. Never submit — the human gate (see `modes/apply.md`) owns submission.

### Generic questions (use if they cannot be extracted from the form)

- Why are you interested in this role?
- Why do you want to work at [Company]?
- Tell us about a relevant project or achievement
- What makes you a good fit for this position?
- How did you hear about this role?

### Tone for Form Answers

**Position: "I'm choosing you."** The candidate has options and is choosing this company for specific reasons.

**Tone rules:**
- **Confident without arrogance**: "I've spent the past year building production AI agent systems — your role is where I want to apply that experience next"
- **Selective without arrogance**: "I've been intentional about finding a team where I can contribute meaningfully from day one"
- **Specific and concrete**: Always reference something REAL from the JD or the company, and something REAL from the candidate's experience
- **Direct, without fluff**: 2-4 sentences per response. No "I'm passionate about..." or "I would love the opportunity to..."
- **The hook is the proof, not the statement**: Instead of "I'm great at X", say "I built X that does Y"

**Framework per question (fresher framing — pull real proof points from cv.md / _profile.md):**
- **Why this role?** → "Your [specific thing] maps directly to [specific thing I built]" (e.g. Agentic RAG, Voice Agent).
- **Why this company?** → Something specific about the company/product.
- **Relevant experience?** → A quantified proof point from a real project or the Shamla Tech internship (e.g. "Built a 7-agent LangGraph RAG with ~200ms retrieval").
- **Good fit?** → "I sit at the intersection of [A] and [B], which is exactly where this role lives."
- **How did you hear?** → Honest: "Found through [portal/scan], evaluated against my criteria, and it scored highest."

> Prefer the `qa-bank` answers over ad-hoc generation. This tone guidance only
> applies when the router must adapt a near-match or draft a brand-new answer.

**Language**: Always in the language of the JD (EN default). Apply `/tech-translate`.

## Step 5 — Update Tracker

Record it in `data/applications.md` with all columns including Report and PDF as ✅.

**If any step fails**, continue with the next ones and mark the failed step as pending in the tracker.
