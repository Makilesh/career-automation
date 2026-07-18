# Career-Ops -- Makilesh's AI Job-Application System

## Origin

This is **Makilesh M's** personal fork of career-ops, customized to land an AI/ML fresher role at a good startup in his target cities (Bengaluru first) with near-zero manual effort per application. Owner identity, archetypes, scoring, templates, and the LLM/apply/email automation all reflect Makilesh's search.

Built on the open-source **career-ops** by [santifer](https://santifer.io) (MIT). Upstream credit retained per the license; see README.

**Everything here is customizable by the AI agent.** If the archetypes, filters, or scoring don't fit, just ask and the agent edits the files directly.

---

## Makilesh — Hard Rules (READ FIRST, NON-NEGOTIABLE)

These override any generic behavior below.

### Owner
Makilesh M — AI/ML Engineer (fresher, B.E. CSE, Sri Krishna College of Engineering and Technology, graduating May 2026, CGPA 8.0). Bengaluru, India. makilesh24225@gmail.com · +91 9894419452 · [github.com/Makilesh](https://github.com/Makilesh) · [makilesh.github.io](https://makilesh.github.io) · linkedin.com/in/makilesh.

### Fixed Documents — NEVER regenerate, rewrite, paraphrase, or "tailor"
1. **Resume:** ALWAYS attach `Makilesh_M_AI_Engineer_Resume.pdf` (repo root) **unmodified** to every application. NEVER run `generate-pdf.mjs` / `generate-latex.mjs` / `cv-sync-check.mjs` or the `pdf`/`latex` modes to produce a resume for a job. Those files stay in the repo but are bypassed. `cv.md` exists only as evaluation-reasoning context — never rendered or sent.
2. **Cover letter / intro message:** use `templates/cover-letter.md` **verbatim**. Only permitted edits: the job title in the final line, optionally the company name after "Hi Team". Never expand or reword.
3. **Referral outreach:** use `templates/referral-message.md` verbatim (only `{{name}}`/`{{company}}`/`{{role}}`).
4. **Follow-up email:** use `templates/followup-message.md` verbatim (only `{{role}}`/`{{company}}`).

### Automation rules
- **Email transport = Gmail MCP only** (`makilesh24225@gmail.com`). If Gmail MCP is not configured/errors, STOP and report — NEVER fall back to browser-automated Gmail. See §"Email Applications".
- **LinkedIn is never automated with Playwright** (ban risk). Referral mode only *prepares* messages; Makilesh sends them manually.
- **Human gate always on:** fill forms / draft answers / queue emails, but STOP before Submit/Send. Makilesh approves (batch approval supported) before anything leaves.
- **LLM cost target ₹0:** deterministic code first → local Qwen (Ollama) → Gemini free tier (rotated) only for high-value reasoning. See §"LLM Strategy".

## Data Contract (CRITICAL)

There are two layers. Read `DATA_CONTRACT.md` for the full list.

**User Layer (NEVER auto-updated, personalization goes HERE):**
- `cv.md`, `config/profile.yml`, `modes/_profile.md`, `article-digest.md`, `portals.yml`
- `data/*`, `reports/*`, `output/*`, `interview-prep/*`

**System Layer (auto-updatable, DON'T put user data here):**
- `modes/_shared.md`, `modes/oferta.md`, all other modes
- `AGENTS.md`, `CLAUDE.md`, `*.mjs` scripts (incl. `dashboard.mjs`), `templates/*`, `batch/*`

**THE RULE: When the user asks to customize anything (archetypes, narrative, negotiation scripts, proof points, location policy, comp targets), ALWAYS write to `modes/_profile.md` or `config/profile.yml`. NEVER edit `modes/_shared.md` for user-specific content.** This ensures system updates don't overwrite their customizations.

## Update Check

On the first message of each session, run the update checker silently:

```bash
node update-system.mjs check
```

Parse the JSON output:
- `{"status": "update-available", "local": "1.0.0", "remote": "1.1.0", "changelog": "..."}` → tell the user:
  > "career-ops update available (v{local} → v{remote}). Your data (CV, profile, tracker, reports) will NOT be touched. Want me to update?"
  If yes → run `node update-system.mjs apply`. If no → run `node update-system.mjs dismiss`.
- `{"status": "up-to-date"}` → say nothing
- `{"status": "dismissed"}` → say nothing
- `{"status": "offline"}` → say nothing
- `{"status": "no-remote-version"}` → say nothing (checker reached GitHub but neither VERSION nor the latest release tag parsed as semver — treat as a silent non-failure, same as offline)

The user can also say "check for updates" or "update career-ops" at any time to force a check.
To rollback: `node update-system.mjs rollback`

## What is career-ops

AI-powered, CLI-agnostic job search automation: pipeline tracking, offer evaluation, CV generation, portal scanning, batch processing. Runs on any AI coding CLI that follows the [open agent skill standard](https://agentskills.io) (Claude Code, Codex, Gemini, OpenCode, Qwen, Copilot, Kimi).

### Main Files

| File | Function |
|------|----------|
| `data/applications.md` | Application tracker |
| `data/pipeline.md` | Inbox of pending URLs |
| `data/scan-history.tsv` | Scanner dedup history |
| `portals.yml` | Query and company config |
| `templates/cv-template.html` | HTML template for CVs |
| `templates/cv-template.tex` | LaTeX/Overleaf template for CVs |
| `generate-pdf.mjs` | Playwright: HTML to PDF |
| `generate-latex.mjs` | LaTeX CV validator + pdflatex compiler |
| `article-digest.md` | Compact proof points from portfolio (optional) |
| `interview-prep/story-bank.md` | Accumulated STAR+R stories across evaluations |
| `interview-prep/{company}-{role}.md` | Company-specific interview intel reports |
| `analyze-patterns.mjs` | Pattern analysis script (JSON output) |
| `followup-cadence.mjs` | Follow-up cadence calculator (JSON output) |
| `data/follow-ups.md` | Follow-up history tracker |
| `scan.mjs` | Zero-token portal scanner — hits Greenhouse/Ashby/Lever APIs directly, zero LLM cost |
| `check-liveness.mjs` | Job posting liveness checker |
| `liveness-core.mjs` | Shared liveness logic (expired signals win over generic Apply text) |
| `reports/` | Evaluation reports (format: `{###}-{company-slug}-{YYYY-MM-DD}.md`). Blocks A-F + G (Posting Legitimacy). Header includes `**Legitimacy:** {tier}`. |

### First Run — Onboarding (IMPORTANT)

**Before doing ANYTHING else, check if the system is set up.** Run these checks silently every time a session starts:

1. Does `cv.md` exist?
2. Does `config/profile.yml` exist (not just profile.example.yml)?
3. Does `modes/_profile.md` exist (not just _profile.template.md)?
4. Does `portals.yml` exist (not just templates/portals.example.yml)?

If `modes/_profile.md` is missing, copy from `modes/_profile.template.md` silently. This is the user's customization file — it will never be overwritten by updates.

**If ANY of these is missing, enter onboarding mode.** Do NOT proceed with evaluations, scans, or any other mode until the basics are in place. Guide the user step by step:

#### Step 1: CV (required)
If `cv.md` is missing, ask:
> "I don't have your CV yet. You can either:
> 1. Paste your CV here and I'll convert it to markdown
> 2. Paste your LinkedIn URL and I'll extract the key info
> 3. Tell me about your experience and I'll draft a CV for you
>
> Which do you prefer?"

Create `cv.md` from whatever they provide. Make it clean markdown with standard sections (Summary, Experience, Projects, Education, Skills).

#### Step 2: Profile (required)
If `config/profile.yml` is missing, copy from `config/profile.example.yml` and then ask:
> "I need a few details to personalize the system:
> - Your full name and email
> - Your location and timezone
> - What roles are you targeting? (e.g., 'Senior Backend Engineer', 'AI Product Manager')
> - Your salary target range
>
> I'll set everything up for you."

Fill in `config/profile.yml` with their answers. For archetypes and targeting narrative, store the user-specific mapping in `modes/_profile.md` or `config/profile.yml` rather than editing `modes/_shared.md`.

#### Step 3: Portals (recommended)
If `portals.yml` is missing:
> "I'll set up the job scanner with 45+ pre-configured companies. Want me to customize the search keywords for your target roles?"

Copy `templates/portals.example.yml` → `portals.yml`. If they gave target roles in Step 2, update `title_filter.positive` to match.

#### Step 4: Tracker
If `data/applications.md` doesn't exist, create it:
```markdown
# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
```

#### Step 5: Get to know the user (important for quality)

After the basics are set up, proactively ask for more context. The more you know, the better your evaluations will be:

> "The basics are ready. But the system works much better when it knows you well. Can you tell me more about:
> - What makes you unique? What's your 'superpower' that other candidates don't have?
> - What kind of work excites you? What drains you?
> - Any deal-breakers? (e.g., no on-site, no startups under 20 people, no Java shops)
> - Your best professional achievement — the one you'd lead with in an interview
> - Any projects, articles, or case studies you've published?
>
> The more context you give me, the better I filter. Think of it as onboarding a recruiter — the first week I need to learn about you, then I become invaluable."

Store any insights the user shares in `config/profile.yml` (under narrative), `modes/_profile.md`, or in `article-digest.md` if they share proof points. Do not put user-specific archetypes or framing into `modes/_shared.md`.

**After every evaluation, learn.** If the user says "this score is too high, I wouldn't apply here" or "you missed that I have experience in X", update your understanding in `modes/_profile.md`, `config/profile.yml`, or `article-digest.md`. The system should get smarter with every interaction without putting personalization into system-layer files.

#### Step 6: Ready
Once all files exist, confirm:
> "You're all set! You can now:
> - Paste a job URL to evaluate it
> - Run `/career-ops scan` (or `/career-ops-scan` if using OpenCode) to search portals
> - Run `/career-ops` to see all commands
>
> Everything is customizable — just ask me to change anything.
>
> Tip: Makilesh's portfolio is live at makilesh.github.io — keep it linked in every application (the fixed cover letter already does)."

Then suggest automation:
> "Want me to scan for new offers automatically? I can set up a recurring scan every few days so you don't miss anything. Just say 'scan every 3 days' and I'll configure it."

If the user accepts, use the `/loop` or `/schedule` skill (if available) to set up a recurring `/career-ops scan` (or `/career-ops-scan` if using OpenCode). If those aren't available, suggest adding a cron job or remind them to run `/career-ops scan` (or `/career-ops-scan` if using OpenCode) periodically.

### Personalization

This system is designed to be customized by YOU (AI Agent). When the user asks you to change archetypes, translate modes, adjust scoring, add companies, or modify negotiation scripts -- do it directly. You read the same files you use, so you know exactly what to edit.

**Common customization requests:**
- "Change the archetypes to [backend/frontend/data/devops] roles" → edit `modes/_profile.md` or `config/profile.yml`
- "Translate the modes to English" → edit all files in `modes/`
- "Add these companies to my portals" → edit `portals.yml`
- "Update my profile" → edit `config/profile.yml`
- "Change the CV template design" → edit `templates/cv-template.html`
- "Adjust the scoring weights" → edit `modes/_profile.md` for user-specific weighting, or edit `modes/_shared.md` and `batch/batch-prompt.md` only when changing the shared system defaults for everyone

### Skill Modes

| If the user... | Mode |
|----------------|------|
| Pastes JD or URL | auto-pipeline (evaluate + report + tracker; NO resume gen — attach `Makilesh_M_AI_Engineer_Resume.pdf`) |
| Asks to evaluate offer | `oferta` |
| Asks to compare offers | `ofertas` |
| Wants to find ANY startup hiring in a location (not by name) | `discover` (config `discovered-companies.yml`; providers greenhouse/ashby/lever/smartrecruiters/workday) |
| Scans job boards & aggregators | `scan-boards` (config `portals-boards.yml`) |
| Scans direct startup career pages | `scan-startups` (config `startups.yml`) |
| Wants a full run (boards + startups → dedup → evaluate → apply queue) | `hunt` |
| Wants referral outreach prepared | `referral` (repurposes `contacto`; fixed template) |
| Asks for company research | `deep` |
| Preps for interview at specific company | `interview-prep` |
| Wants to generate CV/PDF | ⛔ DISABLED — resume is fixed (`Makilesh_M_AI_Engineer_Resume.pdf`); explain, don't generate |
| Evaluates a course/cert | `training` |
| Evaluates portfolio project | `project` |
| Asks about application status | `tracker` |
| Fills out application form | `apply` (profile + `qa-bank.mjs`, fixed resume + cover letter, human gate) |
| Searches for new offers | `scan-boards` / `scan-startups` (legacy `scan` still works) |
| Processes pending URLs | `pipeline` |
| Batch processes offers | `batch` |
| Asks about rejection patterns or wants to improve targeting | `patterns` |
| Asks about follow-ups or application cadence | `followup` |

### CV Source of Truth

- `cv.md` in project root is the canonical CV
- `article-digest.md` has detailed proof points (optional)
- **NEVER hardcode metrics** -- read them from these files at evaluation time

---

## Ethical Use -- CRITICAL

**This system is designed for quality, not quantity.** The goal is to help the user find and apply to roles where there is a genuine match -- not to spam companies with mass applications.

- **NEVER submit an application without the user reviewing it first.** Fill forms, draft answers, generate PDFs -- but always STOP before clicking Submit/Send/Apply. The user makes the final call.
- **Strongly discourage low-fit applications.** If a score is below 4.0/5, explicitly recommend against applying. The user's time and the recruiter's time are both valuable. Only proceed if the user has a specific reason to override the score.
- **Quality over speed.** A well-targeted application to 5 companies beats a generic blast to 50. Guide the user toward fewer, better applications.
- **Respect recruiters' time.** Every application a human reads costs someone's attention. Only send what's worth reading.

---

## Offer Verification -- MANDATORY

**NEVER trust WebSearch/WebFetch to verify if an offer is still active.** ALWAYS use Playwright:
1. `browser_navigate` to the URL
2. `browser_snapshot` to read content
3. Only footer/navbar without JD = closed. Title + description + Apply = active.

**Exception for batch workers (headless mode):** Playwright is not available in headless pipe mode. Use WebFetch as fallback and mark the report header with `**Verification:** unconfirmed (batch mode)`. The user can verify manually later.

---

## Headless / Batch Mode

When spawning headless workers for batch processing, use the appropriate command for your CLI:

| CLI | Command |
|-----|---------|
| Claude Code | `claude -p "prompt"` |
| Gemini CLI | `gemini -p "prompt"` |
| Copilot CLI | `copilot -p "prompt"` |
| Codex | `codex exec "prompt"` |
| OpenCode | `opencode run "prompt"` |
| Qwen | `qwen -p "prompt"` |

## LLM Strategy (cost target ₹0)

Router: `llm-router.mjs`. Two backends — **local Ollama `qwen2.5:14b`** (q4_K_M; falls back to `qwen2.5:7b` on OOM) and **Gemini free tier** (rotated). Usage tracked persistently in `data/llm-usage.json` (per-model RPM/RPD/TPM windows).

**Routing gate (checked on every call, in order):**
1. **Deterministic → plain code, NO LLM.** Info extraction, HTML parsing, keyword extraction, form-field detection, dedup, rule-based scoring, job/experience/location filtering, resume parsing. Use regex / parsers / Playwright selectors / string matching.
2. **Cheap reasoning → local Qwen.** JD cleanup, relevance prefilter, semantic similarity, qa-bank retrieval, embeddings, classification, first drafts, lightweight rewrites, test-mode runs.
3. **High-value reasoning → Gemini** (only when it materially improves the final application): adapting stored answers to company-specific questions, evaluating high-fit jobs pre-submission, deep company research, generating subjective answers with no qa-bank match, final quality review before submit.

**Gemini rotation & limits** (encoded in router; the ~150 combined pro RPD is the scarcest resource — spend on quality):

| Model | RPM | RPD | TPM | Role |
|---|---|---|---|---|
| gemini-3.5-flash | 10 | 1,500 | 250k | Default: evaluations & agentic steps |
| gemini-3.1-flash-lite | 15 | 1,000 | 250k | Bulk classification / quick scoring |
| gemini-2.5-flash | 10 | 1,500 | 250k | Overflow twin of 3.5-flash |
| gemini-3.1-pro-preview | 5 | 100 | 250k | Complex reasoning, final subjective answers |
| gemini-2.5-pro | 5 | 50 | 150k | Overflow deep reasoning |

Allocation: local Qwen for discardable → flash-lite triage → 3.5-flash (overflow 2.5-flash) evals & form answers → pro ONLY for shortlisted final answers + deep research. On 429/limit: rotate within tier → exponential backoff → if all Gemini exhausted, queue and/or degrade to Qwen with a warning. Batch prompts to stay under TPM. Every routing decision is logged in `llm-usage.json` for audit.

## Email Applications (Gmail MCP only)

Gmail MCP connected to `makilesh24225@gmail.com` is the PRIMARY and ONLY email transport. When a listing/startup has an HR/hiring email:
1. Body = `templates/cover-letter.md` verbatim. Subject = `Application — {role} — Makilesh M (AI/ML Fresher)`.
2. Attach `Makilesh_M_AI_Engineer_Resume.pdf`.
3. Dedup: check tracker + `data/email-log.json` — NEVER send twice for the same company+role.
4. Daily cap (default 20, configurable in `config/profile.yml` → `email.daily_cap`); follow-ups count toward it.
5. Send via Gmail MCP → log `{message_id, timestamp, company, role, type}` in `data/email-log.json` + tracker.
6. If Gmail MCP is unconfigured or errors → **STOP and report. NEVER browser-automate Gmail.**
7. **NEVER send or draft an email to Makilesh's own address (makilesh24225@gmail.com)** — no run summaries, no test emails, no self-notifications. Results are reported in chat and the tracker only.

## Apply Flow (fast human gate)

`scan-boards`/`scan-startups`/`hunt` → dedup → evaluate (fresher-weighted, threshold default 3.5/5) → apply queue → Playwright fills forms from `config/profile.yml` + `qa-bank.mjs`, attaches fixed resume, inserts fixed cover letter → **compact review card per application** (company, role, answers used, NEW questions) with batch approval ("approve all" / "approve 1,3,5") → submit approved → tracker → `Applied` with timestamp + URL. Email applications follow §Email with the same one-click approval. The human gate is what makes the qa-bank learning loop safe — never bypass it.

### Anti-ban (don't get the accounts flagged)

- **LinkedIn: never automate with Playwright** — no auto-connect, auto-message, or scraping while logged in. Referral mode only prepares messages; Makilesh sends them by hand. Use only public/logged-out people-search URLs for discovery.
- **Forms: behave like a human.** Default headed; fill at a human pace (small random delays between fields, no instant bulk submits); one application at a time, never parallel Playwright sessions; realistic user-agent; don't retry-hammer a failing form.
- **Email (Gmail MCP): respect the daily cap** (default 500, follow-ups included), never double-send (dedup via `email-log.json`), no identical blasts — the fixed templates + per-company review keep volume human.
- **Scanning: prefer the zero-token ATS APIs**; throttle WebSearch/Playwright, honor robots/rate limits, and keep the existing concurrency limits. If a site returns 403/429, back off — don't loop.
- Location preference (onsite/hybrid: Bangalore → Hyderabad → Chennai, ~100 km; remote/Coimbatore deprioritized) is in `config/profile.yml` → `location_tiers` and `modes/_profile.md`.

## Stack and Conventions

- Node.js (mjs modules), Playwright (scraping + form fill), YAML (config), Markdown (data). Ollama (local LLM) + Gemini API (rotated) + Gmail MCP (email).
- Scripts in `.mjs`, configuration in YAML
- Output in `output/` (gitignored), Reports in `reports/`
- JDs in `jds/` (referenced as `local:jds/{file}` in pipeline.md)
- Batch in `batch/` (gitignored except scripts and prompt)
- Report numbering: sequential 3-digit zero-padded, max existing + 1
- **RULE: After each batch of evaluations, run `node merge-tracker.mjs`** to merge tracker additions and avoid duplications.
- **RULE: NEVER create new entries in applications.md if company+role already exists.** Update the existing entry.

### TSV Format for Tracker Additions

Write one TSV file per evaluation to `batch/tracker-additions/{num}-{company-slug}.tsv`. Single line, 9 tab-separated columns:

```
{num}\t{date}\t{company}\t{role}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{num}-{slug}-{date}.md)\t{note}
```

**Column order (IMPORTANT -- status BEFORE score):**
1. `num` -- sequential number (integer)
2. `date` -- YYYY-MM-DD
3. `company` -- short company name
4. `role` -- job title
5. `status` -- canonical status (e.g., `Evaluated`)
6. `score` -- format `X.X/5` (e.g., `4.2/5`)
7. `pdf` -- `✅` or `❌`
8. `report` -- markdown link `[num](reports/...)`
9. `notes` -- one-line summary

**Note:** In applications.md, score comes BEFORE status. The merge script handles this column swap automatically.

### Pipeline Integrity

1. **NEVER edit applications.md to ADD new entries** -- Write TSV in `batch/tracker-additions/` and `merge-tracker.mjs` handles the merge.
2. **YES you can edit applications.md to UPDATE status/notes of existing entries.**
3. All reports MUST include `**URL:**` in the header (between Score and PDF). Include `**Legitimacy:** {tier}` (see Block G in `modes/oferta.md`).
4. All statuses MUST be canonical (see `templates/states.yml`).
5. Health check: `node verify-pipeline.mjs`
6. Normalize statuses: `node normalize-statuses.mjs`
7. Dedup: `node dedup-tracker.mjs`

### Canonical States (applications.md)

**Source of truth:** `templates/states.yml`

| State | When to use |
|-------|-------------|
| `Evaluated` | Report completed, pending decision |
| `Applied` | Application sent |
| `Responded` | Company responded |
| `Interview` | In interview process |
| `Offer` | Offer received |
| `Rejected` | Rejected by company |
| `Discarded` | Discarded by candidate or offer closed |
| `SKIP` | Doesn't fit, don't apply |

**RULES:**
- No markdown bold (`**`) in status field
- No dates in status field (use the date column)
- No extra text (use the notes column)
