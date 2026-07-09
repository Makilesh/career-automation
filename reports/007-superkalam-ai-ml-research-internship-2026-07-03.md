# Evaluation: SuperKalam — AI/ML Research (Internship)

**Date:** 2026-07-03
**URL:** https://www.workatastartup.com/jobs/64551
**Archetype:** Hybrid — GenAI/LLM Engineer + AI Agent/Automation Engineer + Voice AI Engineer
**Score:** 4.3/5
**Legitimacy:** High Confidence
**PDF:** ✅ (Resume_Makilesh.pdf, fixed)

---

## A) Role Summary

| Field | Value |
|---|---|
| Archetype | GenAI/LLM Engineer + AI Agent/Automation + Voice AI (hybrid) |
| Domain | EdTech — AI-powered personal mentor for test prep, agentic workflows + voice (STT/TTS) + RAG/knowledge graphs |
| Function | Build — pipelines, dataset prep, experimentation, fine-tuning |
| Seniority | Internship (4–6+ months), explicitly wants "prior internship in AI/ML or quality projects" — fresher/portfolio-friendly |
| Remote | Remote / Bengaluru preferred — aligns with P1 city priority |
| Team size | Small, YC W23 batch |
| TL;DR | Remote/Bengaluru AI/ML research internship at a YC-backed edtech building agentic, voice-enabled mentorship — near-exact skill match, but applies via an external Google Form + Loom-video walkthrough rather than a standard ATS. |

## B) Match with CV

| JD Requirement | CV Evidence |
|---|---|
| Must-have: built agentic workflows / AI pipelines | AI CMO Multi-Agent System, Agentic RAG System, Exit Interview Bot (7-state agent) — cv.md |
| Worked on AI voice agents using STT/TTS | AI-Powered Voice Agent: Whisper STT, Kokoro TTS — cv.md |
| Worked on quality retrieval RAGs or knowledge graphs | Agentic RAG System (Milvus hybrid search + RRF), AI Legal Engine (673+ IPC docs) — cv.md |
| Understands prompt engineering techniques | Demonstrated across all LLM projects — cv.md |
| Comfortable with GitHub | Full public GitHub portfolio (github.com/Makilesh) — cv.md |
| Bonus: trained models in text/image/voice | CUA-DELC Lung Disease Classifier (image ensemble), Voice Agent (voice) — cv.md |

**Gaps:**

1. **Bonus: "built dashboards/workflows using Claude Code / Codex"** — not evidenced in cv.md. Bonus-only, not essential; no mitigation needed beyond honesty if asked.
2. **Bonus: PostgreSQL specifically** — cv.md lists MySQL, not Postgres. Bonus-only, transfers directly (both relational SQL).
3. **Application funnel is a Google Form + required Loom video of top 2 projects** — not a standard ATS. This changes the apply-mode workflow: needs a manual form fill and a recorded walkthrough rather than qa-bank auto-fill. Flag explicitly in the apply queue.

## C) Level and Strategy

1. **Level detected vs. natural level:** Internship explicitly seeking "prior internship or quality projects" — exact match to the candidate's actual level.
2. **Sell senior without lying:** Candidate's portfolio (7-agent LangGraph RAG, production-latency voice agent, multi-classifier agent state machine) exceeds the typical intern applicant bar — use the required Loom video to make that depth visible rather than relying on a resume line.
3. **If they downlevel:** Not applicable — this is the candidate's home level. Use portfolio strength to negotiate the stipend toward the top of the ₹25–40K/month band.

## D) Comp and Demand

| Signal | Data | Source |
|---|---|---|
| Posted stipend | ₹25K–40K/month (₹3–4.8L annualized) | JD posting |
| Comparable roles at same company | Mobile Engineer Intern and Fullstack Intern at SuperKalam both ₹25–45K/month | workatastartup.com company page |
| Comparable market rate | Internshala fresher ML internships range ₹10K–99K/month | WebSearch |
| Company signal | YC W23 batch, multiple concurrent internship openings (Mobile, Fullstack) | workatastartup.com |

