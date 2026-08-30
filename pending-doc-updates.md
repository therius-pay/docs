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

## 2026-08-30 — Capture / refund / cancel move to `POST /payment/{id}/...`

- Skill: developer
- Doc-visible change: **Breaking API change.** `POST /payment/authorization` and
  `POST /payment/purchase` responses now include a top-level `id` (the Therius payment
  UUID). The lifecycle operations are no longer body-addressed by `orderCode` +
  `paymentCode`; they take the id as a URL path parameter:
  - `POST /payment/capture` → `POST /payment/{id}/capture`
  - `POST /payment/refund` → `POST /payment/{id}/refund`
  - `POST /payment/cancel` → `POST /payment/{id}/cancel`
  - `POST /payment/cancel_or_refund` → `POST /payment/{id}/cancel_or_refund`
  Request bodies for these four drop `orderCode` and `paymentCode` entirely (they keep
  `key`, `merchantCode`, `amount` for capture/refund, and `reference`).
  `modificationResponse` gains `id`. Unknown/foreign id now returns `404` (was `400`).
  `orderCode` / `paymentCode` are now positioned as merchant reference fields only —
  not the way to manage a payment in the system. `POST /payment/resume` (3DS) and
  `GET /payment/inquiry/{id}` are unchanged.
- Where in code/spec: `therius-public-api/handlers_payment.go` (`capture`, `refund`,
  `cancel`, `cancelOrRefund`, `modificationRequest`, `cancelRequest`,
  `modificationResponse`, `paymentResponse`), `main.go` route table,
  `services_core.go` (`lookupOwnedPayment`). `therius-public-api/openapi.yaml`
  regenerated. `D:\therius\docs\openapi.json` NOT yet updated — needs the path +
  schema changes mirrored by hand.
- Docs likely affected: api-reference/payments/capture, refund, cancel,
  cancel-or-refund (paths + params + request schema), api-reference/payments/authorize
  & purchase (new `id` in response), any quickstart / lifecycle guide that shows a
  capture or refund call, the idempotency page examples.
- GA status: live & wired (committed `dbf2971`, pushed to `main`). Pre-GA platform,
  so shipped as a hard replacement with no back-compat alias.
