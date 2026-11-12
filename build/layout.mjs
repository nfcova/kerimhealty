import { icons } from './icons.mjs';

export const LANGS = ['tr', 'en', 'de', 'ar', 'ru'];
export const DEFAULT_LANG = 'tr';
export const PAGES = ['home', 'about', 'services', 'process', 'international', 'contact', 'privacy', 'kvkk'];
export const NAV_PAGES = ['home', 'about', 'services', 'process', 'contact'];

/** HTML-escape a value coming from config / user land. Translation strings are trusted. */
export const esc = (v = '') =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Strip tags for use in attributes / meta. */
export const plain = (v = '') => String(v).replace(/<[^>]+>/g, '');

/** Root-relative URL of a page in a language. */
export function url(dict, lang, page) {
  const prefix = lang === DEFAULT_LANG ? '/' : `/${lang}/`;
  if (page === 'home') return prefix;
  return `${prefix}${dict[lang].slugs[page]}/`;
}

export function abs(config, path) {
  return config.siteUrl ? config.siteUrl.replace(/\/$/, '') + path : path;
}

function head(ctx) {
  const { t, lang, page, dict, config, assets } = ctx;
  const seo = t.seo[page];
  const title = plain(seo.title);
  const desc = plain(seo.description);
  const self = page === '404' ? null : url(dict, lang, page);
  const alternates =
    page === '404'
      ? ''
      : LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(config, url(dict, l, page))}">`).join('\n  ') +
        `\n  <link rel="alternate" hreflang="x-default" href="${abs(config, url(dict, DEFAULT_LANG, page))}">`;

  // Language-preference redirect: only on default-language pages, only for visitors
  // arriving from outside the site, only if they explicitly chose a language before.
  const altMap = page === '404' ? '{}' : JSON.stringify(Object.fromEntries(LANGS.map((l) => [l, url(dict, l, page)])));
  const headScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var p=localStorage.getItem('kk-lang'),a=${altMap};if(d.lang==='${DEFAULT_LANG}'&&p&&p!=='${DEFAULT_LANG}'&&a[p]){var r=document.referrer,o=location.origin;if(!r||r.indexOf(o)!==0){location.replace(a[p]+location.hash);}}}catch(e){}})();`;

  const fontPreload =
    lang === 'ar'
      ? '<link rel="preload" href="/assets/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2" as="font" type="font/woff2" crossorigin>'
      : lang === 'ru'
        ? '<link rel="preload" href="/assets/fonts/inter-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>'
        : '<link rel="preload" href="/assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>';

  const jsonLd =
    page === 'home'
      ? `<script type="application/ld+json">${JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: `Kerim Kahraman | ${plain(t.brand.tag)}`,
          description: desc,
          ...(config.siteUrl ? { url: abs(config, self) } : {}),
          ...(config.contact.phone ? { telephone: config.contact.phone } : {}),
          ...(config.contact.email ? { email: config.contact.email } : {}),
          ...(config.contact.linkedin ? { sameAs: [config.contact.linkedin] } : {}),
          address: { '@type': 'PostalAddress', addressLocality: 'Bursa', addressCountry: 'TR' },
          areaServed: [{ '@type': 'City', name: 'Bursa' }, { '@type': 'Country', name: 'Türkiye' }],
          founder: { '@type': 'Person', name: 'Kerim Kahraman' },
          knowsLanguage: LANGS,
          inLanguage: lang
        }).replace(/</g, '\\u003c')}</script>`
      : '';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${t.meta.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  ${page === '404' ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${abs(config, self)}">`}
  ${alternates}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Kerim Kahraman | ${esc(plain(t.brand.tag))}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:locale" content="${t.meta.locale}">
  ${self && config.siteUrl ? `<meta property="og:url" content="${abs(config, self)}">\n  <meta property="og:image" content="${abs(config, '/assets/img/og-image.png')}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#FFFFFF">
  <meta name="format-detection" content="telephone=no">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  ${fontPreload}
  <link rel="stylesheet" href="${assets.css}">
  <script>${headScript}</script>
  <script src="${assets.js}" defer></script>
  ${jsonLd}
</head>`;
}

function langSwitcher(ctx, variant = 'header') {
  const { dict, lang, page } = ctx;
  const items = LANGS.map((l) => {
    const href = page === '404' ? url(dict, l, 'home') : url(dict, l, page);
    const cur = l === lang;
    return `<li class="lang__item"><a class="lang__link" href="${href}" hreflang="${l}" lang="${l}" data-lang="${l}"${cur ? ' aria-current="true"' : ''} title="${esc(dict[l].meta.label)}"><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr-only">${esc(dict[l].meta.label)}</span></a></li>`;
  }).join('');
  return `<nav class="lang" aria-label="${esc(ctx.t.nav.language)}"${variant === 'menu' ? ' data-variant="menu"' : ''}><ul class="lang__list">${items}</ul></nav>`;
}

