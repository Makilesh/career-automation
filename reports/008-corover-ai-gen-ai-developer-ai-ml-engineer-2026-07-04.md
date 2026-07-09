# Evaluation: CoRover.ai — Gen AI Developer/AI ML Engineer

**Date:** 2026-07-04
**URL:** https://corover.ai/company/careers/gen-ai-developer
**Archetype:** GenAI / LLM Engineer (RAG, agents)
**Score:** 4.5/5
**Legitimacy:** High Confidence
**PDF:** ✅ (Resume_Makilesh.pdf, fixed)

---

## A) Role Summary

| Field | Value |
|---|---|
| Archetype | GenAI/LLM Engineer (RAG, agents) |
| Domain | Conversational AI platform (BharatGPT) — LLM/RAG services, agentic workflows, MCP tool integrations |
| Function | Build — own core LLM/RAG services and the AI integration layer |
| Seniority | Not years-gated; JD lists required skills, not years of experience |
| Remote | On-site, Bengaluru |
| Team size | ~111 employees (per Tracxn, 2026) |
| TL;DR | On-site Bengaluru GenAI engineering role at India's BharatGPT conversational-AI platform — near line-for-line match to the Agentic RAG System project, with no years-of-experience gate. |

## B) Match with CV

| JD Requirement | CV Evidence |
|---|---|
| Build LLM/RAG services in Python (FastAPI, Pydantic) | Agentic RAG System: FastAPI backend, Python — cv.md Projects |
| Agentic AI workflows — tool-using agents, planning, memory, multi-step execution | Agentic RAG System (7-agent LangGraph, self-corrective loop), AI CMO Multi-Agent System (4-agent LangGraph+CrewAI), Exit Interview Bot (7-state agent) — cv.md |
| RAG pipelines: ingestion, chunking, embeddings, indexing, reranking (pgvector/FAISS/Pinecone) | Agentic RAG System: Milvus 2.4 hybrid search, Sentence Transformers dense + BM25 sparse fused via RRF, ~200ms retrieval — cv.md |
| Prompt versioning, evaluation techniques | Agentic RAG System's confidence-scored query rewrite loop — cv.md |
| Agentic frameworks (LangChain, LlamaIndex, CrewAI) | LangChain, LangGraph, CrewAI, AutoGen all listed — cv.md Skills |
| Vector databases (pgvector/FAISS/Pinecone) | Milvus, Pinecone, FAISS, ChromaDB, Weaviate all listed — cv.md Skills |
| Streaming APIs (SSE/WebSockets) | Exit Interview Bot: 4 voice modes via WebSocket — cv.md |
| Observability tooling | GAP — not evidenced |
| CI/CD, DevOps in AI/ML context | Docker Compose deployment (Agentic RAG System) — partial match |

**Gaps:**

1. **Observability tooling (OpenTelemetry, Grafana, Prometheus)** — not evidenced in cv.md. Listed as "required skill" but is infrastructure-adjacent, not core AI logic; mitigate by noting Docker-based deployment experience and willingness to ramp quickly.
2. **MCP (Model Context Protocol) tool adapters** — a newer, specific integration pattern not named in cv.md, though conceptually adjacent to the agentic tool-use work already done (LangGraph agents calling tools). Frame as a natural extension of existing agent-orchestration experience.
3. **AuthN/Z, tenancy, enterprise connectors (SharePoint, Confluence, Slack, Jira)** — partial: candidate has Slack SDK integration experience (Lead Gen Pipeline) but not the enterprise auth/tenancy layer. Nice-to-have relative to the core LLM/RAG ask.

## C) Level and Strategy

1. **Level detected vs. natural level:** The JD's scope (own core LLM/RAG services, guardrails, observability, CI/CD) reads mid-level, but there is no explicit years requirement — skills-gated, not tenure-gated. Candidate's Agentic RAG System project covers the technical core (LLM/RAG/agents/vector DB) almost exactly.
2. **Sell senior without lying:** Lead with the concrete architecture choices already shipped — hybrid dense+sparse retrieval via RRF, self-corrective query rewrite loop, Docker Compose deployment — these map directly onto "RAG pipelines... reranking" and "CI/CD for prompts, retrieval configs" in the JD.
3. **If they downlevel:** Accept an associate/junior title if comp is fair (₹8-12 LPA target), with observability and MCP/enterprise-connector work treated as an onboarding ramp rather than a day-one requirement.

## D) Comp and Demand

| Signal | Data | Source |
|---|---|---|
| Company funding | $5.72M total raised over 8 rounds; HDFC Bank's first GenAI investment went to CoRover | Tracxn, Businessworld |
| Company momentum | "Rs 100 Cr pipeline... increases focus on revenue, hiring" (2026 coverage) | Businessworld |
| GenAI/RAG fresher pay band, India | ₹8–15 LPA typical for fresher GenAI/RAG roles with strong portfolio | WebSearch salary guides (buildfastwithai.com, testleaf.com) |
| This posting's comp | Not disclosed in JD | corover.ai |

