# Evaluation: QuantumLoopAI — AI/ML & Prompt Engineer LLM, RAG & Voice Agent

**Date:** 2026-07-03
**URL:** https://apply.workable.com/quantumloopai/j/B7F8DA3F6C/
**Archetype:** Hybrid — GenAI/LLM Engineer (RAG) + Voice AI Engineer
**Score:** 4.0/5
**Legitimacy:** High Confidence
**PDF:** ✅ (Resume_Makilesh.pdf, fixed)

---

## A) Role Summary

| Field | Value |
|---|---|
| Archetype | GenAI/LLM Engineer (RAG) + Voice AI Engineer (hybrid) |
| Domain | Healthcare AI product — EMMA, a DTAC-certified AI receptionist for NHS GP surgeries |
| Function | Build — own the LLM/RAG/voice-agent stack end to end |
| Seniority | Not years-gated; JD explicitly values "shipped projects or open-source contributions" over credentials, but scope reads mid-level (mentors junior engineers) |
| Remote | Full remote from India, aligned to UK business hours (9:00–18:00 GMT/BST) |
| Team size | Not disclosed; small, fast-moving, pre-Series A (seed-funded) |
| TL;DR | Remote LLM/RAG/voice-agent engineering role for a UK healthtech startup automating GP-surgery reception — strong archetype fit, but pulls in a NestJS/Azure backend stack beyond the typical AI-fresher toolkit. |

## B) Match with CV

| JD Requirement | CV Evidence |
|---|---|
| Hands-on prompt engineering, LLMs, RAG, voice-agent/dialogue design with shipped work | Agentic RAG System (7-agent LangGraph, self-corrective retrieval, ~200ms Milvus hybrid search) + AI-Powered Voice Agent (200–500ms E2E STT+LLM+TTS, <150ms barge-in) — cv.md Projects |
| Advanced Python for ML/AI | Python across all projects; Asyncio/Threading in Voice Agent — cv.md Skills, Projects |
| Voice-agent dialogue flows, low latency | AI-Powered Voice Agent: Kokoro-82M 40–90ms first-byte TTS, RMS-based barge-in — cv.md |
| Prior production telephony/voice deployment | AI Voice Calling Agent, Shamla Tech internship: Twilio + Pinecone, 80% reduction in manual call handling — cv.md Work Experience |
| RESTful API design | FastAPI backend (Agentic RAG System), Flask (internship stack) — cv.md |
| Docker / containerized deployment | Agentic RAG System deployed via Docker Compose — cv.md |
| MySQL | Listed under Cloud & Tools — cv.md Skills |

**Gaps:**

1. **NestJS backend / Next.js-React integration** — listed as Essential. Not a hard blocker: candidate has FastAPI/Flask API experience and React.js in the language list, so the gap is framework-specific, not conceptual. Mitigation: name the transferable API-design experience directly in the intro message rather than waiting to be asked.
2. **Azure services (App Services, Functions, Cognitive Services)** — listed as Essential. Candidate's cloud experience is AWS (EC2/S3/Lambda) + Azure OpenAI only. Mitigation: frame as cloud-agnostic (AWS Lambda ≈ Azure Functions) and cite existing Azure OpenAI usage as a foothold.
3. **UK business-hours overlap (9am–6pm GMT/BST = ~1:30pm–10:30pm IST)** — not a skill gap but a lifestyle constraint worth confirming with Makilesh before applying.

## C) Level and Strategy

1. **Level detected vs. natural level:** JD reads mid-level in scope (owns the AI stack, mentors juniors) but explicitly waives years-of-experience in favor of demonstrated shipped work — an unusually generous entry point for a fresher with a strong production-flavored portfolio.
2. **Sell senior without lying:** Lead with hard numbers — 200ms Milvus retrieval, 200–500ms E2E voice latency, 80% reduction in manual call handling — these read as production rigor independent of title. Position the Shamla Tech AI Voice Calling Agent as direct precedent for "voice agent in a regulated, customer-facing environment" (finance/telephony → healthcare is a reasonable analogy).
3. **If they downlevel:** Accept a junior/associate title if comp lands in the ₹8–12 LPA target band, with a defined 6-month review and the NestJS/Azure ramp treated as explicit onboarding support rather than a day-one expectation.

## D) Comp and Demand

