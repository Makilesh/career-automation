# 📘 career-ops User Manual — Makilesh's Job-Application System

*Last updated: 2026-07-03. This is YOUR operating manual — how the system works,
what to type, what happens automatically, and what still needs your finger on
the button.*

---

## 1. What this system is (in one paragraph)

You talk to Claude Code inside this repo. It finds fresh AI/ML fresher jobs
(job boards + startup career pages), scores each one against your CV (1–5),
fills the application forms using answers it has learned about you, attaches
your **fixed resume** and **fixed cover letter**, and stops — showing you a
review card. You say "approve all" (or pick numbers), it submits, and the
tracker is updated. Six days later it queues one polite follow-up email.
Nothing is ever sent without your approval, and the LLM cost is ₹0 (local
Ollama + Gemini free tier).

---

## 2. The five unbreakable rules (already wired in)

1. **Resume is fixed.** `Resume_Makilesh.pdf` (repo root) goes out unmodified,
   every time. The system will refuse to "generate" or "tailor" a resume.
2. **Cover letter is fixed.** `templates/cover-letter.md`, verbatim. Only the
   job title in the last line (and optionally the company name) changes.
3. **Email = Gmail MCP only.** Never browser-automated Gmail.
4. **LinkedIn is never automated.** Referral messages are prepared for you;
   you send them by hand.
5. **Human gate.** Forms get filled, emails get drafted — but Submit/Send waits
   for you. This also keeps your accounts from getting flagged.

If you ever want to change one of these, edit `AGENTS.md` → "Hard Rules".

---

## 3. Daily workflow (the happy path)

Open Claude Code in this repo and type:

```
/career-ops hunt
```

That one command does: scan boards (last 24h) → scan startup pages → dedup →
evaluate each new offer → queue everything scoring ≥ 3.5/5 → fill the forms →
show you review cards → wait.

You respond with:
- `approve all` — submit everything
- `approve 1,3` — submit only those
- `skip 2` — drop one

Then, every few days:

```
/career-ops followup      ← queues the 6-day follow-up emails (one per company, ever)
/career-ops tracker       ← see where everything stands
```

That's the whole job search. Everything below is detail.

---

## 4. All commands

| Command | What it does | When to use |
|---|---|---|
| `/career-ops hunt` | Full run: both scans → evaluate → apply queue → review cards | Daily driver |
| `/career-ops scan-boards` | Scan LinkedIn/Naukri/Instahyre/Cutshort/Wellfound/Internshala/Hirist/foundit/YC + ATS searches | When you only want discovery, no applying |
| `/career-ops scan-startups` | Scan the 26-company watchlist's own career pages | Weekly — startup pages change slowly |
| `/career-ops add-startup Groq` | Finds + verifies Groq's careers page, adds it to the watchlist | Whenever you hear of a startup you like |
| *paste a job URL or JD* | Evaluates it, writes a report, updates tracker | Someone sends you a job link |
| `/career-ops apply` | Fill the form open in the browser using your qa-bank | You're on an application page right now |
| `/career-ops referral Sarvam` | Finds 2–3 people (alumni/engineers/recruiters) + prepares the fixed message | Right after applying somewhere you care about |
| `/career-ops followup` | Queues one follow-up email for 6-day-old silent applications | Every 2–3 days |
| `/career-ops tracker` | Status dashboard + stats | Anytime |
| `/career-ops deep Observe.AI` | Deep company research | Before an interview or a high-stakes application |
| `/career-ops interview-prep {company}` | Interview intel report | Interview scheduled |
| `/career-ops patterns` | Rejection pattern analysis | After ~15+ applications |
| `/career-ops pdf` | ⛔ Disabled — will explain the fixed-resume policy | Don't |

**Useful CLI one-liners** (terminal, no Claude needed):

```bash
node scan.mjs --config startups.yml --posted 7d --dry-run   # preview startup scan, zero LLM cost
node scan.mjs --config portals-boards.yml --posted same-day # tightest recency
node qa-bank.mjs list                                       # see everything the bank knows about you
node qa-bank.mjs answer "Why should we hire you?"           # test an answer lookup
node llm-router.mjs check                                   # is Ollama up? Gemini key set?
node llm-router.mjs usage                                   # Gemini quota consumption
node followup-cadence.mjs --summary                         # who's due a follow-up
npm run doctor                                              # health check
```

**Flags that work on scans:** `--posted 1h|same-day|24h|3d|7d` (recency),
`--headed`/`--headless` (browser visibility), `--dry-run`, `--company <name>`,
`--verify` (Playwright-check each URL is a live posting).

---

## 5. How each piece works

