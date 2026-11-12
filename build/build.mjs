#!/usr/bin/env node
/**
 * Static site generator — zero dependencies.
 * Renders every page in every language into ./dist with real, crawlable HTML.
 *   node build/build.mjs
 */
import { mkdir, rm, writeFile, readFile, cp, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '../site.config.mjs';
import { layout, url, abs, LANGS, PAGES, DEFAULT_LANG } from './layout.mjs';
import * as pages from './pages.mjs';
import tr from './i18n/tr.mjs';
import en from './i18n/en.mjs';
import de from './i18n/de.mjs';
import ar from './i18n/ar.mjs';
import ru from './i18n/ru.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const dict = { tr, en, de, ar, ru };
const BASE = (config.basePath || '').replace(/\/+$/, '');
/** Prefix root-relative URLs with the base path (e.g. GitHub Pages project sites). */
const rebase = (text) =>
  !BASE
    ? text
    : text
        .replace(/((?:href|src|action|data-endpoint)=")\/(?!\/)/g, `$1${BASE}/`)
        .replace(/("(?:tr|en|de|ar|ru)":")\//g, `$1${BASE}/`)
        .replace(/url\(\/assets/g, `url(${BASE}/assets`)
        .replace(/("(?:src|start_url)":\s*")\//g, `$1${BASE}/`);

/* ---------- 1. Translation integrity check ---------- */
function shape(obj, path = '') {
  if (Array.isArray(obj)) return obj.flatMap((v, i) => shape(v, `${path}[${i}]`));
  if (obj && typeof obj === 'object') return Object.entries(obj).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  return [path];
}
const base = new Set(shape(dict[DEFAULT_LANG]));
let problems = 0;
for (const lang of LANGS) {
  const keys = new Set(shape(dict[lang]));
  const missing = [...base].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !base.has(k));
  for (const k of missing) { console.error(`✗ [${lang}] missing translation: ${k}`); problems++; }
  for (const k of extra) { console.error(`✗ [${lang}] unknown key: ${k}`); problems++; }
  for (const k of keys) {
    const v = k.split(/\.|\[|\]/).filter(Boolean).reduce((o, p) => o?.[p], dict[lang]);
    if (typeof v === 'string' && !v.trim() && !k.endsWith('ctaText')) { console.error(`✗ [${lang}] empty: ${k}`); problems++; }
  }
  const ids = dict[lang].services.list.map((s) => s.id).join();
  if (ids !== dict[DEFAULT_LANG].services.list.map((s) => s.id).join()) { console.error(`✗ [${lang}] service ids differ`); problems++; }
}
if (problems) { console.error(`\n${problems} translation problem(s). Build aborted.`); process.exit(1); }

/* ---------- 2. Assets (fingerprinted for long-term caching) ---------- */
await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, 'assets/css'), { recursive: true });
await mkdir(join(DIST, 'assets/js'), { recursive: true });

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const minifyCss = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();

const css = rebase(minifyCss((await readFile(join(SRC, 'assets/css/fonts.css'), 'utf8')) + (await readFile(join(SRC, 'assets/css/style.css'), 'utf8'))));
const js = await readFile(join(SRC, 'assets/js/main.js'), 'utf8');
const assets = { css: `/assets/css/site.${hash(css)}.css`, js: `/assets/js/main.${hash(js)}.js` };
await writeFile(join(DIST, assets.css), css);
await writeFile(join(DIST, assets.js), js);
await cp(join(SRC, 'assets/fonts'), join(DIST, 'assets/fonts'), { recursive: true });
await cp(join(SRC, 'assets/img'), join(DIST, 'assets/img'), { recursive: true });
for (const f of await readdir(join(SRC, 'public'))) await cp(join(SRC, 'public', f), join(DIST, f), { recursive: true });
await writeFile(join(DIST, 'site.webmanifest'), rebase(await readFile(join(SRC, 'public/site.webmanifest'), 'utf8')));
if (BASE) await writeFile(join(DIST, '.nojekyll'), '');

/* ---------- 3. Pages ---------- */
const renderers = {
  home: pages.home,
  about: pages.about,
  services: pages.services,
  process: pages.process,
  international: pages.international,
  contact: pages.contact,
  privacy: pages.privacy,
  kvkk: pages.kvkk,
  404: pages.notFound
};

const fill = (html, lang) =>
  html
    .replaceAll('{kvkk}', url(dict, lang, 'kvkk'))
    .replaceAll('{privacy}', url(dict, lang, 'privacy'))
    .replaceAll('{contact}', url(dict, lang, 'contact'));

let count = 0;
for (const lang of LANGS) {
  for (const page of [...PAGES, '404']) {
    const ctx = { t: dict[lang], lang, page, dict, config, assets };
    const html = rebase(fill(layout(ctx, renderers[page](ctx)), lang));
    if (/\{(kvkk|privacy|contact)\}|undefined/.test(html)) throw new Error(`Unresolved placeholder in ${lang}/${page}`);
    const out =
      page === '404'
        ? join(DIST, lang === DEFAULT_LANG ? '' : lang, '404.html')
        : join(DIST, url(dict, lang, page), 'index.html');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html);
    count++;
  }
}

/* ---------- 4. SEO files ---------- */
const robots = ['User-agent: *', 'Allow: /', 'Disallow: /api/'];
if (config.siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = PAGES.flatMap((page) =>
    LANGS.map((lang) => {
      const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(config, url(dict, l, page))}"/>`).join('\n');
      return `  <url>\n    <loc>${abs(config, url(dict, lang, page))}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(config, url(dict, DEFAULT_LANG, page))}"/>\n  </url>`;
    })
  ).join('\n');
  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`
  );
  robots.push('', `Sitemap: ${abs(config, '/sitemap.xml')}`);
}
await writeFile(join(DIST, 'robots.txt'), robots.join('\n') + '\n');

console.log(`✓ Built ${count} pages in ${LANGS.length} languages → dist/`);
if (!config.siteUrl) console.log('ℹ siteUrl is empty in site.config.mjs — sitemap.xml skipped, canonical URLs are root-relative.');
