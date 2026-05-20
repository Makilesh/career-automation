# Proof Points - Makilesh M

## Shamla Tech Internship (Sep 2025 - Mar 2026)

**Hero metrics:**

**Architecture highlights:**
- Voice Agent: Twilio + Pinecone + persistent conversation memory
  -> context-aware dynamic responses
- Meeting Assistant: real-time 10-speaker diarization, wake-word
  activation, RAG for expert responses
- Lead generation Pipeline: 3-stage AI qualification, batch processing
  (20 leads/API call), concurrent async scraping in linkedin, discord
  slack, reddit

---

## Agentic RAG System (Jan-Feb 2026)

**Hero metrics:**
- 7-agent LangGraph state machine
- ~200ms retrieval latency in Milvus 2.4
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

**Hero metrics:**
- 200-500ms end-to-end latency (STT + LLM + TTS)
- <150ms barge-in detection
- 40-90ms first-byte TTS latency (Kokoro-82M)

**Architecture:**
- Producer-consumer async architecture
- Silero VAD + Whisper transcription
- RMS energy monitoring for barge-in
- Memory-aware concurrency management (prevents OOM under load)
- Sentiment-aware adaptive tone modulation

---

## AI Legal Engine (Jun 2025 | THIRAN Hackathon Finalist)

**Hero metrics:**
- Hybrid search across 673+ Indian Penal Code documents
- Sub-second retrieval
- Hackathon finalist 2025

---

## Lead Generation Pipeline (Nov-Dec 2025)

**Hero metrics:**
- 94.6% reduction in LLM API costs
- Batch processing: 20 leads per API call
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
