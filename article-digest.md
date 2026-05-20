# Proof Points - Makilesh M

## Shamla Tech Internship (Sep 2025 - Mar 2026)

**Proof points:**
- AI Voice Calling Agent: automated outbound calling with persistent
  conversation memory and Twilio + Pinecone integration
- Meeting Assistant: multi-speaker diarization and expert-response
  RAG support
- Lead Pipeline: staged AI qualification with batching, fallback design,
  and async scraping

**Architecture highlights:**
- Voice Agent: Twilio + Pinecone + persistent conversation memory
  -> context-aware dynamic responses
- Meeting Assistant: multi-speaker diarization, wake-word
  activation, RAG for expert responses
- Lead generation Pipeline: 3-stage AI qualification, batch processing
  and concurrent async scraping in LinkedIn, Discord, Slack, and Reddit

---

## Shopify AI Chatbot (In Progress)

**Proof points:**
- Public portfolio project for Shopify/e-commerce AI chatbot workflows
- Strong fit for conversational commerce, AI support automation, and
  customer-facing LLM product roles

**Architecture direction:**
- Product-aware chatbot flows
- E-commerce support automation
- LLM assistant UX for store operations and customer queries

---

## Business Contact Scraper (Jan 2026)

**Proof points:**
- Business contact discovery and enrichment workflow
- Supports lead generation, data collection, and sales intelligence use cases

**Architecture direction:**
- Web data extraction
- Contact enrichment pipeline
- Downstream integration with AI lead qualification workflows

---

## Agentic RAG System (Jan-Feb 2026)

**Proof points:**
- 7-agent LangGraph state machine
- Hybrid retrieval in Milvus 2.4
- Self-corrective loop: auto-rewrites queries scoring < 0.7,
  re-retrieves up to 2 times
- Supports PDF, DOCX, PPTX, Excel, TXT ingestion

**Architecture:**
- Dense: 384-dim Sentence Transformers + HNSW index
- Sparse: BM25-style keyword vectors
- Fusion: Reciprocal Rank Fusion (RRF)
- Primary LLM: Gemini 2.5 Flash | Fallback: Ollama Qwen 2.5
- Deployed with Docker Compose

---

## AI Voice Agent (Sep-Nov 2025)

**Proof points:**
- Full-duplex STT + LLM + TTS pipeline
- CUDA auto-detection and configurable voice personas
- Barge-in detection
- Kokoro-82M TTS integration

**Architecture:**
- Producer-consumer async architecture
- Silero VAD + Whisper transcription
- RMS energy monitoring for barge-in
- Memory-aware concurrency management (prevents OOM under load)
- Sentiment-aware adaptive tone modulation

---

## AI Legal Engine (Jun 2025 | THIRAN Hackathon Finalist)

**Proof points:**
- Hybrid search across Indian Penal Code documents
- RAG workflow for legal document retrieval
- Hackathon finalist 2025

---

## Lead Generation Pipeline (Nov-Dec 2025)

**Proof points:**
- Batch processing for LLM qualification
- Sources: Reddit, Discord, Slack, LinkedIn
- Qualification: pre-filter + dual LLM (GPT-4 + Gemini + Ollama fallback)
- Competitor detection included

---

## Exit Interview Bot (Mar 2026)

**Architecture:**
- 7-state machine conversation engine
- 3 concurrent LangChain classifiers per turn:
  (decision engine + sentiment tagger + HR-flag detector)
- 4 voice modes via WebSocket
- Outputs: JSON records + plain-text transcripts + Markdown HR summaries

---

## Lung Disease Classifier (Oct 2025)

**Architecture:**
- Dynamic ensemble: InceptionV3 + MobileNetV2 + VGG19
- Confidence^alpha / uncertainty adaptive weighting
- Temperature-scaled calibration
- Entropy-based uncertainty estimation
- 4-class: COVID-19, Opacity, Pneumonia, Normal