| Signal | Data | Source |
|---|---|---|
| GenAI/RAG fresher pay band, India | ₹8–15 LPA typical; up to ₹25–40 LPA at 2–3 yrs with RAG+Python | buildfastwithai.com, testleaf.com 2026 salary guides |
| This posting's comp | "Competitive package depending on experience" + share options; no number disclosed | JD text |
| Company funding | £6M+ seed raised, 2M+ patients served via EMMA, DTAC-certified | Healthcare Today, quantumloopai.com |
| Market demand | Voice AI + RAG named as most sought-after India specializations for 2026 | Instahyre salary blog |

No explicit salary figure in the posting — flag this as a first-message question rather than an assumption.

## E) Framing Priorities (resume is fixed — no CV edits; this is intro-message/interview framing only)

1. Lead with the Voice Agent + Agentic RAG project links in the opening message.
2. Cite the Twilio+Pinecone production deployment as direct proof of the "shipped, not toy" bar the JD sets.
3. Proactively name the NestJS/Azure gap in the first message rather than let it surface as a rejection reason — frame as fast-ramp given adjacent stack experience.
4. Confirm comfort with UK-hours async collaboration explicitly (the JD flags this as a requirement, not a nice-to-have).
5. Include portfolio URL (makilesh.github.io) and GitHub links to the Voice Agent + Agentic RAG repos.

## F) Interview Plan

| # | JD Requirement | STAR+R Story | Reflection |
|---|---|---|---|
| 1 | "Own the intelligence behind EMMA" | AI Voice Calling Agent (Twilio+Pinecone, persistent memory, 80% call-handling reduction) | Learned to treat conversation memory as a first-class design constraint, not an afterthought |
| 2 | Voice-agent dialogue flows, reduce latency | AI-Powered Voice Agent: barge-in detection via RMS energy + selective echo suppression | Latency budgets force architectural trade-offs early, not post-hoc optimization |
| 3 | Architect and deploy LLM/RAG systems | Agentic RAG System: self-corrective loop, re-retrieves on low-confidence scores | Confidence thresholds need tuning per domain — a fixed 0.7 cutoff isn't universal |
| 4 | Retrieve accurate clinical/domain information | Milvus hybrid search (dense + BM25 via RRF) at ~200ms | Hybrid retrieval beats pure dense search on domain-specific terminology |
| 5 | Instrument pipelines, troubleshoot edge cases | Lead Gen Pipeline: async scraping across Reddit/Discord/Slack/LinkedIn with fallback design | Edge cases cluster around rate limits and API inconsistency — build fallback paths early |
| 6 | Compliance-aware, safety-conscious AI in a regulated domain | AI Legal Engine: hybrid RAG over 673+ IPC documents | Handling authoritative source documents taught the cost of retrieval hallucination in high-stakes domains |

**Recommended case study:** AI-Powered Voice Agent (most direct one-to-one match to the role's voice-agent core).

**Red-flag question:** "Why apply to a UK-hours remote role as a fresher?" → Answer: portfolio was already built around async, cross-timezone collaboration (Discord/Slack/Reddit sourcing); UK hours are a scheduling preference, not a capability gap.

## G) Posting Legitimacy

| Signal | Finding | Weight |
|---|---|---|
| Apply button | Active, functional application flow (not redirected to a generic page) | Positive |
| Posting date | Not shown on the page | Neutral |
| Description quality | Highly specific — names EMMA, GP surgeries, DTAC/GDPR, exact tech stack (NestJS, Next.js, Azure, MySQL), mentoring scope | Positive |
| Requirements realism | No years-of-experience gate; explicitly values shipped work — unusual for a stack-heavy JD but consistent with a lean startup | Neutral/Positive |
| Company hiring signals | £6M+ seed raised, live NHS integration, 2M+ patients served, no layoff signals found | Positive |
| Reposting pattern | Not previously seen in scan-history.tsv (new discovery) | Neutral |

**Assessment: High Confidence** — real, actively hiring startup with a live, specific posting.

**Context notes:** Early-stage startup, so some description vagueness around org structure is expected and not weighted as a concern.

---

## Keywords extracted

LLM, RAG, prompt engineering, voice agent, dialogue systems, NestJS, Next.js, React, Azure, Docker, MySQL, microservices, RESTful API, GraphQL, GDPR, DTAC, MLOps, model governance, telephony, clinical safety, Python, prompt architecture, conversational AI, healthcare AI, remote India, UK business hours
