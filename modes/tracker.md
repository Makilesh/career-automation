# Mode: tracker — Application Tracker

Reads and displays `data/applications.md`.

**Tracker format:**
```markdown
| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
```

Canonical statuses (source of truth: `templates/states.yml`): `Evaluated` → `Applied` → `Responded` → `Interview` → `Offer` / `Rejected` / `Discarded` / `SKIP`

- `Applied` = the candidate submitted their application
- `Responded` = a recruiter/company reached out and the candidate replied (inbound)
- `Interview` = in an interview process

If the user asks to update a status, edit the matching row (you MAY edit applications.md to update status/notes of existing entries — never to add new rows; new rows go through `merge-tracker.mjs`).

Also show statistics:
- Total applications
- By status
- Average score
- % with resume attached (always `Resume_Makilesh.pdf`)
- % with report generated
- Emails sent / follow-ups sent (from `data/email-log.json`)
