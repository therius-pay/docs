# Processed Doc Updates — Archive

Entries moved here by the `technical-writer` skill after processing.

---

## 2026-08-31 — Private API key: header-only, no longer accepted in the request body

- Skill: developer. Processed 2026-08-31 → verification completed 2026-09-01.
- **Duplicate of the already-archived "Removed the dead `key` auth param; Headers / Body /
  Query separation" entry** — the developer skill filed a fresh copy on the same day. Kept
  both for the audit trail; the work is one and the same.
- Doc-visible change: raw private key (`prv_production_…` / `prv_sandbox_…`) is accepted
  **only** as `Authorization: Bearer <key>`. The `"key"` body field and `?key=` query param
  are gone from every endpoint.
- What was done in the docs (all verified 2026-09-01 — 0 residual `"key":` in code samples,
  0 `?key=` anywhere, 0 `key` param in `openapi.json`):
  - `openapi.json` — `key` removed from all 6 request-body schemas + every query param
    (`2f38edf`, `b272e53`).
  - All 22 `api-reference/**` pages — `<ParamField>` for `key` removed (body + query),
    Request section split into `### Headers` / `### Path Parameters` / `### Request Body`
    (or `### Query Parameters`); GET/DELETE pages carry `Authorization` only (`2f38edf`).
  - Guides / concepts / connections / quickstart / index / `authentication.mdx` /
    `idempotency.mdx` — `"key": "..."` stripped from 71 code samples, missing
    `-H "Authorization: Bearer"` added to the quickstart + `/payment/resume` curls, prose
    rewritten so `key` is no longer called a body/query field (`cd22849`).
  - GET/DELETE **curl examples** in 5 subscription/plan pages that still had
    `?key=sk_live_...` in the example string (missed by `2f38edf`, which only removed the
    ParamFields) — fixed to `?merchantCode=...` + `-H "Authorization: Bearer ..."`
    (`47f4de1`).
  - Key **prefix** corrected repo-wide: `sk_live_`→`prv_production_`, `sk_sandbox_`→
    `prv_sandbox_`, `pub_live_`→`pub_production_` — the docs had used Stripe-style prefixes
    that no real key has (`deea0bc`, see `../memory/therius-docs-key-prefix-fix-2026-09-01.md`).
- Product side: `product/platform-coverage.md` §7 already carries the dated bullet
  ("API authentication is Authorization-header only (2026-08-31)").
- GA status: matches shipped code.

## 2026-08-30 — Capture / refund / cancel move to `POST /payment/{id}/...`

- Skill: developer. Processed 2026-08-30.
- Doc-visible change: **Breaking API change.** `POST /payment/authorization` and
  `POST /payment/purchase` responses now include a top-level `id` (Therius payment UUID).
  Lifecycle operations are no longer body-addressed by `orderCode` + `paymentCode`; they
  take the id as a path parameter: `POST /payment/{id}/{capture,refund,cancel,cancel_or_refund}`.
  Those four request bodies drop `orderCode`/`paymentCode` (keep `key`, `merchantCode`,
  `amount` for capture/refund, `reference`). Responses gain `id`. Unknown/foreign id → `404`.
  `orderCode`/`paymentCode` are reference fields only now. `resume` + `inquiry` unchanged.
- Where in code/spec: `therius-public-api/handlers_payment.go`, `main.go`, `services_core.go`
  (commit `dbf2971`).
- Doc edits made:
  - `openapi.json` — renamed the 4 paths to `/payment/{id}/...`; new `PaymentId` path
    parameter (in `components.parameters`, referenced by all 4); removed `paymentCode` from
    the 4 request bodies and fixed `required`; added `id` (uuid) to `PaymentResponse`.
    Also corrected `cancel_or_refund` — it never accepted an `amount` (full reversal only).
  - `api-reference/capture.mdx`, `refund.mdx`, `cancel.mdx`, `cancel-or-refund.mdx` —
    rewrote frontmatter `openapi:` binding, added an "Identifying the payment" section,
    `id` path `<ParamField>`, dropped `orderCode`/`paymentCode` body fields, added `id` to
    the response fields, updated all curl + JSON examples to the `/payment/{id}/...` form.
  - `api-reference/authorize.mdx`, `purchase.mdx` — added `id` response field + example
    line; reframed `paymentCode` as a reference, not the payment handle.
  - `concepts/payment-lifecycle.mdx` — state-machine diagram + all path references updated;
    rewrote the "`paymentCode` vs `orderCode`" section into an `id` / `paymentCode` /
    `orderCode` table making `id` the handle.
  - `idempotency.mdx` — endpoint list + cross-endpoint example updated.
  - `quickstart.mdx` — success-response example + "save the id" guidance + inquiry example.
- Not touched: `docs.json` (page paths unchanged). `guides/testing.mdx` only references
  `/payment/resume` (unchanged).
- GA status: live & wired (`dbf2971`, on `main`). Pre-GA — hard replacement, no alias.
- Open: plugins (WooCommerce/Magento/PrestaShop/Shopware) still call the old shape — a
  plugin-developer task, tracked in `../memory/Roadmap/open-items.md`.

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
  4. DONE (commits 359797a, fa63bf4, 2084b6b + skills a18aa2b/b78d8a2/ed11a0b) — **Scalar
     docs site sunset per user.** `publish-openapi.sh`/`.ps1` deleted, `.githooks/post-commit`
     regenerate-only, all CLAUDE.md/README/main.go/docs.go/skill-file references to the old
     Scalar docs + the (now-deleted) `D:\therius\code\web` repo removed. `docs.therius.io`
     (Mintlify, `D:\therius\docs`) is the ONLY public docs site. The marketing site is a
     separate Astro repo, `D:\therius\code\therius-website`, marketing-only with no docs.
     Only hosting-side item left: a `therius.io/docs` → `docs.therius.io` redirect (DNS/CDN
     config, not in any repo).

