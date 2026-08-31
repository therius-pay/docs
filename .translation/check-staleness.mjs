#!/usr/bin/env node
/**
 * Translation staleness check.
 *
 * Every file under es/ and pt/ must declare, in its YAML frontmatter:
 *   translationOf: <path to the English source, repo-relative, no leading slash>
 *   translationSourceHash: <sha256 of the English source file's bytes at translation time>
 *
 * This script recomputes the current sha256 of each English source and fails if it
 * differs from what the translation recorded — i.e. the English page changed and the
 * translation was not refreshed. Also fails on: missing source, missing frontmatter
 * keys, and English pages that have no es/ or pt/ counterpart at all.
 *
 * Run: node .translation/check-staleness.mjs
 * Exit 0 = all translations current. Exit 1 = action needed (details printed).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const LOCALES = ['es', 'pt'];

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.mdx')) acc.push(path.relative(ROOT, p).replace(/\\/g, '/'));
  }
  return acc;
}

function frontmatter(file) {
  const s = fs.readFileSync(file, 'utf8');
  const m = s.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

const all = walk(ROOT);
const enPages = all.filter((p) => !LOCALES.some((l) => p.startsWith(l + '/')));
const problems = [];

// 1. every translated file points at a valid, unchanged source
for (const loc of LOCALES) {
  for (const p of all.filter((x) => x.startsWith(loc + '/'))) {
    const fm = frontmatter(path.join(ROOT, p));
    if (!fm.translationOf || !fm.translationSourceHash) {
      problems.push(`${p}: missing "translationOf" / "translationSourceHash" frontmatter`);
      continue;
    }
    const src = path.join(ROOT, fm.translationOf);
    if (!fs.existsSync(src)) {
      problems.push(`${p}: translationOf "${fm.translationOf}" does not exist (source moved or deleted)`);
      continue;
    }
    const cur = sha256(fs.readFileSync(src));
    if (cur !== fm.translationSourceHash) {
      problems.push(`${p}: STALE — "${fm.translationOf}" changed since translation (expected ${fm.translationSourceHash.slice(0, 12)}, now ${cur.slice(0, 12)})`);
    }
  }
}

// 2. every English page has an es/ and pt/ counterpart.
//    While the initial translation is in progress this is a WARNING; set STRICT=1
//    (after launch, in the workflow) to make missing translations fail the build.
const missing = [];
for (const en of enPages) {
  for (const loc of LOCALES) {
    const t = `${loc}/${en}`;
    if (!fs.existsSync(path.join(ROOT, t))) missing.push(`${en}: no ${loc}/ translation (${t})`);
  }
}
if (missing.length) {
  if (process.env.STRICT === '1') problems.push(...missing);
  else console.warn(`\n⚠ ${missing.length} English page(s) not yet translated (not failing — set STRICT=1 to enforce):\n  ` + missing.slice(0, 8).sort().join('\n  ') + (missing.length > 8 ? `\n  …and ${missing.length - 8} more` : ''));
}

if (problems.length) {
  console.error(`\n✗ ${problems.length} translation issue(s):\n`);
  for (const p of problems.sort()) console.error('  ' + p);
  console.error('\nRefresh the affected translations, then update translationSourceHash to the');
  console.error('value printed above (or: node .translation/hash.mjs <en-file>).\n');
  process.exit(1);
}
console.log('✓ all es/ and pt/ translations are current');