Stipend is mid-range — below Peakflo's, in line with SuperKalam's own other internship postings. No public funding/layoff data surfaced beyond the YC batch listing.

## E) Framing Priorities (resume is fixed — no CV edits; intro-message/interview and Loom-video framing only)

1. Lead with Agentic RAG System + AI CMO Multi-Agent System — directly answers the "must have: agentic workflows" bar.
2. Cite the Voice Agent's STT/TTS work for the voice-agent requirement.
3. For the required Loom video, walk through exactly 2 strongest projects per their explicit ask (they specify "top 2 projects").
4. Mention GitHub portfolio explicitly; note Google Colab familiarity as a standard fresher tool even though not itemized in cv.md.
5. Include portfolio URL and relevant GitHub links per profile rule.

## F) Interview Plan

| # | JD Requirement | STAR+R Story | Reflection |
|---|---|---|---|
| 1 | Must have: built agentic workflows/AI pipelines | Agentic RAG System: self-corrective loop, re-retrieves on low-confidence scores | A hard retry cap (2 re-retrievals) prevented the loop from masking a genuinely bad query rather than fixing it |
| 2 | Worked on AI voice agents using STT/TTS | AI-Powered Voice Agent: Whisper STT + Kokoro TTS, <150ms barge-in detection | Barge-in handling was harder to get right than either STT or TTS individually |
| 3 | Agentic pipeline depth | AI CMO Multi-Agent System: 4-agent LangGraph+CrewAI, up to 3 replanning iterations | Multi-agent systems fail silently without a critique/rejection step — added one deliberately |
| 4 | Quality retrieval RAGs | Milvus hybrid dense+BM25 search fused via RRF (~200ms) | Pure dense retrieval missed exact-keyword queries; hybrid fusion fixed the recall gap |
| 5 | Bonus: trained models in image/voice | CUA-DELC Lung Disease Classifier: confidence/uncertainty-weighted ensemble (InceptionV3+MobileNetV2+VGG19) | Calibration (temperature scaling) mattered more for trustworthy uncertainty than raw ensemble accuracy |
| 6 | Agentic depth, real-time multi-classifier systems | Exit Interview Bot: 7-state machine, 3 concurrent LangChain classifiers per turn | Running classifiers concurrently per turn kept latency acceptable without sacrificing signal richness |

**Recommended case study:** Agentic RAG System + AI-Powered Voice Agent — these are the two projects to feature in the required Loom video, directly answering their explicit "top 2 projects" ask.

**Availability note:** Candidate graduated May 2026 (current date 2026-07-03) — fully available immediately, no class-schedule conflict with the internship's "some classes per week" flexibility caveat.

## G) Posting Legitimacy

| Signal | Finding | Weight |
|---|---|---|
| Company hiring activity | 5 other concurrently open roles at SuperKalam (Mobile Engineer, Product Designer, Fullstack Intern, etc.) | Positive |
| Posting date | Not shown on the WaaS page | Neutral |
| Description quality | Extremely specific — explicit multi-round interview process, named tools (Colab, GitHub, Claude Code/Codex), exact tenure/stipend | Positive |
| Requirements realism | Realistic for an internship (prior internship OR quality projects — not years) | Positive |
| Company signals | YC W23 batch, live product (AI test-prep mentor) | Positive |
| Application flow | External Google Form + required Loom video, not a standard ATS | Neutral — unusual but explained by a small, informal-process team, not itself a red flag |
| Reposting pattern | Not in scan-history.tsv (new discovery) | Neutral |

**Assessment: High Confidence** — actively hiring YC startup with a highly specific, internally consistent posting; the non-standard application flow is a process quirk, not a legitimacy concern.

---

## Keywords extracted

Agentic workflows, AI pipelines, voice agents, STT, TTS, RAG, knowledge graphs, prompt engineering, GitHub, Google Colab, fine-tuning, LangGraph, CrewAI, edtech, YC W23, internship, Bengaluru, remote India, Claude Code, PostgreSQL
