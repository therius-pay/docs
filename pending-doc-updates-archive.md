# Processed Doc Updates — Archive

Entries moved here by the `technical-writer` skill after processing.

---

## 2026-08-29 — Refusal-code reference page + RefusalCode enum (benchmark gap #1)

- Source: developer skill, same-session follow-up to the technical-writer first pass.
- Doc-visible changes:
  - New page `concepts/declined-payments.mdx` — full `refusalCode` object doc, the three
    `recoveryAction` values, and a 69-row normalized ISO 8583 code table (Code / Meaning /
    `recoveryAction`). Added to `docs.json` Core Concepts. Cross-linked from
    payment-lifecycle, webhooks/events, testing.
  - `docs/openapi.json` `RefusalCode` schema: added descriptions to every field + a
    `reasonCode` enum (69 codes) + `recoveryAction` description.
- Behavior: documents current behavior as-is. A same-session change that would have
  reclassified codes `5` / `12` / `13` from `recoveryAction: retry` to `switch_method`
  (`database/seeds/05_rejected_codes.sql`) was **reverted at the user's request** — those
  three stay `retry`. The `retry` card copy on the page was softened to acknowledge that
  the `retry` bucket includes generic issuer responses like "Do not honor".
- Where in code: `docs/openapi.json` (RefusalCode enum). Sync-pointer comments added to
  `therius-gateway/providers/provider.go` `isoNonReroutable` and
  `therius-public-api/subscription_worker.go` `hardDeclineCodes`. No seed / Go logic change.
  `therius-public-api/openapi.yaml` (swag-generated) NOT affected.
- GA status: live & wired.
- Processed inline (same session) — no queue entry.

---

## 2026-08-29 — Card input modeled as one-of; subscription card contract corrected

- Source: user conversation (design decision), not a dev-skill handoff.
- Doc-visible change:
  - `docs/openapi.json`: added `CardInstrument` (`oneOf` of `cardData` / `nonceData` /
    `tokenData`, each branch `required`ing its own property, per-branch `title`), added a
    typed `CardOnFile` schema, rebuilt `Card` as `allOf: [CardInstrument, {modifiers}]`,
    and added `SubscriptionCard` (`allOf: [CardInstrument]`, no stored-credential /
    installment modifiers). `POST /subscription` and `POST /subscription/{id}/payment-method`
    now reference `SubscriptionCard`; `POST /payment/purchase` and `POST /payment/authorization`
    keep `Card`.
  - `api-reference/subscriptions/create.mdx` + `update-payment-method.mdx`: rewrote the
    `card` param to state "exactly one of nonceData / cardData / tokenData"; removed the
    incorrect "token → 422 / raw card not accepted" claims (code accepts all three via
    `resolveCard`); noted `cardOnFile` / `instalments` / `networkTransactionId` /
    `networkReferenceId` are ignored on these endpoints.
  - `guides/subscriptions.mdx`: same three-instrument framing; kept the CIT "customer
    present + consenting" requirement.
- Where in code: `therius-public-api/handlers_payment.go` `resolveCard` (tokenData →
  networkTokenData → nonceData → cardData precedence) + `handlers_subscription.go`
  create / `updateSubscriptionPaymentMethod` (both overwrite stored-credential fields to
  first/cardholder/recurring and hard-code `Instalments: 1`).
- GA status: live & wired.
- Follow-ups:
  1. DONE (developer skill, same day): `therius-ai/docs.go` now fetches `/openapi.json` (was
     `/openapi.yaml`, which 404s on Mintlify); `code/therius/CLAUDE.md` + `README.md` doc
     sections rewritten. NOTE: `therius-public-api/openapi.yaml` is NOT abandoned — it is
     CI-generated from Go swag annotations and feeds Postman generation; it is a separate
     spec from `docs/openapi.json` and the two are intentionally not synced.
  2. Still open — subscription handlers silently pick the first card instrument present and
     silently ignore `cardOnFile` / `instalments`. A `400` guard would make the API match
     the docs.
  3. DONE (commit 051142e) — dashboard `developers/page.tsx` doc links repointed to
     `docs.therius.io` / `openapi.json`.
  4. DONE (commit 359797a) — **Scalar docs site sunset per user.** `publish-openapi.sh`/`.ps1`
     deleted, `.githooks/post-commit` regenerate-only, CLAUDE.md/README/main.go/docs.go
     rewritten single-site. `docs.therius.io` (Mintlify, this repo's parent `D:\therius\docs`)
     is now the ONLY public docs site. The `D:\therius\code\web` repo still needs its own
     cleanup: drop `src/docs/`, remove the `/docs` route + deploy, add a
     `therius.io/docs` → `docs.therius.io` redirect.
