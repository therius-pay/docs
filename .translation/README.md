# Docs localization (es-LATAM · pt-BR)

Everything for translating this site into Spanish (`es/`) and Portuguese (`pt/`).
This folder is `.mintignore`d — it never publishes.

## Layout

```
es/<same tree as root>      Spanish translations
pt/<same tree as root>      Portuguese translations
.translation/glossary.md    term list — the authority; reviewers correct it here
.translation/build-nav.mjs  regenerates docs.json es/pt nav from the en tree
.translation/check-staleness.mjs   CI: fails if a translation's English source changed
.translation/hash.mjs       prints the sha256 to record in a translation's frontmatter
.github/workflows/translations.yml   runs the check on every PR / push
```

## Every translated file's frontmatter carries

```yaml
translationOf: guides/subscriptions.mdx          # repo-relative path to the English source
translationSourceHash: <sha256 of that file>     # its bytes when this translation was made
```

Get the hash with `node .translation/hash.mjs <en-file>`.

## Workflow

**Translating a page**

1. Copy the English `.mdx` to `es/<path>` and `pt/<path>`.
2. Translate prose + `# comments in code blocks` only. Never touch: frontmatter keys
   (except `title`/`sidebarTitle`/`description`, which ARE translated), `openapi:` values,
   JSON, field names, component tags, code. Follow `glossary.md`.
3. Add `translationOf` + `translationSourceHash` to the frontmatter.
4. `node .translation/build-nav.mjs es pt` to wire the pages into `docs.json`.
5. `node .translation/check-staleness.mjs` — must pass.
6. A native es / pt reviewer (the marketing-deck reviewers) signs off before it's live.

**When an English page changes** — `check-staleness.mjs` fails, naming the stale
`es/`/`pt/` files. Re-translate them and bump `translationSourceHash`.

**API Reference pages** — translate the prose; the request/response schema panel is
rendered from `openapi.json` and stays English. Each `es/`/`pt/` api-reference page carries
the `<SchemaLangNote />` snippet (`snippets/schema-lang-note.mdx`) right after the intro.

## Not translated / kept verbatim

See `glossary.md` § "Do NOT translate".
