You are career-ops, an AI-powered job search pipeline. I am setting you up
for the first time. Read and follow AGENTS.md fully.

=== CANDIDATE IDENTITY ===

Name: Makilesh M
Email: [makilesh24225@gmail.com](mailto:makilesh24225@gmail.com)
Phone: +91 98944 19452
Location: Bangalore / Hyderabad / Chennai, India
LinkedIn: [https://linkedin.com/in/makilesh/](https://linkedin.com/in/makilesh/)
GitHub: [https://github.com/Makilesh/](https://github.com/Makilesh/)
Portfolio: [https://makilesh.github.io/](https://makilesh.github.io/)

=== STEP 1: CREATE cv.md ===

Create cv.md in the project root with the following content exactly:

---

# Makilesh M

AI/ML Engineer · Data Scientist · LLMs & Voice AI Specialist

Bangalore • [makilesh24225@gmail.com](mailto:makilesh24225@gmail.com) • +919894419452 •
linkedin.com/in/makilesh/ • github.com/Makilesh/ • makilesh.github.io

## Professional Summary

Oracle-certified AI professional with production expertise in building
and deploying LLM, RAG, multi-agent frameworks, and real-time voice AI.
Proven ability to lead technical teams and deliver AI solutions with
measurable business impact. Graduating May 2026, available for onsite,
hybrid, or remote roles immediately. Open to relocation across India,
with a strong preference for AI-first startups and high-growth teams.

## Skills

**AI & Machine Learning:** Deep Learning, Neural Networks, NLP,
Transformers, Generative AI, LLMs, MLOps, Model Fine-tuning,
Multi-Agent Systems, RAG, Prompt Engineering, Vector Embeddings

**Frameworks & Libraries:** PyTorch, TensorFlow, Scikit-learn, OpenCV,
LangChain, LangGraph, CrewAI, AutoGen, spaCy, Hugging Face, Pandas,
NumPy, Matplotlib, Seaborn, NLTK, Whisper, Streamlit, Twilio

**Cloud & Tools:** AWS (EC2, S3, Lambda), Azure OpenAI, Docker, FastAPI,
Flask, Git, SQL, MySQL, Pinecone, FAISS, ChromaDB, Weaviate, Milvus, n8n

**Languages:** Python, C++, C, Java, JavaScript, HTML, CSS, React.js,
RESTful APIs

## Work Experience

### AI Developer Intern | Shamla Tech Solutions | Coimbatore, India

Sep 2025 – Mar 2026

* Deployed a production-grade AI Voice Calling Agent (Twilio + Pinecone)
  enabling 100+ automated outbound calls per week with zero manual
  intervention, reducing manual call handling by 80%.
* Built a full-duplex Cross-Platform Meeting Assistant with real-time
  10-speaker diarization across Zoom, Google Meet, Microsoft Teams, and
  in-person sessions, processing 50+ hours of meeting data per week.
* Engineered an end-to-end multi-source lead generation pipeline with
  3-stage AI qualification (GPT-4 + Gemini + Ollama fallback), achieving
  94.6% lower LLM API costs via batch processing (20 leads/API call) and
  concurrent async scraping across Reddit, Discord, Slack, LinkedIn.
* Developed general-purpose web scraping and data processing system
  supporting lead enrichment, analytics, and downstream AI workflows.
* Tech Stack: Python, LangChain, Twilio API, RealtimeSTT/TTS, Whisper,
  Pinecone, pyannote.audio, OpenAI/Gemini APIs, Selenium, Playwright,
  PRAW, Discord.py, Slack SDK, AsyncIO, Flask

## Projects

### Agentic RAG System | Jan–Feb 2026

GitHub: github.com/Makilesh/AGENTIC_RAG

* 7-agent LangGraph state machine with self-corrective retrieval loop that
  auto-rewrites low-quality queries (score < 0.7) and re-retrieves up to
  2 times, improving answer accuracy across PDF, DOCX, PPTX, Excel, TXT.
* True hybrid search over Milvus 2.4: 384-dim dense embeddings
  (Sentence Transformers, HNSW index) + BM25 sparse vectors fused via
  Reciprocal Rank Fusion (RRF) at ~200ms retrieval latency.
* Deployed via Docker Compose with Gemini 2.5 Flash primary +
  Ollama Qwen 2.5 fallback. FastAPI backend + Streamlit frontend.
* Tech: Python, LangGraph, LangChain, Milvus, Sentence Transformers,
  Gemini, Ollama, FastAPI, Streamlit, Docker, PyMuPDF, Pandas

### AI-Powered Voice Agent | Sep–Nov 2025

GitHub: github.com/Makilesh/voice_engine_MVP

* Production-grade real-time full-duplex voice agent: 200–500ms
  end-to-end latency (STT + LLM + TTS), <150ms barge-in detection via
  RMS energy monitoring + selective echo suppression.
* Hybrid TTS pipeline: Kokoro-82M (40–90ms first-byte latency) with
  LLM fallback chain, dynamic audio queue sizing, memory-aware
  concurrency management.
* Sentiment-aware adaptive tone modulation + producer-consumer async
  architecture with Silero VAD + Whisper transcription.
* Tech: Python, Asyncio, Threading, Whisper, RealtimeSTT, Kokoro,
  PyAudio, OpenAI, psutil, httpx

### AI CMO Multi-Agent System | Jan 2026

GitHub: github.com/Makilesh/Chief_Marketing_Officer_Agent

* 4-agent marketing system (Analyst → Strategy → Execution → Critic)
  built with LangGraph + CrewAI.
* Self-corrective critique loop rejecting poor strategies and replanning
  up to 3 iterations autonomously.

### AI Legal Engine | Jun 2025

GitHub: github.com/Makilesh/AI_Legal_Engine

* RAG architecture achieving hybrid search across 673+ IPC criminal law
  documents with sub-second retrieval.
* THIRAN Hackathon Finalist 2025 (Team Lead, Data Scientist, AI Engineer).

### Multi-Source Lead Generation Pipeline | Nov–Dec 2025

GitHub: github.com/Makilesh/AI_Sales_Agent

* AI-qualified lead pipeline: Reddit, Discord, Slack, LinkedIn scraping
  with semantic filtering + Twilio outreach automation.
* 94.6% reduction in lead generation operational costs.

### Agentic AI Exit Interview System | Mar 2026

GitHub: github.com/Makilesh/Exit_Interview_Bot

* LLM-driven interview agent: 7-state machine, 3 concurrent LangChain
  classifiers per turn, 4 voice modes via WebSocket (STT + TTS).
* Outputs per-session JSON records, plain-text transcripts, Markdown
  HR summaries.

### CUA-DELC Lung Disease Classifier | Oct 2025

GitHub: github.com/Makilesh/weighted_soft_voting_for_lung_disease_classification

* Confidence & uncertainty-aware dynamic ensemble: InceptionV3 +
  MobileNetV2 + VGG19 for 4-class lung disease classification.
* Temperature-scaled calibration + entropy-based uncertainty estimation.

## Certifications

* Oracle Cloud Infrastructure 2025 Certified Generative AI Professional
* Oracle Cloud Infrastructure 2025 Certified Data Science Professional
* Udemy Complete ML, NLP Bootcamp – MLOps & Deployment (2024)
* NPTEL Python for Data Science (2024)

## Hackathons

* IMPACT X 2024 – Finalist | Team Lead, AI-Powered Crime Detection
  System using YOLOv8 + CNNs
* THIRAN 2025 – Finalist | Team Lead, AI Legal Engine (RAG over 673+ docs)

## Education

Sri Krishna College of Engineering and Technology, Coimbatore, India
B.E. Computer Science Engineering | CGPA: 8.0 | Expected May 2026
-----------------------------------------------------------------

=== STEP 2: CREATE config/profile.yml ===

Create config/profile.yml with:

---

candidate:
  full_name: "Makilesh M"
  email: "[makilesh24225@gmail.com](mailto:makilesh24225@gmail.com)"
  phone: "+919894419452"
  location: "Bangalore / Hyderabad / Chennai , India"
  linkedin: "[https://linkedin.com/in/makilesh/](https://linkedin.com/in/makilesh/)"
  github: "[https://github.com/Makilesh/](https://github.com/Makilesh/)"
  portfolio_url: "[https://makilesh.github.io/](https://makilesh.github.io/)"
  portfolio_display: "makilesh.github.io"

target_roles:
  primary:
    - "AI Engineer"
    - "ML Engineer"
    - "AI/ML Engineer"
    - "LLM Engineer"
    - "Generative AI Engineer"
    - "AI Developer"
    - "Applied AI Engineer"
    - "Data Scientist"
    - "Voice AI Engineer"
    - "NLP Engineer"
    - "MLOps Engineer"
    - "Agentic AI Engineer"
    - "RAG Engineer"
    - "Conversational AI"

  negative:
    - "5+ years"
    - "8+ years"
    - "10+ years"
    - "Director"
    - "VP of"
    - "Blockchain"
    - "Web3"
    - "Embedded"
    - "SAP"
    - "ERP"
    - "Mainframe"
    - "COBOL"

  archetypes:
    - name: "AI Platform / LLMOps Engineer"
      level: "Junior/Entry"
      fit: "primary"
    - name: "Agentic Workflows / Automation"
      level: "Junior/Entry"
      fit: "primary"
    - name: "AI Forward Deployed Engineer"
      level: "Junior/Entry"
      fit: "secondary"
    - name: "Data Scientist"
      level: "Junior/Entry"
      fit: "secondary"
      
narrative:
headline: "Oracle-certified AI engineer building production LLM, RAG,
and voice AI systems"

exit_story: "Built 8 production AI systems during internship at Shamla
Tech Solutions and 30+ independent AI projects spanning
voice agents, multi-agent frameworks, agentic RAGs, and
lead automation. Oracle-certified in both GenAI and Data
Science. Graduating May 2026 and available immediately
for onsite, hybrid, or remote AI engineering roles."

compensation:
  target_range: "₹8–12 LPA (India)"
  currency: "INR"
  minimum: "₹6 LPA"
  location_flexibility: "Open to onsite, hybrid, or remote roles in
  Bangalore, Hyderabad, or Chennai. Open to
  relocation across India for strong opportunities,
  especially AI startups and high-growth teams."

location:
  country: "India"
  city: "Bangalore / Hyderabad / Chennai"
  timezone: "IST (UTC+5:30)"
  visa_status: "Indian citizen, no sponsorship needed for India. 
                Would need visa sponsorship for US/EU/UK."
  onsite_availability: "Available Immediately. Open to immediate 
                        start for remote roles."
---

=== STEP 3: CREATE article-digest.md ===

Create article-digest.md with:

---
# Proof Points — Makilesh M

## Shamla Tech Internship (Sep 2025 – Mar 2026)

**Hero metrics:**

**Architecture highlights:**
- Voice Agent: Twilio + Pinecone + persistent conversation memory 
  → context-aware dynamic responses
- Meeting Assistant: real-time 10-speaker diarization, wake-word 
  activation, RAG for expert responses
- Lead generation Pipeline: 3-stage AI qualification, batch processing 
  (20 leads/API call), concurrent async scraping in linkedin, discord
  slack, reddit

---

## Agentic RAG System (Jan–Feb 2026)

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

## AI Voice Agent (Sep–Nov 2025)

**Hero metrics:**
- 200–500ms end-to-end latency (STT + LLM + TTS)
- <150ms barge-in detection
- 40–90ms first-byte TTS latency (Kokoro-82M)

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

## Lead Generation Pipeline (Nov–Dec 2025)

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
- Confidence^α / uncertainty adaptive weighting
- Temperature-scaled calibration
- Entropy-based uncertainty estimation
- 4-class: COVID-19, Opacity, Pneumonia, Normal
---

=== STEP 4: CREATE modes/_profile.md ===

Create modes/_profile.md with:

---
# User Profile Context — Makilesh M

## Target Roles

| Archetype | Thematic axes | What they buy |
|-----------|---------------|---------------|
| **AI Platform / LLMOps Engineer** | Evals, observability, RAG, pipelines, vector DBs | Someone who ships production AI with metrics |
| **Agentic Workflows / Automation** | Multi-agent, LangGraph, HITL, orchestration | Someone who builds reliable agent systems end-to-end |
| **AI Forward Deployed Engineer** | Client-facing, fast delivery, voice AI | Someone who deploys AI solutions and owns outcomes |
| **Data Scientist / AI/ML Engineer** | Deep learning, NLP, model training, PyTorch | Someone who builds and ships ML models |

## Adaptive Framing

| If the role is... | Emphasize... | Key proof points |
|-------------------|--------------|-----------------|
| LLMOps / Platform | Agentic RAG (7-agent, Milvus, 200ms), production deployment | article-digest.md RAG section |
| Agentic / Automation | Multi-agent LangGraph, self-corrective loops, CrewAI | CMO Multi-Agent + RAG system |
| Voice AI | Voice Agent (200–500ms E2E latency, Kokoro TTS, Whisper STT) | article-digest.md Voice Agent |
| Lead Gen / Automation | 94.6% cost savings, async scraping, Twilio integration | Lead Pipeline proof point |
| Data Science / ML | Lung classifier ensemble, Oracle certifications, PyTorch | cv.md education + certs |

## Exit Narrative

Fresh graduate (May 2026) who has been building production AI systems — 
not toy projects — since 2023. Has real internship and project Experience
Oracle-certified in both GenAI and Data Science. Portfolio live at 
makilesh.github.io with GitHub links to all projects. 


## Candidate-Specific Rules

- ALWAYS mention the portfolio URL (makilesh.github.io) in PDF summaries
- ALWAYS include GitHub links to the most relevant project for the role
- Graduating may 2026 — frame as "available immediately "
- For Indian market roles: target ₹6–18 LPA depending on company size
- For international/remote: target $30K–$100K
- Do NOT apply to roles requiring 3+ years experience (hard filter)
- For roles asking for "senior" experience, only apply if the JD clearly 
  accepts strong portfolio/project experience in lieu of years

## Negotiation Scripts

**Salary expectations (India):**
"Based on current market for junior AI/LLM roles, I'm targeting 
₹8–12 LPA. Given my production internship experience, RAG and 
voice AI portfolio, and Oracle certifications, I believe that's 
well-supported by market data."

**Salary expectations (international remote):**
"For remote international roles I'm targeting $60K–$80K. My 
production experience with LLMs, agents, and voice AI systems 
puts me at the upper end of junior engineering ranges."

**When asked about years of experience:**
"Although I’m a fresher professionally, I have around 5 months
 of hands-on experience through my internship at Shamla Tech, 
 where I worked on 6+ AI projects with measurable outcomes.

Beyond that, I’ve spent the last 3 years actively building AI/ML
 projects, mainly focused on RAG systems, LLMs, Generative AI, 
 multi-agent workflows, and recently Voice AI. Overall, I’ve 
 completed 30+ projects that helped me gain strong practical exposure.

While I’m still growing in terms of large-scale production 
experience, I learn quickly, adapt fast, and I’m genuinely
passionate about AI."

## Location Policy

- STRONGLY prefer remote-first roles (India or global)
- Open to hybrid in Bangalore / Chennai / Hyderabad
- Open to relocation


## Writing Style

**Tone:** Confident, direct, metric-driven. Never use "passionate about" 
or "I would love to". Lead with outcomes.
**Sentence length:** Short and punchy. Action verbs first.
**Vocabulary:** "built", "shipped", "deployed", "reduced", "automated" — 
not "leveraged", "utilized", "facilitated".
**Format preference:** Bullet points with numbers where possible.
---

=== STEP 5: CREATE data/applications.md ===

Create data/applications.md with:

---
# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
---

=== STEP 6: VERIFY SETUP ===

After creating all files, run:
  node cv-sync-check.mjs
  node verify-pipeline.mjs

Then confirm setup is complete and show me what commands are available.

=== STEP 7: CUSTOMIZE portals.yml ===

Copy templates/portals.example.yml to portals.yml and update 
title_filter.positive to include these keywords specifically relevant 
to my profile:
# portals.yml — Job Search Config for Makilesh M
# Last updated: May 2026
# Strategy: AI-native startups (any size) + product companies.
#            No IT services (TCS/Wipro/Infosys excluded).
#            open_to_any_startup: true — pipeline will evaluate ANY
#            AI/ML startup role that clears the title + score filters.

open_to_any_startup: true   # <-- pipeline flag: don't restrict to named companies only

# ─────────────────────────────────────────────
# TITLE FILTERS
# ─────────────────────────────────────────────

title_filter:
  positive:
    - "AI Engineer"
    - "ML Engineer"
    - "AI/ML Engineer"
    - "LLM Engineer"
    - "Generative AI"
    - "LLM"
    - "RAG"
    - "Agent"
    - "Agentic"
    - "Voice AI"
    - "NLP Engineer"
    - "MLOps"
    - "LangChain"
    - "Fresher"
    - "Entry Level"
    - "Graduate"
    - "Junior AI"
    - "AI Trainee"
    - "Applied AI"
    - "Data Scientist"
    - "Conversational AI"
    - "AI Developer"
    - "Machine Learning"
    - "Deep Learning"

  negative:
    - "5+ years"
    - "8+ years"
    - "10+ years"
    - "Director"
    - "VP of"
    - "Blockchain"
    - "Web3"
    - "Embedded"
    - "SAP"
    - "ERP"
    - "Mainframe"
    - "COBOL"
    - "Senior Manager"
    - "Principal Engineer"

# ─────────────────────────────────────────────
# NAMED ANCHOR COMPANIES (Tier 1 — strongest fit)
# Pre-vetted. Scan every run.
# ─────────────────────────────────────────────

tracked_companies:

  - name: Sarvam AI
    careers_url: https://jobs.ashbyhq.com/Sarvam
    notes: "Bangalore. Indian LLM startup."
    tier: 1
    enabled: true

  - name: Krutrim (Ola AI)
    careers_url: https://www.krutrim.com/careers
    scan_method: websearch
    scan_query: '"krutrim" AI engineer OR LLM engineer OR generative AI site:linkedin.com OR site:instahyre.com'
    notes: "Bangalore. Ola's Indian LLM lab."
    tier: 1
    enabled: true

  - name: Observe.AI
    careers_url: https://jobs.lever.co/observeai
    notes: "Bangalore/SF. Voice AI for contact centers. RAG + voice = direct match."
    tier: 1
    enabled: true

  - name: Uniphore
    careers_url: https://www.uniphore.com/careers
    scan_method: websearch
    scan_query: 'site:uniphore.com/careers "AI" OR "ML" OR "NLP" engineer'
    notes: "Chennai/Global. Conversational AI."
    tier: 1
    enabled: true

  - name: Yellow.ai
    careers_url: https://yellow.ai/careers
    scan_method: websearch
    scan_query: '"yellow.ai" careers "AI" OR "NLP" OR "engineer"'
    notes: "Bangalore. Conversational AI platform."
    tier: 1
    enabled: true

  - name: Haptik (JioHaptik)
    careers_url: https://www.haptik.ai/careers
    scan_method: websearch
    scan_query: '"haptik" careers "AI" OR "NLP" OR "ML" engineer'
    notes: "Mumbai. Conversational AI."
    tier: 1
    enabled: true

  - name: Mad Street Den (Vue.ai)
    careers_url: https://www.madstreetden.com/careers
    scan_method: websearch
    scan_query: '"mad street den" OR "vue.ai" "AI" OR "ML" engineer'
    notes: "Chennai. Retail AI startup."
    tier: 1
    enabled: true

  - name: AssemblyAI
    careers_url: https://jobs.ashbyhq.com/assemblyai
    notes: "Remote. Speech AI APIs. STT/NLP — voice AI match."
    tier: 1
    enabled: true

  - name: Rasa
    careers_url: https://jobs.ashbyhq.com/rasa
    notes: "Remote. Open-source conversational AI."
    tier: 1
    enabled: true

  - name: Freshworks
    careers_url: https://jobs.lever.co/freshworks
    notes: "Chennai/Bangalore. AI-powered SaaS."
    tier: 2
    enabled: true

  - name: Zoho AI
    careers_url: https://careers.zohocorp.com
    scan_method: websearch
    scan_query: '"zoho" "AI" OR "ML" OR "deep learning" engineer fresher OR junior'
    notes: "Chennai. Large engineering org with real AI work."
    tier: 2
    enabled: true

  - name: Sprinklr
    careers_url: https://job-boards.greenhouse.io/sprinklr
    api: https://boards-api.greenhouse.io/v1/boards/sprinklr/jobs
    notes: "Gurgaon/Remote. AI-powered CX platform."
    tier: 2
    enabled: true

# ─────────────────────────────────────────────
# STARTUP SWEEP QUERIES
# Catch ANY AI startup not in the named list.
# These run on every scan cycle.
# ─────────────────────────────────────────────

search_queries:

  # — Broad startup sweeps (highest priority) —

  - name: Wellfound — Any AI Startup India
    url: https://wellfound.com/jobs
    query: '"AI engineer" OR "ML engineer" OR "LLM" OR "generative AI" OR "NLP" India 0-2 years'
    notes: "Catches any AI startup on Wellfound hiring in India. Scan daily."
    priority: high
    enabled: true

  - name: Wellfound — Any AI Startup Remote
    url: https://wellfound.com/jobs
    query: '"AI engineer" OR "ML engineer" OR "LLM" OR "generative AI" remote 0-2 years'
    notes: "Global remote AI startup roles. Wellfound is startup-only — high signal."
    priority: high
    enabled: true

  - name: YC Work at a Startup — Any AI Role
    url: https://www.workatastartup.com/jobs
    query: '"AI" OR "ML" OR "LLM" OR "generative AI" OR "NLP" engineer junior OR entry OR fresher OR "0-2"'
    notes: "YC-backed startups only. Very high quality. Scan weekly."
    priority: high
    enabled: true

  - name: Cutshort — Any AI/ML Startup India
    url: https://cutshort.io/jobs
    query: '"AI" OR "LLM" OR "NLP" OR "RAG" OR "generative AI" engineer India 0-2 years'
    notes: "Skill-filtered. Strong for Indian startups of all sizes."
    priority: high
    enabled: true

  # — India job boards —

  - name: Instahyre — AI Roles India
    url: https://www.instahyre.com
    query: 'site:instahyre.com "AI engineer" OR "LLM" OR "RAG" OR "NLP" Bangalore OR Chennai OR Hyderabad OR remote'
    priority: medium
    enabled: true

  - name: LinkedIn — India AI Fresher 2026
    url: https://linkedin.com/jobs
    query: '"AI engineer" OR "ML engineer" OR "generative AI" "fresher" OR "2026 batch" OR "entry level" Bangalore OR remote India'
    priority: medium
    enabled: true

  - name: Naukri — AI ML Fresher India
    url: https://naukri.com
    query: '"generative AI" OR "LLM engineer" OR "AI engineer" fresher OR "0-2 years" Bangalore OR Chennai OR remote'
    notes: "High volume, lower signal. Scan weekly, filter aggressively by title."
    priority: low
    enabled: true

  # — Global remote —

  - name: RemoteOK — Global Junior AI
    url: https://remoteok.com
    query: '"AI engineer" OR "LLM engineer" OR "generative AI" OR "NLP" entry OR junior OR graduate'
    priority: medium
    enabled: true

  - name: WeWorkRemotely — Global AI Roles
    url: https://weworkremotely.com
    query: '"AI" OR "ML" OR "LLM" engineer junior OR entry remote'
    priority: medium
    enabled: true

  - name: HN Who is Hiring — AI Roles
    url: https://news.ycombinator.com/item?id=whoishiring
    query: '"AI" OR "LLM" OR "machine learning" OR "NLP" junior OR entry OR fresher OR "0-2"'
    notes: "Hacker News monthly thread. High-quality indie startups and remote roles."
    priority: medium
    enabled: true

# ─────────────────────────────────────────────
# SCORING BOOSTS & PENALTIES
# ─────────────────────────────────────────────

score_boosts:
  keywords:
    - term: "Voice AI"
      boost: +0.3
    - term: "RAG"
      boost: +0.3
    - term: "Multi-agent"
      boost: +0.3
    - term: "Agentic"
      boost: +0.3
    - term: "LangGraph"
      boost: +0.2
    - term: "Milvus"
      boost: +0.2
    - term: "LangChain"
      boost: +0.2
    - term: "startup"
      boost: +0.7

  penalties:
    - term: "TCS"
      penalty: -1.0
    - term: "Wipro"
      penalty: -1.0
    - term: "Infosys"
      penalty: -1.0
    - term: "Accenture"
      penalty: -0.5
    - term: "Cognizant"
      penalty: -0.5
    - term: "HCL"
      penalty: -0.5
    - term: "Capgemini"
      penalty: -0.5

# ─────────────────────────────────────────────
# PIPELINE RULES
# ─────────────────────────────────────────────

pipeline:
  min_score_for_pdf: 3.5
  hard_reject_experience_years: 5
  accept_portfolio_in_lieu: true
  always_include_portfolio_url: "makilesh.github.io"
  always_link_github_projects: 2
  availability: "Immediately"
  remind_tracker_after_session: true
   
=== STEP 8: EVALUATE A SAMPLE JOB ===

After completing setup, evaluate this sample job description to test 
the pipeline:

"We are hiring a Junior AI Engineer at a Bangalore-based AI startup.
You will build and deploy LLM applications, RAG pipelines, and 
conversational AI agents. Requirements: Python, LangChain or similar,
experience with vector databases, knowledge of prompt engineering.
1-2 years experience or strong project portfolio accepted.
Salary: ₹8–15 LPA. Remote-friendly hybrid model."

Run the full auto-pipeline on this and show me the evaluation report.

=== IMPORTANT OPERATING RULES FOR MY SEARCH ===

1. ONLY evaluate roles with 0–3 years experience requirement, OR roles 
   that explicitly accept strong portfolios/projects
2. ALWAYS include my portfolio URL (makilesh.github.io) in PDFs
3. ALWAYS link the 1-2 most relevant GitHub projects for each role
4. For every role, check if "Voice AI", "RAG", or "Multi-agent" appears 
   — these get +0.3 score boost as they are my strongest differentiators
5. Frame me as someone who has shipped production systems (not a student 
   who only did coursework)
6. Available Immediately
7. India-first search, but flag any strong global remote opportunities
8. NEVER apply to roles requiring 5+ years experience
9. Score threshold: only generate PDFs for roles scoring 3.5+/5
10. After each evaluation session, remind me to update application 
    status in the tracker

Begin setup now. Confirm each file creation as you go, then run the 
verification checks.