No layoff or hiring-freeze signals found; coverage points the opposite direction (actively hiring, revenue-focused).

## E) Framing Priorities (resume is fixed — no CV edits; intro-message/interview framing only)

1. Lead with the Agentic RAG System — its architecture (hybrid Milvus search, self-corrective loop, Docker deployment) maps almost one-to-one to the JD's core responsibilities.
2. Cite the AI CMO Multi-Agent System and Exit Interview Bot for the "agentic workflows... tool-using agents" requirement.
3. Proactively note the observability and MCP gaps as fast-ramp items rather than blockers.
4. Mention portfolio URL and GitHub links to the Agentic RAG System repo specifically.
5. Bengaluru on-site aligns with P1 location priority — no location caveat needed.

## F) Interview Plan

| # | JD Requirement | STAR+R Story | Reflection |
|---|---|---|---|
| 1 | Build LLM/RAG services in Python with clean, tested APIs | Agentic RAG System: FastAPI backend + Streamlit frontend, Docker Compose deployment | Separating retrieval and generation into distinct services made the self-corrective loop much easier to test in isolation |
| 2 | Agentic workflows — tool-using agents with planning, memory, recovery/fallback | AI CMO Multi-Agent System: 4-agent LangGraph+CrewAI pipeline with a critique/rejection step, up to 3 replanning iterations | A hard iteration cap kept the replanning loop from thrashing when the critique agent kept rejecting outputs |
| 3 | RAG pipelines: chunking, embeddings, indexing, reranking | Agentic RAG System: 384-dim Sentence Transformer embeddings + BM25 sparse vectors fused via Reciprocal Rank Fusion at ~200ms | Hybrid retrieval fixed exact-keyword misses that pure dense embeddings were missing |
| 4 | Prompt versioning, evaluation, regression testing | Agentic RAG System: query rewrite triggered below a 0.7 confidence score, capped at 2 re-retrievals | Confidence thresholds need real query examples to calibrate — a fixed cutoff isn't universal across document types |
| 5 | Streaming APIs (SSE/WebSockets) | Exit Interview Bot: 4 voice modes over WebSocket, 3 concurrent LangChain classifiers per turn | Running classifiers concurrently per turn kept latency acceptable without losing signal richness |
| 6 | Integrate enterprise connectors and third-party tools | Lead Gen Pipeline: async scraping + Slack SDK integration across Reddit/Discord/Slack/LinkedIn | Rate limits and API inconsistency across sources forced a fallback-first design from the start |

**Recommended case study:** Agentic RAG System — directly answers the JD's core LLM/RAG/agentic-workflow ask.

**Red-flag question:** "You haven't used observability tooling like Grafana/Prometheus — how would you ramp?" → Answer: Docker-based deployment experience already covers the infra layer; observability tooling is a fast, well-documented add given that foundation.

## G) Posting Legitimacy

| Signal | Finding | Weight |
|---|---|---|
| Apply flow | Native application form on the company's own site (not a third-party aggregator), fields present and functional | Positive |
| Posting quality | Extremely specific — names exact tech stack (FastAPI, pgvector/FAISS/Pinecone, LangChain, MCP), responsibilities, and required vs. preferred skills split | Positive |
| Requirements realism | Skills-gated, not years-gated — consistent with a startup that values demonstrated ability | Positive |
| Company hiring signals | $5.72M raised, HDFC Bank investment, "Rs 100 Cr pipeline... increases focus on hiring" (2026), 4 concurrent open roles on the same careers page | Positive |
| Reposting pattern | Not in scan-history.tsv (new discovery) | Neutral |

**Assessment: High Confidence** — well-funded, actively hiring, highly specific posting with a working native application form.

---

## H) Draft Application Answers

**Cover Letter field:**
Tell us a bit about yourself and why you're excited about this role.

*I build production LLM/RAG and agentic systems end to end — a 7-agent LangGraph RAG system with hybrid Milvus retrieval and a self-corrective query-rewrite loop (~200ms retrieval latency), and a 4-agent marketing pipeline with a critique/replanning loop. CoRover's Gen AI Developer role maps directly onto this work: LLM/RAG services in FastAPI, agentic tool-using workflows, and vector-database-backed retrieval. I'd like to bring that experience to BharatGPT. Portfolio: makilesh.github.io | GitHub: github.com/Makilesh/AGENTIC_RAG*

**Availability:** Immediate — graduated May 2026.

*(Draft for human review before submission — human gate applies per AGENTS.md.)*

---

## Keywords extracted

GenAI, LLM, RAG, FastAPI, Pydantic, agentic workflows, LangChain, LlamaIndex, CrewAI, vector database, pgvector, FAISS, Pinecone, prompt engineering, prompt versioning, MCP, streaming APIs, SSE, WebSockets, observability, CI/CD, Bengaluru, on-site, BharatGPT, conversational AI
