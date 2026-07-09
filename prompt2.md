# Prompt for Claude Code — paste inside the `career-automation` repo (github.com/Makilesh/career-automation)

You are customizing this fork of career-ops into Makilesh's personal job-application system. The goal: land an AI/ML fresher role at a good startup in my target cities, with near-zero manual effort per application.

**Step 0 — Audit first.** Read AGENTS.md, CLAUDE.md, modes/_shared.md, all modes/*.md, config/, templates/portals.example.yml, and the .mjs scripts BEFORE editing. For every section below, check whether it's already implemented (fully or partially) and skip or extend accordingly — do not redo finished work and do not rebuild what exists (scanner, tracker, dedup, batch, dashboard all stay). After the audit, print a short checklist of DONE / PARTIAL / TODO per section, then proceed.

## 1. Owner profile (replace ALL of the original author's identity everywhere)

- Name: Makilesh M — AI/ML Engineer (fresher, B.E. CSE, Sri Krishna College of Engineering and Technology, graduating May 2026, CGPA 8.0)
- Location: Bengaluru, Karnataka, India
- Email: makilesh24225@gmail.com | Phone: +91 9894419452
- LinkedIn: linkedin.com/in/makilesh | GitHub: github.com/Makilesh | Portfolio: makilesh.github.io
- Certifications: Oracle OCI 2025 Generative AI Professional, Oracle OCI 2025 Data Science Professional
- Experience: AI Developer Intern at Shamla Tech Solutions (Sep 2025–Feb 2026) — multi-platform lead-scraping pipeline (94.6% LLM call reduction), AI Voice Calling Agent (Twilio + Pinecone), real-time meeting assistant with 10-speaker diarization
- Flagship projects: M&A Diligence RAG Engine (8-agent LangGraph, hybrid dense+sparse retrieval on Qdrant, RRF fusion, cross-encoder reranking, 76 automated tests) and a real-time full-duplex Voice Agent (200–400 ms E2E latency, Kokoro-82M TTS, Silero VAD, multi-provider LLM fallback)
- Core skills: Python, LLMs, RAG, LangChain/LangGraph, CrewAI, AutoGen, multi-agent systems, vector DBs (Pinecone, Qdrant, FAISS, ChromaDB, Weaviate, Milvus), PyTorch, TensorFlow, Hugging Face, Whisper, FastAPI, Docker, AWS, Azure OpenAI, n8n, Playwright

Extract Resume_Makilesh.pdf (repo root — add it if missing) into cv.md for evaluation reasoning. Fill config/profile.yml. Rewrite modes/_shared.md for a FRESHER profile. Translate any Spanish modes to English. Remove all santifer references, archetypes, and proof points. Replace archetypes with: (1) AI/ML Engineer (0–1 yr), (2) GenAI/LLM Engineer (RAG, agents), (3) AI Agent/Automation Engineer, (4) Voice AI Engineer, (5) Data Scientist / ML fresher.

## 2. Hard filters (configurable defaults; confirm with me on first run)

- Experience: "fresher", "entry level", "new grad", "junior", "0–1 years", intern-with-PPO. REJECT anything requiring 2+ years.
- Location: Bengaluru (P1), Remote-India (P2), Chennai / Coimbatore / Hyderabad / Pune (P3 — ask before applying).
- Recency: add a `--posted` flag to scanning: `1h`, `same-day`, `24h`, `3d`, `7d` (default `24h`). Use native date filters where available (LinkedIn `f_TPR=r86400`, Naukri freshness, ATS `updated_at`) and fall back to parsing posted dates. Never surface listings older than the window.
- Keywords: AI Engineer, ML Engineer, GenAI, LLM, RAG, AI Agent, NLP, Voice AI, Machine Learning, Python (AI).
- Exclusions: pure frontend, sales/BPO, unpaid roles, staffing spam, 3+ yrs requirements.
- Startup bias: scoring should reward funded early/growth-stage startups in target cities; deprioritize mass-recruiting service companies unless I opt in.

## 3. Two distinct scan/apply modes (this is a key requirement)

Create/refactor into two separate modes with their own configs, both feeding the same tracker and dedup:

**A. `/career-ops scan-boards` — job boards & aggregators.** Config: `portals-boards.yml`. Sources: LinkedIn Jobs, Naukri, Instahyre, Cutshort, Wellfound, Internshala (jobs/PPO), Hirist, foundit, Y Combinator Work at a Startup, plus Ashby/Greenhouse/Lever/Workable search queries scoped to India/remote. Applies board-native recency + experience filters.

**B. `/career-ops scan-startups` — direct startup career pages.** Config: `startups.yml` — a watchlist where each entry has: company name, careers URL, ATS type (greenhouse/lever/ashby/workable/notion/custom), city, and an optional HR/careers email. The mode navigates each careers page with Playwright, detects the ATS, extracts open roles matching my filters, and can go straight to `apply` on that company's own portal. Seed the watchlist with India-relevant AI startups hiring early-career — e.g. Sarvam AI, Krutrim, Yellow.ai, Gnani.ai, Haptik, CoRover, Observe.AI, Skit.ai, Mad Street Den, Fractal, Tiger Analytics, Zoho, Freshworks, Chargebee, Postman, Razorpay — plus remote-friendly global AI startups (LangChain, Pinecone, Deepgram, Vapi, ElevenLabs). VERIFY every careers URL resolves before saving it; drop dead links. Add an easy command for me to append a startup by just giving a name (you find the careers page).

Also add `/career-ops hunt` = scan-boards + scan-startups → dedup → evaluate → apply queue, in one shot.

## 4. Resume policy — DO NOT generate resumes

Bypass the per-job CV generation pipeline (pdf mode, generate-pdf.mjs, generate-latex.mjs, cv-sync-check) — don't delete the files, just make all modes and the auto-pipeline skip resume generation. Every application MUST attach the existing `Resume_Makilesh.pdf` unmodified. Never rewrite, re-render, or "tailor" it. Hard rule — write it into AGENTS.md and _shared.md.

## 5. Cover letter / email — fixed template, no regeneration

Create `templates/cover-letter.md` with EXACTLY this text. Use verbatim everywhere a cover letter or intro message is required; the ONLY permitted substitutions are the job title in the final line and optionally the company name after "Hi Team". Never paraphrase or expand it. Add this rule to AGENTS.md.

```
Hi Team,
Hope you're doing well.
I'm Makilesh, a Computer Science Engineering student and aspiring AI/ML engineer with hands-on experience building AI agents, LLM-powered applications, RAG pipelines, Voice AI systems, and automation workflows.
I've worked on 40+ AI/ML projects involving AI agents, LLMs, RAG pipelines, automation systems, LangGraph, vector databases, and real-world GenAI applications. I enjoy building autonomous workflows, experimenting with agent orchestration and memory systems, and solving practical engineering problems in fast-paced environments.
I have experience working with Python, machine learning frameworks, APIs, vector databases, and end-to-end AI application development, and I'm highly interested in starting my career in AI/ML engineering.
Portfolio: https://makilesh.github.io/
GitHub: https://github.com/Makilesh
LinkedIn: https://in.linkedin.com/in/makilesh
Please find my resume attached. I'd be happy to discuss further if my profile aligns with the AI/ML Fresher role.
Thank you,
Makilesh
```

## 6. Self-learning Q&A answer bank (local file, ask once → reuse or adapt)

Create `data/qa-bank.yml` (gitignored) + a `qa-bank.mjs` helper wired into apply mode. Behavior for every application-form question:
1. Normalize the question and search the bank for relevancy (fuzzy/semantic match — use the LOCAL LLM or embeddings for this, never Gemini).
2. Exact/near-exact match → paste the stored answer as-is (fill {{company}}/{{role}} placeholders).
3. Similar-but-not-identical → use the LLM router (Section 7) to ADAPT the closest stored answers into a new answer, paste it, and APPEND the new question+answer to the bank — but first check the bank for a duplicate entry and skip appending if it already exists.
4. No match at all AND subjective/personal (salary, motivation, availability, visa) → PAUSE, ask me in chat, store my answer with tags + date, continue. Never invent answers to unmatched personal questions.
Pre-seed with: name, email, phone, location (Bengaluru), notice period (immediate), current CTC (fresher — N/A), degree/college/CGPA/graduation (May 2026), work authorization (Indian citizen, no sponsorship needed in India), LinkedIn/GitHub/portfolio URLs. Ask me ONCE at setup for: expected CTC, relocation cities, earliest joining date — store them.

## 7. LLM strategy — Gemini free tier with rotation + local Qwen 2.5 14B

Build a provider router (`llm-router.mjs` or extend gemini-eval.mjs) with two backends:

**Local (free, unlimited):** Ollama running `qwen2.5:14b` (quantized to fit my RTX 5070 Ti 12 GB VRAM / 32 GB RAM — use q4_K_M; if OOM, fall back to qwen2.5:7b). Route ALL cheap/"dummy" work here: JD text cleanup, keyword extraction, relevance prefiltering, dedup/similarity checks, qa-bank semantic matching, test-mode runs, and first-draft generation.

**Gemini API (free tier — GEMINI_API_KEY in .env):** rotate across models according to these exact limits, tracked persistently in `data/llm-usage.json` (per-model RPM, RPD, TPM counters with day/minute windows):

| Model | RPM | RPD | TPM | Context | Role |
|---|---|---|---|---|---|
| gemini-3.5-flash | 10 | 1,500 | 250,000 | 1M | Default for evaluations & agentic steps |
| gemini-3.1-flash-lite | 15 | 1,000 | 250,000 | 1M | Bulk classification / quick scoring |
| gemini-2.5-flash | 10 | 1,500 | 250,000 | 1M | Overflow twin of 3.5-flash |
| gemini-3.1-pro-preview | 5 | 100 | 250,000 | 1M | Complex reasoning, final subjective answers |
| gemini-2.5-pro | 5 | 50 | 150,000 | 1M | Overflow deep reasoning |

Allocation policy (encode this): local Qwen for everything discardable → flash-lite for high-volume triage → 3.5-flash (overflow to 2.5-flash) for full evaluations and form-answer generation → pro models ONLY for shortlisted applications' final subjective answers and deep company research (budget: their combined 150 RPD is the scarcest resource — spend it on quality, since the end product must be highly effective). On 429/limit-hit: rotate to the next model in the same tier, exponential backoff, and if all Gemini models are exhausted queue the task and/or degrade to local Qwen with a warning. Batch prompts where possible to stay under TPM. Total cost target: ₹0 — free tier + local only.

### 7.1 LLM optimization policy (IMPORTANT)

Further optimize LLM usage to minimize unnecessary Gemini API calls:

- **Never use ANY LLM for deterministic tasks.** Basic information extraction, HTML parsing, keyword extraction, form-field detection, duplicate detection, rule-based scoring, job filtering, experience/location matching, and resume parsing must be done with traditional code (regex, parsers, Cheerio, Playwright selectors, string matching) whenever possible.
- **Use local Qwen** for semantic similarity, qa-bank retrieval, embeddings, classification, first-draft generation, lightweight rewriting, and other inexpensive reasoning.
- **Reserve Gemini** only for tasks where higher-quality reasoning materially improves the final application: adapting stored answers to company-specific questions; evaluating high-fit jobs before submission; deep company/startup research; generating high-quality subjective responses when no suitable qa-bank answer exists; and a final application quality review before submission.
- **Gate every Gemini call:** before calling, the router must determine whether the task can be completed with plain code or the local model — if so, do not call Gemini. Log the routing decision in llm-usage.json so I can audit where cloud calls are going.
- Objective: maximize application quality while minimizing cloud usage, keeping Gemini focused solely on high-value reasoning and comfortably within free-tier limits.

## 8. Headed + headless browser modes

If not already present: add a global `--headed` / `--headless` toggle (env var + CLI flag) for all Playwright automation. Default: headed for testing/debugging (so I can watch form-filling), headless for production runs. Persist the choice in config with per-mode override.

## 9. Email applications — Gmail MCP only

Use the Gmail MCP server connected to `makilesh24225@gmail.com` as the PRIMARY and ONLY email transport. When a listing/startup entry has an HR or hiring email: compose the email from the fixed cover-letter template (Section 5), subject like "Application — {role} — Makilesh M (AI/ML Fresher)", attach `Resume_Makilesh.pdf`, send via Gmail MCP, and log the Gmail message ID + timestamp + company + role into the tracker. Dedup: never send twice for the same company+role (check tracker + a `data/email-log.json` before sending). Cap outbound at a sane daily limit (default 20/day, configurable) to avoid spam flags. If the Gmail MCP is not configured or errors, STOP and report the issue to me — do NOT fall back to browser-automated Gmail.

## 10. Apply flow — fast human gate

Pipeline: scan (A/B/hunt) → dedup → evaluate (fresher-weighted scoring; threshold configurable, default 3.5/5) → apply queue → Playwright fills forms from profile + qa-bank, attaches the fixed resume, inserts the fixed cover letter → show me a compact review card per application (company, role, answers used, NEW questions) with batch approval ("approve all", "approve 1,3,5") → submit approved → tracker updated to Applied with timestamp + URL. Email-based applications follow Section 9 with the same one-click approval. Keep the human gate — it's what makes the qa-bank learning loop safe.

## 11. Referral outreach + follow-up cadence (fixed messages, same for everyone)

**A. `/career-ops referral` mode** (repurpose the `contacto` mode skeleton). After each job enters the apply queue or is Applied: search for 2nd-degree LinkedIn connections, SKCET alumni, or engineers/recruiters at that company (use WebSearch / LinkedIn people-search URLs — do NOT automate LinkedIn actions with Playwright; account bans are common). Output 2–3 candidate contacts per company with their profile URLs, plus a ready-to-copy message using EXACTLY this fixed template (only {{name}}, {{company}}, {{role}} substituted — never rewrite the body):

```
Hi {{name}},
I recently applied for the {{role}} position at {{company}} and wanted to reach out directly. I'm Makilesh, a final-year CSE student and AI/ML engineer — I've built production-grade RAG pipelines, multi-agent systems (LangGraph), and real-time Voice AI, along with 40+ AI/ML projects.
If you feel my profile could be a fit, I'd be grateful for a referral or for my application to be passed along. Happy to share my resume and portfolio: https://makilesh.github.io/
Thank you for your time!
— Makilesh
```

I send these manually on LinkedIn; the mode just prepares them and logs contact + date in the tracker. If a contact's email is found, it MAY send via Gmail MCP with my approval, following Section 9's dedup and daily cap.

**B. Follow-up cadence.** Wire `followup-cadence.mjs` into the tracker: any application in Applied status with no reply after 6 days gets queued for ONE follow-up (never more than one per company+role). Sent via Gmail MCP with batch approval, using EXACTLY this fixed template (only {{role}}/{{company}} substituted):

```
Hi Team,
Hope you're doing well. I applied for the {{role}} position at {{company}} last week and wanted to follow up, as I'm very interested in the opportunity.
I'm a final-year CSE student with hands-on experience building AI agents, RAG pipelines, and Voice AI systems (40+ AI/ML projects). My resume is attached again for convenience.
I'd be glad to discuss further if my profile aligns. Thank you for your time!
Best regards,
Makilesh
Portfolio: https://makilesh.github.io/ | GitHub: https://github.com/Makilesh
```

Log every follow-up (message ID, timestamp) in email-log.json and the tracker; follow-ups count toward the daily email cap. Add both templates as files under templates/ and reference them from AGENTS.md with the same "verbatim, no regeneration" rule as the cover letter.

## 12. Housekeeping

- Rewrite README.md for MY setup (fresher, Bengaluru startups, fixed resume + cover letter, qa-bank, LLM router, Gmail MCP); credit upstream santifer/career-ops; keep MIT + LEGAL_DISCLAIMER.md.
- Ensure data/, reports/, output/, qa-bank.yml, email-log.json, llm-usage.json, .env stay gitignored.
- Run `npm run doctor` + tests at the end; fix breakage from these changes.
- Finish with the one-time setup questions in a single batch: expected CTC, relocation cities, joining date, default recency (24h or same-day), headed-or-headless default, and confirmation that GEMINI_API_KEY, Ollama+qwen2.5:14b, and Gmail MCP are set up.

Work incrementally: after each section print a one-line summary of what changed. Do not spend tokens rewriting the resume or cover letter — both are fixed inputs.