### 5.1 Scanning (₹0 cost)
- **`portals-boards.yml`** — 13 board/aggregator queries. LinkedIn uses its own
  freshness filter (`f_TPR=r86400` = 24h) and experience filter (`f_E=1,2` =
  intern/entry). Titles must hit ≥1 positive keyword and 0 negative ones;
  locations pass your allow-list (Bangalore/Hyderabad/Chennai/India/Pune).
- **`startups.yml`** — 26 companies. The Ashby/Greenhouse/Lever ones are fetched
  via their public JSON APIs (instant, free); the custom/Workday ones (Zoho,
  Razorpay, Fractal, Krutrim…) need Playwright, so the agent visits them.
- Anything older than the recency window is never shown to you.
- Everything seen is remembered in `data/scan-history.tsv` so you never see a
  duplicate.

### 5.2 Evaluation
Each new offer gets an A–G report in `reports/` (skills match, archetype fit,
comp, culture, red flags, global score, posting-legitimacy check). Your 5
archetypes: AI/ML Engineer · GenAI/LLM (RAG, agents) · AI Agent/Automation ·
Voice AI · Data Scientist. Score ≥ 3.5 → apply queue. Score < 3.5 → SKIP (it
will discourage you from applying; you can override).

### 5.3 The qa-bank (your answer memory) — `data/qa-bank.yml`
Every form question goes through `qa-bank.mjs`:
- **Exact match** → pastes your stored answer (name, email, CGPA, notice period,
  expected CTC ₹8–12 LPA, work auth, relocation preference — all pre-seeded).
- **Similar question** → adapts the closest stored answers (Gemini), pastes it,
  and **saves the new Q&A** so next time it's an exact match.
- **Brand-new personal question** (motivation, salary edge cases, visa) → it
  **stops and asks you in chat**, saves your answer, continues. It never invents
  personal answers.
The bank gets smarter with every application. You can edit the YAML by hand
anytime — it's just questions and answers.

### 5.4 LLM router (₹0 policy) — `llm-router.mjs`
Deterministic work (parsing, filtering, dedup) = plain code, no LLM.
Cheap reasoning (relevance checks, qa-bank matching) = **local Qwen via Ollama**.
High-value only (evaluations, adapting answers, deep research) = **Gemini free
tier**, rotated across 5 models within their RPM/RPD/TPM limits (tracked in
`data/llm-usage.json`). If Gemini is exhausted it degrades to local Qwen with a
warning. You should never pay a rupee.

### 5.5 Email applications — `modes/email.md`
When a startup has an HR email: body = your fixed cover letter, subject
`Application — {role} — Makilesh M (AI/ML Fresher)`, resume attached.
**Your current Gmail MCP can create drafts but not send** — so approved emails
land in your Gmail **Drafts folder**; you review and hit Send (double
human-gate). Every email is logged in `data/email-log.json` — the system will
never email the same company+role twice, and respects a 20/day cap.

### 5.6 Referrals & follow-ups
- **Referral:** after you apply, `/career-ops referral {company}` surfaces 2–3
  LinkedIn profiles (SKCET alumni, team engineers, recruiters) with a
  ready-to-copy fixed message. You paste and send manually.
- **Follow-up:** exactly one per company, 6 days after applying with no reply,
  fixed template, via Gmail (drafts), logged.

---

## 6. Files you own (edit freely) vs. leave alone

**Yours — edit anytime (or just ask the agent to):**

| File | Contains |
|---|---|
| `config/profile.yml` | Identity, CTC, location tiers, email cap, thresholds, setup answers |
| `modes/_profile.md` | Archetype framing, negotiation scripts, location policy |
| `data/qa-bank.yml` | Your learned form answers |
| `portals-boards.yml` | Board queries + title/location filters |
| `startups.yml` | Startup watchlist |
| `cv.md` | Evaluation context (NOT sent anywhere) |
| `templates/cover-letter.md`, `referral-message.md`, `followup-message.md` | Your three fixed texts — edit the wording once, then it's locked verbatim |

**System — don't hand-edit unless you know why:** `*.mjs` scripts, `modes/*.md`
(other than `_profile.md`), `AGENTS.md`, `.agents/skills/`.

**Generated — never edit by hand:** `data/scan-history.tsv`,
`data/email-log.json`, `data/llm-usage.json`, `data/qa-embeddings.json`,
`reports/`. (`data/applications.md` — status/notes edits OK, new rows only via
the merge script.)

---

## 7. Setup status & maintenance

**Already done ✅:** Gemini key, Ollama + qwen2.5:14b, Gmail MCP (draft mode),
CTC/recency/browser defaults, location preference (onsite/hybrid,
Bangalore → Hyderabad → Chennai, ~100 km), anti-ban rules.

