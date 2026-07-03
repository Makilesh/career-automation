---
name: career-ops
description: Makilesh's AI job-application system — scan boards & startup pages, evaluate offers, fill forms from the qa-bank, send email applications via Gmail, prepare referrals and follow-ups. Use for any job-search request (evaluate a JD/URL, scan, hunt, apply, tracker, referral, followup).
---

# career-ops — Skill Router (Makilesh's fork)

**FIRST: read `AGENTS.md` in the repo root** — it contains the non-negotiable
hard rules (fixed resume `Resume_Makilesh.pdf`, verbatim templates, Gmail MCP
only, human gate, ₹0 LLM policy, anti-ban rules). Then read `modes/_shared.md`
followed by `modes/_profile.md` (user overrides win).

## Command → mode routing

| Command / intent | Read and follow |
|------------------|-----------------|
| (no args) — show help | List the commands below |
| JD text or URL pasted | `modes/auto-pipeline.md` |
| `hunt` | `modes/hunt.md` |
| `scan-boards` | `modes/scan-boards.md` (config `portals-boards.yml`) |
| `scan-startups` | `modes/scan-startups.md` (config `startups.yml`) |
| `scan` (legacy) | `modes/scan.md` |
| `add-startup <name>` | `modes/scan-startups.md` → "add-startup command" |
| `evaluate` / offer eval | `modes/oferta.md` |
| `compare` | `modes/ofertas.md` |
| `apply` | `modes/apply.md` |
| `email` | `modes/email.md` |
| `referral <company>` | `modes/referral.md` |
| `followup` | `modes/followup.md` |
| `contact` (generic outreach) | `modes/contacto.md` |
| `deep <company>` | `modes/deep.md` |
| `interview-prep <company>` | `modes/interview-prep.md` |
| `tracker` | `modes/tracker.md` |
| `pipeline` | `modes/pipeline.md` |
| `batch` | `modes/batch.md` |
| `patterns` | `modes/patterns.md` |
| `training` | `modes/training.md` |
| `project` | `modes/project.md` |
| `pdf` / `latex` / CV generation | ⛔ DISABLED — explain the fixed-resume policy (`modes/pdf.md` header); never generate |

## Always

- Attach `Resume_Makilesh.pdf` unmodified; cover letter = `templates/cover-letter.md` verbatim.
- Answers for forms come from `node qa-bank.mjs answer "<q>" --company <c> --role <r>`.
- STOP before any Submit/Send — show review cards, wait for batch approval.
- Email only via Gmail MCP; if unavailable, stop and report.
- Track every evaluation (TSV → `node merge-tracker.mjs`); update statuses per `templates/states.yml`.
