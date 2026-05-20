# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [RAG / LLMOps] Agentic RAG Self-Corrective Retrieval
**Source:** Report #001 - Sample AI Startup - Junior AI Engineer
**S (Situation):** Needed robust answers across PDFs, DOCX, PPTX, Excel, and TXT files where naive retrieval could fail.
**T (Task):** Build a reliable RAG system with measurable retrieval quality and recoverable query failures.
**A (Action):** Built a 7-agent LangGraph workflow with hybrid Milvus retrieval, dense embeddings, sparse BM25 vectors, RRF fusion, query scoring, and auto-rewrite for low-quality queries.
**R (Result):** Delivered a self-corrective retrieval loop that re-retrieves up to 2 times when query quality is low.
**Reflection:** Retrieval quality should be measured and corrected inside the workflow, not treated as a one-shot embedding lookup.
**Best for questions about:** RAG, vector databases, LLM apps, architecture decisions, debugging AI quality.

### [Voice AI / Conversational AI] Real-Time Voice Agent
**Source:** Report #001 - Sample AI Startup - Junior AI Engineer
**S (Situation):** Real-time AI voice interaction needed low latency, interruption handling, and stable audio flow.
**T (Task):** Build a full-duplex voice agent that could handle STT, LLM response, TTS, and barge-in.
**A (Action):** Combined Whisper, Kokoro, async producer-consumer queues, RMS energy monitoring, selective echo suppression, and sentiment-aware tone modulation.
**R (Result):** Built a full-duplex voice workflow with STT, LLM, TTS, async audio queues, and barge-in handling.
**Reflection:** Conversational AI is a systems problem across audio, inference, memory, queues, and UX timing.
**Best for questions about:** Conversational AI, production systems, latency optimization, async architecture.
