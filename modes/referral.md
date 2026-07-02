# Mode: referral — Referral Outreach (§11A)

Repurposes the `contacto` skeleton for Makilesh's fixed-message referral flow.
Triggered after a job enters the apply queue or reaches `Applied`.

## Hard rules

- **Never automate LinkedIn with Playwright** — account bans are common. This mode
  only *prepares* messages; Makilesh sends them manually on LinkedIn.
- The message is `templates/referral-message.md` used **VERBATIM** — only
  `{{name}}` / `{{company}}` / `{{role}}` substituted. Never rewrite the body.
- If a contact's **email** is found, it MAY be sent via **Gmail MCP** with
  Makilesh's approval, following §9 dedup (`data/email-log.json`) and the daily cap.
- Log every prepared contact + date in the tracker (and follow-ups history).

## Step 1 — Find contacts (WebSearch / LinkedIn people-search URLs only)

For the target company, find **2–3 candidate contacts**:
- 2nd-degree LinkedIn connections
- SKCET (Sri Krishna College of Engineering and Technology) alumni at the company
- Engineers or recruiters on the relevant team

Use WebSearch and constructed LinkedIn people-search URLs, e.g.:
`https://www.linkedin.com/search/results/people/?keywords={company}%20AI%20engineer`
and `... SKCET {company}`. Do NOT scrape or automate LinkedIn — just surface
public profile URLs for Makilesh to open.

## Step 2 — Output per company

For each contact, output:

```
{name} — {title} @ {company}
Profile: {linkedin_url}
Why: 2nd-degree / SKCET alumni / team engineer / recruiter
```

Then the ready-to-copy message (fill placeholders only):

```
Hi {{name}},
I recently applied for the {{role}} position at {{company}} and wanted to reach out directly. I'm Makilesh, a final-year CSE student and AI/ML engineer — I've built production-grade RAG pipelines, multi-agent systems (LangGraph), and real-time Voice AI, along with 40+ AI/ML projects.
If you feel my profile could be a fit, I'd be grateful for a referral or for my application to be passed along. Happy to share my resume and portfolio: https://makilesh.github.io/
Thank you for your time!
— Makilesh
```

(Source of truth: `templates/referral-message.md`. If it changes, use the file.)

## Step 3 — Optional email (Gmail MCP, with approval)

If a contact's professional email is found:
1. Confirm with Makilesh.
2. Compose from `templates/referral-message.md` (verbatim), subject
   `Referral request — {role} at {company} — Makilesh M`, attach `Resume_Makilesh.pdf`.
3. Check `data/email-log.json` dedup + daily cap, send via Gmail MCP, log
   `{message_id, timestamp, company, role, type: "referral"}`.

## Step 4 — Log

Record each prepared contact in the tracker Notes / `data/follow-ups.md`
(`Channel = LinkedIn` or `Email`), with the date. Never mark as sent unless
Makilesh confirms (LinkedIn) or Gmail MCP returns a message ID (email).

## Notes

- Max LinkedIn message length still applies if Makilesh sends a connection note;
  the fixed template is for a direct message / InMail. For a short connection note,
  Makilesh can trim manually — the mode does not rewrite the body.
- `contacto` remains as the generic outreach mode; `referral` is the fixed-template
  Makilesh flow and is what the router should pick for referral requests.
