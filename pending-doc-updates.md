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

_No unprocessed entries. Last processed: 2026-09-01 — "Private API key: header-only"
(verified complete across `2f38edf`, `cd22849`, `b272e53`, `47f4de1`, `deea0bc`; moved to
`pending-doc-updates-archive.md`)._

## 2026-09-02 — Usage-based & hybrid subscription billing
- Skill: developer
- Doc-visible change: New endpoint `POST /v1/subscription/usage` to report a metered usage
  event against a subscription (`{ merchantCode?, subscriptionId, meterCode, quantity,
  idempotencyKey?, occurredAt? }`; idempotent on `(meter, idempotencyKey)`). Subscription
  invoice responses (`GET /v1/subscription/:id/invoice`, `GET /v1/subscription/invoice/:id`)
  gain a `lines[]` array itemising the base fee and each metered add-on. Concept docs need a
  "usage-based / hybrid billing" section: meters (aggregation sum/max/last/count), per-plan
  meter pricing (`per_unit` / `volume` / `graduated` tiers, `includedUnits`), and how usage
  rolls into the invoice at renewal.
- Where in code/spec: `therius-public-api/subscription_usage.go`, `main.go` route;
  `therius-public-api/openapi.yaml` regenerated (swag). `D:\therius\docs\openapi.json` NOT
  updated (hand-curated) — needs the new path + the `lines[]` response field added.
- Docs likely affected: api-reference/subscriptions.mdx (new endpoint + invoice `lines[]`),
  a new concepts page or a section under the subscriptions/billing docs.
- GA status: not yet GA — backend + dashboard UI built, unverified against a live billing cycle.
