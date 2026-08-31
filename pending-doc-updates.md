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

## 2026-08-31 — Private API key: header-only, no longer accepted in the request body
- Skill: developer
- Doc-visible change: The raw private API key (`prv_production_…` / `prv_sandbox_…`) is now
  **only** accepted as `Authorization: Bearer <key>`. The `"key"` field in the JSON request
  body (and the `?key=` query param on the plan DELETE endpoint) is no longer read — requests
  that rely on it will 401. `POST /sdk/session` was already header-only and is unchanged. The
  `/payment/resume` endpoint still needs no credential (the `sessionId` is the bearer); it now
  takes an optional real `Authorization` header purely as an environment hint instead of the
  old body `key`.
- Where in code/spec: `therius-public-api/auth.go` (new `authKeyMerchant` helper), all
  handlers in `handlers_payment.go` / `handlers_subscription.go` / `handlers_token.go` /
  `handlers_installments.go` / `services_subscription_analyze.go`. `therius-public-api/openapi.yaml`
  regenerated (removed every `key` body property + `key` query param; `ApiKeyAuth` security
  scheme unchanged). `../../docs/openapi.json` NOT yet updated (hand-curated).
- Docs likely affected: `authentication.mdx` (rewrite the "two ways" framing — header is the
  only way now; drop the `key` body example at lines ~28/37-42), every `api-reference/**` page
  whose request example includes `"key": "..."`, `idempotency.mdx` curl example.
- GA status: live & wired (pre-production — platform is not live yet, so this is a clean break
  with no migration window). The 4 bundled e-commerce plugins already sent the Bearer header
  and had the redundant body `key` stripped in the same change.

