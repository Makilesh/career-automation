# Evaluation: Haptik (Jio) — Voice AI Engineer (Hybrid)

**Date:** 2026-07-04
**URL:** https://haptik.freshteam.com/jobs/HVivFopqkiC1/voice-ai-engineer-hybrid
**Archetype:** Voice AI Engineer (with backend/telephony lean)
**Score:** 3.6/5
**Legitimacy:** Proceed with Caution
**PDF:** ✅ (Resume_Makilesh.pdf, fixed)

---

## A) Role Summary

| Field | Value |
|---|---|
| Archetype | Voice AI Engineer — but reads closer to backend/telephony engineer with AI as a bonus, not core |
| Domain | Enterprise conversational AI (Jio Haptik), voice bots + IVR for customer support |
| Function | Build and maintain voice bots, IVR flows, backend services for voice workflows |
| Seniority | Not years-gated in JD, but "strong experience" language suggests some prior professional exposure expected |
| Remote | Hybrid, Mumbai |
| Team size | 200+ employees (Haptik overall) |
| TL;DR | Mumbai hybrid role building voice bots/IVR/telephony integrations; AI/LLM exposure is explicitly a "good to have," not the core ask — a real but partial archetype match, and Mumbai needs a location-policy check before applying. |

## B) Match with CV

| JD Requirement | CV Evidence |
|---|---|
| Strong experience with voice or telephony systems | AI Voice Calling Agent (Twilio + Pinecone), AI-Powered Voice Agent (STT/TTS full-duplex) — cv.md |
| Hands-on backend development (Python/Node.js/Java) | FastAPI, Flask backend across multiple projects — cv.md |
| Understanding of conversational AI concepts (intents, flows, context) | AI-Powered Voice Agent's dialogue/context handling, Exit Interview Bot's 7-state conversation machine — cv.md |
| Integrate speech-to-text, text-to-speech | Whisper STT, Kokoro TTS (Voice Agent); RealtimeSTT/TTS (Shamla Tech internship) — cv.md |
| Debug live production issues | Shamla Tech internship: reduced manual call handling by 80% via debugging/iteration — cv.md |
| Good to have: exposure to AI/ML or LLM-based features | Full LLM/RAG/agent portfolio — exceeds this "bonus" bar considerably |

**Gaps:**

1. **Integration with telephony systems, CRMs, and third-party tools at enterprise scale** — candidate has Twilio experience but not necessarily CRM-integration depth. Moderate gap; mitigate by citing the Twilio + Pinecone production integration as evidence of API/third-party integration comfort.
2. **This is fundamentally a backend/telephony engineering role, not an AI/ML engineering role** — the JD explicitly frames AI/ML as "good to have," which is a narrower framing than the candidate's core AI/ML identity. Worth flagging: if AI is not the daily focus, this may not serve the candidate's stated career narrative (AI/ML engineer) as well as CoRover.ai does.
3. **Location: Mumbai** — per `_profile.md` location policy, Mumbai falls under "P2 — Mumbai / Coimbatore / Pune (ASK before applying)." Flagging for explicit confirmation before proceeding.

## C) Level and Strategy

1. **Level detected vs. natural level:** No explicit years stated, but "strong experience" phrasing and the production-support responsibilities (debug live issues, support customer implementations) suggest the company expects some prior hands-on delivery experience — which the candidate's internship + portfolio can support, though this reads less "fresher-native" than CoRover.ai or Peakflo.
2. **Sell senior without lying:** Emphasize the Twilio + Pinecone voice agent's production deployment and the 80% reduction in manual call handling — this is the closest 1:1 proof point to "build and maintain voice bots... ensuring high reliability."
3. **If they downlevel:** Given the ambiguous seniority signal, this is more about confirming fit than negotiating level — clarify in the first conversation whether the role is genuinely AI-inclusive or a pure backend/telephony support role.

## D) Comp and Demand