**Do once, recommended:**
```bash
ollama pull nomic-embed-text     # upgrades qa-bank matching from string-similarity to semantic
```

**Occasional maintenance:**
```bash
npm run doctor                   # health check
node verify-pipeline.mjs         # tracker integrity
node dedup-tracker.mjs           # remove tracker duplicates
node merge-tracker.mjs           # merge pending evaluation rows (agent runs this itself)
node test-all.mjs                # full test suite (74 checks pass; 4 known failures, see below)
```

**Known/accepted test failures (not bugs):**
- *Dashboard build failed* — the optional Go dashboard needs Go installed. Ignore
  it, or install Go if you want the web dashboard.
- *3 × "User file IS tracked"* — upstream wants `profile.yml`/`_profile.md`/
  `portals.yml` gitignored; you deliberately commit yours since this is a private
  personal fork. Fine as-is **as long as this repo stays private** (it contains
  your phone number and preferences).

**Updating from upstream career-ops:** `node update-system.mjs apply` is now
**blocked by default** because an upstream pull would overwrite your customized
files. If you ever really want upstream changes: `apply --force`, then review
the diff (a backup branch is auto-created; `rollback` restores it).

---

## 8. Suggested cleanup (add/remove)

**Safe to delete (leftover scratch):**
- `prompt1.md`, `prompt2.md` — the build instructions, no longer needed
- `readme2.md` — superseded by the rewritten `README.md`
- `README.es.md`, `README.ja.md`, `README.cn.md`, `README.ko-KR.md`,
  `README.pt-BR.md`, `README.ru.md`, `README.zh-TW.md` — upstream's translated
  READMEs, irrelevant to your fork
- `modes/de/ fr/ ja/ pt/ ru/` — language mode packs you'll never use (keep if
  you might apply to DACH/Japan remote roles)
- `.gemini/commands/` and `.opencode/commands/` — stale command definitions for
  other CLIs (they still reference the old `pdf`/`scan` modes). Delete if you
  only use Claude Code; ask me to regenerate them if you switch CLIs.
- `venv/` — a Python venv in a Node project; delete unless you put it there.

**Worth adding over time:**
- More startups: just say *"add {company} to my startups"*.
- An `hr_email:` on `startups.yml` entries when you find one — that unlocks the
  email-application path for that company.
- Your answers to new subjective questions accumulate automatically in the
  qa-bank — glance at `node qa-bank.mjs list` monthly and prune anything stale.
- A recurring scan: say *"scan every day at 9am"* and the agent sets up a
  schedule.

**One thing to watch:** something in your environment auto-commits and sometimes
reformats files in this repo (it has introduced YAML syntax errors twice). If
that's a VS Code extension or agent you run, be aware it can corrupt configs —
`npm run doctor` + the YAML checks in `node test-all.mjs` will catch it.

---

## 9. Troubleshooting

| Symptom | Fix |
|---|---|
| "Ollama unreachable" | `ollama serve`, then `ollama pull qwen2.5:14b` |
| Gemini quota warnings / degraded answers | `node llm-router.mjs usage` — wait for the daily window, or let it run on local Qwen |
| Emails not sending | They're **drafts** — open Gmail → Drafts, review, send. Confirm in chat so the log flips to `sent` |
| Same job showing again | It shouldn't — check `data/scan-history.tsv`; the URL must appear there |
| A startup's scan errors 404 | Their careers page moved — say *"fix the careers URL for {company}"* |
| Form-fill looks robotic/fast | It shouldn't be (anti-ban pacing is in AGENTS.md) — if you see instant bulk fills, stop and tell the agent |
| Want to see the browser / hide it | `--headed` / `--headless`, or edit `automation:` in `config/profile.yml` |
| Scores feel wrong | Tell the agent *"this score is too high/low because…"* — it updates `modes/_profile.md` and learns |

---

## 10. Where everything lives (quick map)

```
Resume_Makilesh.pdf      ← the ONLY resume that ever goes out
templates/               ← your 3 fixed texts (cover letter, referral, follow-up)
config/profile.yml       ← all your settings
portals-boards.yml       ← board scan config      → /career-ops scan-boards
startups.yml             ← startup watchlist       → /career-ops scan-startups
modes/                   ← the agent's playbooks (hunt, apply, email, referral…)
data/applications.md     ← the tracker (your single source of truth)
data/qa-bank.yml         ← learned answers
data/email-log.json      ← every email drafted/sent (dedup + daily cap)
reports/                 ← one evaluation report per job
scan.mjs / llm-router.mjs / qa-bank.mjs / followup-cadence.mjs  ← the engines
```

*Questions? Just ask in chat — "why did X score 3.2?", "loosen the title
filter", "show me this week's pipeline". The agent edits its own configs.*
