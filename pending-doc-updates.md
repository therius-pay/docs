# Pending Doc Updates

Intake queue for the `technical-writer` skill. The developer, integration-developer, and
plugin-developer skills append an entry here whenever they ship a doc-visible change.
The technical-writer processes each entry, edits `../docs`, then moves the entry to
`pending-doc-updates-archive.md`.

Entry format:

```markdown
## YYYY-MM-DD — <short title>
- Skill: developer | integration-developer | plugin-developer
- Doc-visible change: ...
- Where in code/spec: ...
- Docs likely affected: ...
- GA status: live & wired | behind flag | not yet GA
```

---

_No unprocessed entries. Last processed: 2026-09-02 — "Usage-based & hybrid subscription
billing" (new `POST /subscription/usage` page + invoice `lines[]` + a guide section, en/es/pt;
`openapi.json` updated; moved to `pending-doc-updates-archive.md`)._