| Signal | Data | Source |
|---|---|---|
| Company scale | 200+ employees, offices in Mumbai/Delhi/Bangalore, Jio-backed (Reliance) | JD, haptik.ai |
| Layoff signal | Reports of a "silent layoff" of 100+ people (Grapevine, Glassdoor reviews reference revenue struggles); timing unclear, may predate 2026 | WebSearch |
| Hiring activity | 4 open Engineering roles currently listed (incl. this one) — suggests engineering hiring is still active despite past layoff chatter | haptik.freshteam.com |
| Voice AI / telephony fresher pay band, India | Comparable roles typically ₹6–12 LPA depending on seniority signal | General market context (no Haptik-specific figure found) |

## E) Framing Priorities (resume is fixed — no CV edits; intro-message/interview framing only)

1. Lead with AI Voice Calling Agent (Twilio + Pinecone) — direct match to "voice bots, IVR systems, AI-driven call flows."
2. Cite the Voice Agent's STT/TTS integration for the "integrate speech-to-text, text-to-speech" requirement.
3. Ask directly in the first conversation how much of the role is AI-inclusive vs. pure backend/telephony support, to calibrate whether this fits the AI/ML career narrative.
4. Confirm Mumbai relocation/commute preference with Makilesh before applying (P2 tier — ask first).

## F) Interview Plan

| # | JD Requirement | STAR+R Story | Reflection |
|---|---|---|---|
| 1 | Build and maintain voice bots, IVR systems, AI-driven call flows | AI Voice Calling Agent: Twilio + Pinecone, automated outbound workflows, 80% reduction in manual handling | Persistent memory across calls was the single highest-leverage feature for reducing manual load |
| 2 | Integrate STT, TTS, conversational AI capabilities | AI-Powered Voice Agent: Whisper STT + Kokoro TTS, <150ms barge-in detection | Barge-in handling mattered more to perceived call quality than raw TTS latency |
| 3 | Improve call accuracy, latency, voice quality | AI-Powered Voice Agent: 200-500ms E2E latency budget across STT+LLM+TTS | Splitting the latency budget per pipeline stage made bottleneck-hunting tractable |
| 4 | Debug and resolve voice-related issues in production | Shamla Tech internship: iterative debugging that drove the 80% call-handling reduction | Most production voice bugs traced back to edge cases in turn-taking, not the models themselves |
| 5 | Backend services to support voice/AI workflows | FastAPI backend (Agentic RAG System), Flask (Shamla Tech stack) | Keeping the voice pipeline and backend API cleanly separated made debugging much faster |
| 6 | Understanding of conversational AI concepts (intents, flows, context) | Exit Interview Bot: 7-state conversation machine with 3 concurrent classifiers per turn | State machines make conversational flow debuggable in a way ad-hoc prompt chains don't |

**Recommended case study:** AI Voice Calling Agent (Twilio + Pinecone) — the closest direct match to this role's day-to-day scope.

**Red-flag question:** "We heard some engineering teams here had layoffs — is the team stable?" → Worth asking directly in the interview process itself, not just researching externally; frame as due diligence, not accusation.

## G) Posting Legitimacy

| Signal | Finding | Weight |
|---|---|---|
| Apply flow | Freshteam ATS, active "Apply Now" button, listing renders correctly | Positive |
| Posting quality | Specific responsibilities and a clear must-have/good-to-have split, but no salary or team-size context | Neutral |
| Requirements realism | No explicit years requirement, "strong experience" language is vague enough to allow a range of candidates | Neutral |
| Company hiring signals | 4 concurrent open Engineering roles at Haptik right now — suggests genuinely active hiring, not a single stale posting | Positive |
| Layoff signal | "Silent layoff" reports exist (timing unclear, may be dated); worth noting as context, not disqualifying | Concerning (mitigated) |
| Reposting pattern | Not in scan-history.tsv (new discovery) | Neutral |

**Assessment: Proceed with Caution** — the role itself looks real and actively hired for, but the combination of past layoff chatter and the "AI as a bonus, not the core" framing means this is worth a direct conversation about team stability and how AI-focused the day-to-day actually is before investing further effort.

---

## Keywords extracted

Voice AI, telephony, IVR, voice bots, speech-to-text, text-to-speech, conversational AI, backend development, Python, Node.js, Java, CRM integration, production debugging, Mumbai, hybrid, Jio, Haptik
