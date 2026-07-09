# Mode: followup — Follow-up Cadence (§11B)

## Policy (Makilesh — NON-NEGOTIABLE)

- Any application in **Applied** status with **no reply after 6 days** gets queued
  for **exactly ONE** follow-up. Never more than one per company+role.
- The follow-up body is `templates/followup-message.md` used **VERBATIM** (only
  `{{role}}` / `{{company}}` substituted). Never paraphrase, expand, or "tailor" it.
- Sent via **Gmail MCP only** (§9) with **batch approval**. Attach
  `Makilesh_M_AI_Engineer_Resume.pdf`. Subject: `Re: Application — {role} — Makilesh M`.
- Every follow-up is logged in `data/email-log.json` + `data/follow-ups.md` +
  tracker, and **counts toward the daily email cap** (default 20).
- If Gmail MCP is unavailable → STOP and report. No browser fallback.

## Inputs

- `data/applications.md` — tracker
- `data/follow-ups.md` — follow-up history (created on first use)
- `data/email-log.json` — email dedup + cap accounting
- `templates/followup-message.md` — the fixed body
- `config/profile.yml` — identity, `email.daily_cap`
- `Makilesh_M_AI_Engineer_Resume.pdf` — always attached

## Step 1 — Run cadence

```bash
node followup-cadence.mjs
```

Parse the JSON. Actionable = Applied entries where `urgency == "overdue"` and
`followupCount == 0` (one follow-up max). Ignore `cold` (already followed up once).

If none:
> "No follow-ups due. Applications need to be in Applied status for 6+ days with no reply."

## Step 2 — Dashboard

Show overdue-eligible applications sorted by days since applied:

```
Follow-up Queue — {date}
| # | App# | Company | Role | Days since applied | Email on file? |
```

For each, resolve the recipient email: from the tracker/notes, `data/email-log.json`
(the address the original application went to), or the startup's `hr_email` in
`startups.yml`. If no email is found → skip and tell Makilesh to follow up manually
(LinkedIn referral via `/career-ops referral`).

## Step 3 — Build the fixed drafts (no generation)

For each eligible application:
1. Read `templates/followup-message.md`.
2. Substitute `{{role}}` and `{{company}}` only. Do NOT change anything else.
3. Check `data/email-log.json`: if a follow-up (`type: followup`) already exists
   for this company+role, SKIP (one max).
4. Check the daily cap: `sent today (applications + follow-ups) < email.daily_cap`.

## Step 4 — Review card + batch approval

Show one compact card per queued follow-up:

```
## Follow-up {n}: {Company} — {Role}   (applied {N} days ago)
To:      {email}
Subject: Re: Application — {Role} — Makilesh M
Body:    (templates/followup-message.md, verbatim)
Attach:  Makilesh_M_AI_Engineer_Resume.pdf
```

Then: **"approve all" / "approve 1,3" / "skip N"**. Nothing sends without approval.

## Step 5 — Send via Gmail MCP + log

For each approved follow-up:
1. Send via Gmail MCP (attach `Makilesh_M_AI_Engineer_Resume.pdf`).
2. Append to `data/email-log.json`:
   `{message_id, timestamp, company, role, type: "followup"}`.
3. Append a row to `data/follow-ups.md`
   (`# | App# | Date | Company | Role | Channel=Email | Contact | Notes`).
4. Update the tracker Notes: `Follow-up sent {YYYY-MM-DD}`.

**Only log follow-ups actually sent via Gmail MCP.** Never log a draft as sent.

## Cadence reference

| Status | Follow-up | Max |
|--------|-----------|-----|
| Applied | 6 days after applying, no reply | 1 (then leave / consider Discarded) |

Override the window with `node followup-cadence.mjs --applied-days N` (default 6).
