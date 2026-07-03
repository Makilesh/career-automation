# Mode: email — Email Applications (§9, Gmail MCP only)

Send applications / referral / follow-up emails through the **Gmail MCP** connected
to `makilesh24225@gmail.com`. This is the **PRIMARY and ONLY** email transport.

## Absolute rules

- **Gmail MCP only.** If the Gmail MCP is not configured or errors → **STOP and
  report to Makilesh. NEVER fall back to browser-automated Gmail** or any other route.
- **Human gate + batch approval** before sending (same as apply, §10).
- **Fixed content:** body = `templates/cover-letter.md` (application) /
  `templates/followup-message.md` (follow-up) / `templates/referral-message.md`
  (referral), each **verbatim** with only the allowed substitutions.
- **Always attach `Resume_Makilesh.pdf`.**
- **Dedup:** never send twice for the same company+role. Check `data/applications.md`
  AND `data/email-log.json` before sending.
- **Daily cap:** default 20/day (`config/profile.yml` → `email.daily_cap`).
  Applications + follow-ups + referral emails ALL count toward it.

## When to use

A listing or `startups.yml` entry has an HR/hiring `hr_email`, or Makilesh asks to
email an application/follow-up/referral.

## Flow

1. **Preconditions:** confirm Gmail MCP is connected (list tools). If not → STOP,
   tell Makilesh to connect the Gmail connector (claude.ai settings or `/mcp`).
2. **Dedup:** load `data/email-log.json`. If an entry with the same
   `company` + `role` + relevant `type` exists → skip (report "already sent").
3. **Cap check:** count `sent` entries with today's date. If `>= daily_cap` → stop
   and queue the rest for tomorrow.
4. **Compose:**
   - Subject: applications → `Application — {role} — Makilesh M (AI/ML Fresher)`;
     follow-ups → `Re: Application — {role} — Makilesh M`;
     referrals → `Referral request — {role} at {company} — Makilesh M`.
   - Body: the matching template, verbatim (substitute role/company/name only).
   - Attachment: `Resume_Makilesh.pdf`.
5. **Review card + batch approval** (per email): To / Subject / template name /
   attachment. `"approve all" / "approve 1,3"`. Nothing sends without approval.
6. **Send/draft via Gmail MCP:**
   - If the connected Gmail MCP has a **send** tool → send approved emails
     directly and capture the returned message ID.
   - If it only exposes **`create_draft`** (current setup) → create one draft per
     approved email and tell Makilesh: *"N drafts are in your Gmail Drafts —
     attach `Resume_Makilesh.pdf` if the draft tool couldn't, review, and hit
     Send."* The draft ID is logged; mark the log entry `"status": "drafted"`
     and flip it to `"sent"` when Makilesh confirms.
7. **Log** in `data/email-log.json` (append to `sent`):
   ```json
   { "message_id": "<id or draft id>", "timestamp": "<ISO>", "company": "<c>",
     "role": "<r>", "to": "<email>", "type": "application|followup|referral",
     "status": "sent|drafted" }
   ```
   Dedup treats `drafted` the same as `sent` (never create a second draft for the
   same company+role). Also update `data/applications.md` (status/notes) and, for
   follow-ups, `data/follow-ups.md`.

## Errors

- Gmail MCP missing/unauthorized/error → STOP, report, do NOT retry via browser.
- Attachment missing (`Resume_Makilesh.pdf` not found) → STOP, report.
- Partial batch failure → log what sent, report what didn't, never double-send.