function header(ctx) {
  const { t, dict, lang, page } = ctx;
  const navLinks = NAV_PAGES.map(
    (p) =>
      `<li><a class="nav__link" href="${url(dict, lang, p)}"${p === page ? ' aria-current="page"' : ''}>${t.nav[p]}</a></li>`
  ).join('');
  const mobileLinks = [...NAV_PAGES.slice(0, 4), 'international', 'contact']
    .map(
      (p, i) =>
        `<li><a class="mobile-menu__link" href="${url(dict, lang, p)}"${p === page ? ' aria-current="page"' : ''}>${t.nav[p]}<span>0${i + 1}</span></a></li>`
    )
    .join('');
  return `
<a class="skip-link" href="#main">${t.nav.skip}</a>
<header class="site-header" id="top">
  <div class="container">
    <a class="brand" href="${url(dict, lang, 'home')}" aria-label="Kerim Kahraman — ${esc(plain(t.brand.tag))}, ${esc(t.nav.home)}">
      <span class="brand__mark" aria-hidden="true">${icons.logo()}</span>
      <span class="brand__text"><span class="brand__name">Kerim Kahraman</span><span class="brand__tag">${t.brand.tag}</span></span>
    </a>
    <nav class="nav" aria-label="${esc(t.nav.main)}"><ul class="nav__list">${navLinks}</ul></nav>
    <div class="header-actions">
      ${langSwitcher(ctx)}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-label-open="${esc(t.nav.menu)}" data-label-close="${esc(t.nav.close)}">
        <span class="menu-toggle__bars" aria-hidden="true"></span><span class="sr-only">${t.nav.menu}</span>
      </button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-label="${esc(t.nav.main)}" hidden>
  <nav aria-label="${esc(t.nav.main)}"><ul class="mobile-menu__list">${mobileLinks}</ul></nav>
  <div class="mobile-menu__foot">
    <span class="mobile-menu__label">${t.nav.language}</span>
    ${langSwitcher(ctx, 'menu')}
  </div>
</div>`;
}

export function waLink(config, text) {
  if (!config.contact.whatsapp) return '';
  return `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

function footer(ctx) {
  const { t, dict, lang, config } = ctx;
  const c = config.contact;
  const pages = ['home', 'about', 'services', 'process', 'international', 'contact']
    .map((p) => `<li><a href="${url(dict, lang, p)}">${t.nav[p]}</a></li>`)
    .join('');
  const contacts = [
    `<li><span>${t.common.location}</span></li>`,
    c.phone ? `<li><a href="tel:${esc(c.phone.replace(/\s+/g, ''))}"><span class="ltr">${esc(c.phone)}</span></a></li>` : '',
    c.whatsapp ? `<li><a href="${esc(waLink(config, t.common.waMessage))}" target="_blank" rel="noopener">WhatsApp</a></li>` : '',
    c.email ? `<li><a href="mailto:${esc(c.email)}"><span class="ltr">${esc(c.email)}</span></a></li>` : '',
    c.linkedin ? `<li><a href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>` : ''
  ].join('');
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__about">
        <a class="brand" href="${url(dict, lang, 'home')}">
          <span class="brand__mark" aria-hidden="true">${icons.logo()}</span>
          <span class="brand__text"><span class="brand__name">Kerim Kahraman</span><span class="brand__tag">${t.brand.tag}</span></span>
        </a>
        <p class="footer__desc">${t.footer.desc}</p>
      </div>
      <div>
        <h2 class="footer__title">${t.footer.pages}</h2>
        <ul class="footer__list">${pages}</ul>
      </div>
      <div>
        <h2 class="footer__title">${t.footer.contact}</h2>
        <ul class="footer__list">${contacts}</ul>
      </div>
      <div>
        <h2 class="footer__title">${t.footer.legal}</h2>
        <ul class="footer__list">
          <li><a href="${url(dict, lang, 'privacy')}">${t.nav.privacy}</a></li>
          <li><a href="${url(dict, lang, 'kvkk')}">${t.nav.kvkk}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__note">
      <p class="footer__disclaimer">${t.common.disclaimer}</p>
      <p>© ${year} Kerim Kahraman. ${t.footer.rights}</p>
    </div>
    <div class="footer__wordmark" aria-hidden="true">Kerim Kahraman</div>
  </div>
</footer>`;
}

function waFloat(ctx) {
  const { t, config } = ctx;
  if (!config.contact.whatsapp) return '';
  return `<a class="wa-float" href="${esc(waLink(config, t.common.waMessage))}" target="_blank" rel="noopener" aria-label="${esc(t.common.waAria)}">${icons.whatsapp()}<span class="wa-float__label">WhatsApp</span></a>`;
}

export function layout(ctx, main) {
  return `${head(ctx)}
<body data-page="${ctx.page}">
${header(ctx)}
<main id="main" tabindex="-1">
${main}
</main>
${footer(ctx)}
${waFloat(ctx)}
</body>
</html>
`;
}
