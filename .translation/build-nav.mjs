#!/usr/bin/env node
/**
 * Regenerate `docs.json` navigation.languages for es / pt from the `en` tree.
 *
 * The `en` tree in docs.json is the single source of nav structure. This script
 * derives the `es` and `pt` trees mechanically: every page path is prefixed with
 * `es/` / `pt/`, and tab / group / anchor labels are translated via the map below
 * (keep it in sync with `.translation/glossary.md` § "Nav labels").
 *
 * Pass locale codes to include only languages whose pages actually exist yet:
 *   node .translation/build-nav.mjs es        # add/refresh the es tree only
 *   node .translation/build-nav.mjs es pt     # both
 *   node .translation/build-nav.mjs           # en only (removes es/pt trees)
 *
 * Safe to re-run; it always rebuilds from `en`.
 */
import fs from 'node:fs';

const LABELS = {
  es: {
    "Documentation": "Documentación", "API Reference": "Referencia de API", "JS SDK": "SDK de JS", "Connections": "Conexiones",
    "Get Started": "Primeros pasos", "Core Concepts": "Conceptos básicos", "Guides": "Guías", "Webhooks": "Webhooks",
    "AI Assistant": "Asistente de IA", "E-Commerce Plugins": "Plugins de e-commerce",
    "Payments": "Pagos", "Tokenization": "Tokenización", "Subscriptions": "Suscripciones", "Plans": "Planes", "SDK Session": "Sesión del SDK",
    "Payment Methods": "Métodos de pago", "Overview": "Descripción general", "Card Collection": "Recolección de tarjeta", "Wallets & More": "Billeteras y más",
  },
  pt: {
    "Documentation": "Documentação", "API Reference": "Referência da API", "JS SDK": "SDK de JS", "Connections": "Conexões",
    "Get Started": "Primeiros passos", "Core Concepts": "Conceitos básicos", "Guides": "Guias", "Webhooks": "Webhooks",
    "AI Assistant": "Assistente de IA", "E-Commerce Plugins": "Plugins de e-commerce",
    "Payments": "Pagamentos", "Tokenization": "Tokenização", "Subscriptions": "Assinaturas", "Plans": "Planos", "SDK Session": "Sessão do SDK",
    "Payment Methods": "Métodos de pagamento", "Overview": "Visão geral", "Card Collection": "Coleta de cartão", "Wallets & More": "Carteiras e mais",
  },
};

const locales = process.argv.slice(2);
for (const l of locales) if (!LABELS[l]) { console.error(`unknown locale "${l}"`); process.exit(2); }

const d = JSON.parse(fs.readFileSync('docs.json', 'utf8'));
const en = (d.navigation.languages || []).find((x) => x.language === 'en')
  || { language: 'en', tabs: d.navigation.tabs };
if (!en.tabs) { console.error('no en tabs found'); process.exit(1); }

const translate = (tree, loc) => {
  const L = LABELS[loc];
  const walk = (node) => {
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(node)) {
        if (k === 'tab' || k === 'group' || k === 'anchor') out[k] = L[v] || v;
        else if (k === 'pages') out[k] = v.map((p) => (typeof p === 'string' ? `${loc}/${p}` : walk(p)));
        else out[k] = walk(v);
      }
      return out;
    }
    return node;
  };
  return walk(JSON.parse(JSON.stringify(tree)));
};

d.navigation = {
  languages: [
    { language: 'en', tabs: en.tabs },
    ...locales.map((loc) => ({ language: loc, tabs: translate(en.tabs, loc) })),
  ],
};

fs.writeFileSync('docs.json', JSON.stringify(d, null, 2) + '\n');
console.log(`docs.json navigation.languages = [${['en', ...locales].join(', ')}]`);
