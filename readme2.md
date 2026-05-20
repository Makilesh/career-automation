# Career-Ops (readme2)

Career-Ops turns an AI coding CLI into a job-search command center. It evaluates roles, generates tailored PDFs, scans portals, and keeps a single source-of-truth tracker. This file is a practical, project-wide guide for working with the repo and its workflows.

## What this project does

1. **Evaluate offers** with a structured A–F scoring system and a weighted 1–5 score.
2. **Generate ATS-friendly PDFs** customized for each job.
3. **Scan job portals** (Ashby, Greenhouse, Lever, etc.) with zero-token discovery.
4. **Batch-process many offers** using headless workers.
5. **Track everything** in a canonical tracker with integrity checks.

It is **not** a mass-apply tool. It recommends against applying below 4.0/5 and never submits applications on your behalf.

## Quick start

```bash
git clone https://github.com/santifer/career-ops.git
cd career-ops
npm install
npx playwright install chromium
```

```bash
cp config/profile.example.yml config/profile.yml
cp templates/portals.example.yml portals.yml
```

Create `cv.md` in the project root (markdown CV). Then run your CLI (Claude Code, Gemini CLI, OpenCode, etc.) in this directory and paste a job URL or JD.

## Core files you will edit

These are **user-layer** files (safe from updates):

| File | Purpose |
|------|---------|
| `cv.md` | Your canonical CV (markdown) |
| `config/profile.yml` | Identity, target roles, narrative, comp range |
| `modes/_profile.md` | Archetypes + personalization tables |
| `article-digest.md` | Optional proof points |
| `portals.yml` | Portal scanner configuration |
| `data/*` | Pipeline and tracker data |
| `reports/*` | Evaluation reports |
| `output/*` | Generated PDFs |
| `interview-prep/*` | Interview prep artifacts |

System files (scripts, modes, templates) are auto-updatable and should not be personalized directly. See `DATA_CONTRACT.md` for the full list.

## Main workflows

### 1. Evaluate a single job (auto-pipeline)
Paste a job URL or JD text in your CLI. The system:

1. Extracts the JD (Playwright or WebFetch)
2. Detects archetype
3. Runs A–F evaluation blocks
4. Writes a report in `reports/`
5. Generates a tailored PDF in `output/`
6. Creates a tracker TSV in `batch/tracker-additions/`

### 2. Scan for new offers
```bash
npm run scan
```
Reads `portals.yml`, hits ATS APIs, and appends to `data/pipeline.md`. Add `--verify` to drop expired posts.

### 3. Process pipeline inbox
Use `/career-ops pipeline` (CLI command) to process pending URLs in `data/pipeline.md`.

### 4. Generate a PDF on demand
```bash
npm run pdf -- input.html output.pdf
```
Uses `templates/cv-template.html` with Playwright.

### 5. Batch processing
The batch runner spawns headless workers that generate reports, PDFs, and TSV tracker additions in parallel. See `docs/ARCHITECTURE.md` and `batch/batch-runner.sh`.

### 6. Tracker integrity
Use these scripts to keep the tracker clean:

```bash
npm run verify
npm run normalize
npm run dedup
npm run merge
```

## Scripts (npm run)

| Command | Purpose |
|---------|---------|
| `npm run doctor` | Validate prerequisites |
| `npm run verify` | Validate pipeline integrity |
| `npm run normalize` | Normalize statuses |
| `npm run dedup` | Deduplicate tracker |
| `npm run merge` | Merge batch TSVs |
| `npm run pdf` | HTML → PDF |
| `npm run scan` | Portal scan |
| `npm run liveness` | URL liveness check |
| `npm run update` | Update system-layer files |
| `npm run rollback` | Roll back last update |

Full details: `docs/SCRIPTS.md`.

## Project structure (high-level)

```
career-ops/
├── AGENTS.md                 # CLI-agnostic agent instructions
├── CLAUDE.md / GEMINI.md     # CLI wrappers (import AGENTS.md)
├── cv.md                     # Your CV (user-layer)
├── config/profile.yml        # Your profile (user-layer)
├── modes/                    # Agent modes and language packs
├── templates/                # CV templates, states, portals example
├── data/                     # Pipeline and tracker data (user-layer)
├── reports/                  # Generated reports (user-layer)
├── output/                   # Generated PDFs (user-layer)
├── batch/                    # Batch prompt and runner
├── dashboard/                # Go TUI for tracking
└── docs/                     # Setup, architecture, customization
```

## Personalization rules (important)

- Put **all personalizations** in `config/profile.yml`, `modes/_profile.md`, `article-digest.md`, and `portals.yml`.
- Do **not** edit `modes/_shared.md` for personal data. Updates overwrite system-layer files.
- Your CV and proof points are the **source of truth** used during evaluation and PDF generation.

See `docs/CUSTOMIZATION.md` for details.

## Modes and language packs

Modes live in `modes/` and are the core evaluation prompts. Language packs exist under `modes/de`, `modes/fr`, `modes/ja`, `modes/pt`, and `modes/ru`. The system can switch to those directories based on your profile or when targeting non-English postings.

## Output and naming conventions

- Reports: `reports/{###}-{company-slug}-{YYYY-MM-DD}.md`
- PDFs: `output/cv-candidate-{company-slug}-{YYYY-MM-DD}.pdf`
- Tracker TSV additions: `batch/tracker-additions/{id}.tsv`

Tracker integrity is enforced by `verify-pipeline.mjs` and `merge-tracker.mjs`.

## Dashboard (optional)

```bash
cd dashboard
go build -o career-dashboard .
./career-dashboard --path ..
```

Provides a TUI to filter and sort your pipeline.

## Updates and rollback

```bash
npm run update
npm run rollback
```

Updates only replace **system-layer** files. User-layer files are never touched.

## Where to look next

- `docs/SETUP.md` for setup steps
- `docs/ARCHITECTURE.md` for system flow
- `docs/CUSTOMIZATION.md` for personalization
- `docs/SCRIPTS.md` for script behavior
- `templates/README.md` for PDF/portal template details
