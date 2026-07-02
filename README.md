# career-automation — Makilesh's AI Job-Application System

A personal, near-zero-effort job-application pipeline for landing an **AI/ML
fresher role at a good startup** (Bengaluru first). It scans boards and startup
career pages, evaluates fit, fills forms from a self-learning answer bank, and
sends applications — all behind a human approval gate, at **₹0 LLM cost**.

Built on the open-source [career-ops](https://github.com/santifer/career-ops) by
[santifer](https://santifer.io) (MIT). This fork replaces the identity, archetypes,
scoring, and adds a fixed-resume policy, a self-learning Q&A bank, a local+cloud
LLM router, and Gmail-based applications.

> **Owner:** Makilesh M — AI/ML Engineer (fresher, B.E. CSE, SKCET, May 2026).
> Bengaluru · [github.com/Makilesh](https://github.com/Makilesh) · [makilesh.github.io](https://makilesh.github.io)

---

## What makes this fork different

| Area | Behavior |
|------|----------|
| **Resume** | FIXED — `Resume_Makilesh.pdf` attached to every application, never generated or "tailored" (§4) |
| **Cover letter** | FIXED — `templates/cover-letter.md`, used verbatim (§5) |
| **Two scan modes** | `scan-boards` (LinkedIn/Naukri/Wellfound/YC… via `portals-boards.yml`) + `scan-startups` (direct career pages via `startups.yml`); `hunt` runs both end-to-end (§3) |
| **Recency filter** | `--posted 1h\|same-day\|24h\|3d\|7d` (default 24h), board-native where possible (§2) |
| **Q&A bank** | `data/qa-bank.yml` + `qa-bank.mjs` — matches locally, adapts near-misses, pauses for new personal questions and learns them (§6) |
| **LLM router** | `llm-router.mjs` — local Ollama `qwen2.5:14b` for cheap work, Gemini free tier (rotated, limit-tracked) only for high-value reasoning (§7) |
| **Email** | Gmail MCP only — no browser-automated email, ever (§9) |
| **Human gate** | Nothing is submitted/sent without batch approval (§10) |
| **Referral + follow-up** | Fixed templates, one follow-up at 6 days, LinkedIn never automated (§11) |

## Quick start

```bash
npm install                      # playwright, js-yaml, dotenv, @google/generative-ai
cp .env.example .env             # add GEMINI_API_KEY (optional; router degrades to local)
ollama pull qwen2.5:14b          # local model (q4_K_M ~ 12GB VRAM); qwen2.5:7b fallback
ollama pull nomic-embed-text     # embeddings for qa-bank semantic match
node llm-router.mjs check        # verify Ollama + Gemini key
npm run doctor                   # health check
```

Connect the **Gmail MCP** (claude.ai connector settings, or `/mcp` in an
interactive Claude Code session) to enable email applications.

## Commands

| Command | What it does |
|---------|--------------|
| `/career-ops hunt` | Boards + startups → dedup → evaluate → apply queue (one shot) |
| `/career-ops scan-boards` | Scan job boards & aggregators (`portals-boards.yml`) |
| `/career-ops scan-startups` | Scan direct startup career pages (`startups.yml`) |
| `/career-ops add-startup <name>` | Find + verify a startup's careers page, append to `startups.yml` |
| `/career-ops apply` | Fill a form from profile + qa-bank, attach resume, review, submit |
| `/career-ops referral <company>` | Prepare fixed referral messages (you send on LinkedIn) |
| `/career-ops followup` | Queue the 6-day, one-time follow-up via Gmail MCP |
| `/career-ops tracker` | Application status + stats |

CLI helpers: `node scan.mjs --config startups.yml --posted 7d`,
`node qa-bank.mjs answer "..."`, `node llm-router.mjs usage`,
`node followup-cadence.mjs --summary`.

## LLM cost policy (₹0)

Every task is gated: **deterministic → plain code**, **cheap → local Qwen**,
**high-value only → Gemini** (rotated across `gemini-3.5-flash` / `flash-lite` /
`2.5-flash` / pro models within free-tier RPM/RPD/TPM limits, tracked in
`data/llm-usage.json`). On limit-hit it rotates, backs off, then degrades to local
Qwen. See `AGENTS.md → LLM Strategy`.

## Config you own

`config/profile.yml`, `cv.md`, `modes/_profile.md`, `portals-boards.yml`,
`startups.yml`, `templates/*.md`, and everything under `data/` — the agent edits
these for you; just ask ("add X to my startups", "tighten the filters", …).

## License & disclaimer

MIT (see [LICENSE](LICENSE)). Upstream career-ops © santifer, MIT. Please read
[LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) — use responsibly, respect recruiters'
time, and keep quality over quantity.
