#!/usr/bin/env node
/**
 * Print the sha256 of an English source .mdx — the value to put in a translation's
 * `translationSourceHash` frontmatter after (re)translating it.
 *
 * Usage: node .translation/hash.mjs guides/subscriptions.mdx
 */
import fs from 'node:fs';
import crypto from 'node:crypto';

const file = process.argv[2];
if (!file) {
  console.error('usage: node .translation/hash.mjs <path-to-english-mdx>');
  process.exit(2);
}
console.log(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