---

## 2026-08-29 — Subscription card update: record mode

- Source: developer skill (feature), processed inline same session.
- Doc-visible change: `POST /subscription/{id}/payment-method` now has two modes —
  **record** (`card.tokenData` — attach a card already CIT'd via /payment/*; no charge, no
  3DS; mandate read from the token or passed as `networkTransactionId`/`networkReferenceId`;
  rejects `suspended` subs) and **CIT** (`card.nonceData`/`card.cardData` — zero-value CIT
  here, can't do a 3DS challenge, can reactivate a suspended sub).
- Files: `api-reference/subscriptions/update-payment-method.mdx` (rewritten — two modes, a
  Steps walkthrough for the record flow), `openapi.json` (new `SubscriptionCardUpdate`
  schema; `/subscription` create still uses `SubscriptionCard`), `guides/subscriptions.mdx`
  (Update Payment Method card + a Dunning `<Note>` about the 3DS limitation).
- Where in code: `therius-public-api/handlers_subscription.go` `updateSubscriptionPaymentMethod`.
- GA status: code built clean, not smoke-tested against a live subscription.

---

## 2026-08-30 — Subscription CREATE record mode (Pattern A, completing the 3DS story)

- Source: developer skill (feature), processed inline.
- Doc-visible change: `POST /subscription` now has the same two modes as
  `/subscription/{id}/payment-method` — CIT mode (`nonceData`/`cardData`) and record mode
  (`tokenData`). Record mode: attach a card already CIT'd (incl. 3DS) via `/payment/*`; new
  `firstPaymentReference` body field decides cycle 1 (link an existing payment vs. charge an
  MIT).
- Files: `api-reference/subscriptions/create.mdx` (CardGroup + Steps for the record flow,
  `firstPaymentReference` ParamField, errors table), `openapi.json` (`SubscriptionCard`
  reworked to two-mode + `networkTransactionId`/`networkReferenceId`; `firstPaymentReference`
  added to the `/subscription` request body; 201 response note), `guides/subscriptions.mdx`
  ("Creating a Subscription" section).
- Where in code: `therius-public-api/handlers_subscription.go` `createSubscriptionRecordMode`
  (commit `63290df`); `CLAUDE.md` subscription section (`4013c8c`).
- GA status: built clean, not smoke-tested against a live stack.
- Deferred: Pattern B (route the create/update CIT through the real 3DS-capable pipeline with
  a pending/resume flow) — the Adyen/Checkout.com model, bigger lift.

---

## 2026-08-31 — Removed the dead `key` auth param; Headers / Body / Query separation

- Source: developer skill / Daniel (docs polish), processed inline.
- Doc-visible change: auth is `Authorization: Bearer` **only** (therius-public-api
  `auth.go` — the raw key is not read from the body or query string; the dead
  `form:"key"` struct fields were removed in `a2f09ea`).
  - `openapi.json`: removed `key` from all 6 request-body schemas.
  - All 22 `api-reference/**` pages (`2f38edf`): removed every `key` param (body on
    POST/PATCH, query on GET/DELETE) + the "or pass key in the request body" clauses.
    Restructured each Request section into explicit `### Headers` / `### Path Parameters`
    / `### Request Body` (or `### Query Parameters`) subsections, replacing the loose
    `**Authentication:** / **Idempotency:**` prose. GET/DELETE pages get `Authorization`
    only (no Content-Type / Idempotency-Key).
  - Guides / concepts / connections / quickstart / index / authentication (`cd22849`):
    removed the `"key": "sk_..."` line from 71 code samples, added the missing
    `-H "Authorization: Bearer"` to the quickstart + `/payment/resume` curls, and
    rewrote the prose that still called `key` a body/query field.
- Where in code: `therius-public-api/auth.go` (`authKeyMerchant` / `extractBearer`),
  `handlers_subscription.go` (`a2f09ea`).
- GA status: matches shipped code.
- `merchantCode` — RESOLVED 2026-08-31 (Daniel): keep it and keep validating it against
  the key exactly as now. It is a deliberate cross-check, not redundant. Docs continue to
  document it as a required body/query field.

---

## 2026-09-02 — Usage-based & hybrid subscription billing (processed by technical-writer)
- Skill: developer → technical-writer
- Doc-visible change: `POST /v1/subscription/usage` (report a metered usage event; idempotent
  on `(meterCode, idempotencyKey)`); subscription invoice responses gain a `lines[]` array
  itemising the base fee + each metered add-on.
- Docs edited:
  - `openapi.json`: new `/subscription/usage` POST operation; new `InvoiceLine` schema;
    `lines` array added to `Invoice`.
  - `api-reference/subscriptions/usage.mdx` (new) + `es/` + `pt/`; added to the Subscriptions
    group in `docs.json` (build-nav wired es/pt).
  - `api-reference/subscriptions/invoices.mdx` + `es/` + `pt/`: documented `lines[]` (Expandable
    line object) + a `#line-items` anchor. Translation hashes bumped.
  - `guides/subscriptions.mdx` + `es/` + `pt/`: new "Usage-based and hybrid billing" section
    (meters, aggregation modes, per_unit/volume/graduated pricing, includedUnits, reporting
    flow). Translation hashes bumped.
- Verified against: `therius-public-api/subscription_usage.go` (`recordUsage`, `loadInvoiceLines`),
  `main.go` route, `therius-admin/handlers_subscription_meter.go` (Dashboard-only meter/price CRUD).
- Not done: `npx mint broken-links` (CLI not installed in this workspace); es/pt AI drafts
  await a native reviewer. GA status: backend + dashboard UI built, unverified against a live
  billing cycle — the docs say so.
