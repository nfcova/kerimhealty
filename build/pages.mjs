import { icons } from './icons.mjs';
import { url, esc, waLink } from './layout.mjs';

const SERVICE_ICONS = [icons.growth, icons.network, icons.process, icons.box];
const AUDIENCE_ICONS = [icons.building, icons.clinic, icons.box, icons.globe];
const PRINCIPLE_ICONS = [icons.shield, icons.compass, icons.target, icons.handshake];
const pad = (n) => String(n).padStart(2, '0');

/* ---------- Shared fragments ---------- */

const heroArt = () => `
<div class="hero__art" aria-hidden="true">
  <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
    <g class="art-rotate">
      <circle class="art-line" cx="430" cy="400" r="300"/>
      <circle class="art-line" cx="430" cy="400" r="300" stroke-dasharray="2 10"/>
    </g>
    <g class="art-rotate art-rotate--rev">
      <circle class="art-line" cx="430" cy="400" r="210"/>
      <path class="art-line art-line--accent" d="M430 190 A210 210 0 0 1 640 400"/>
    </g>
    <circle class="art-line" cx="430" cy="400" r="120"/>
    <g>
      <path class="art-line art-draw" pathLength="1" d="M-20 560 C 160 520, 260 300, 430 400 S 700 290, 840 230"/>
      <path class="art-line art-draw" pathLength="1" d="M-20 610 C 180 580, 300 380, 450 450 S 720 360, 840 310"/>
      <path class="art-line art-line--accent art-draw" pathLength="1" d="M-20 660 C 200 640, 330 450, 470 500 S 740 430, 840 390"/>
      <path class="art-line art-draw" pathLength="1" d="M430 40 L430 760"/>
      <path class="art-line art-draw" pathLength="1" d="M70 400 L790 400"/>
    </g>
    <g class="art-float">
      <circle class="art-dot art-pulse" cx="640" cy="400" r="4"/>
      <circle class="art-dot" cx="430" cy="190" r="3"/>
      <circle class="art-dot art-pulse" cx="310" cy="400" r="3" style="animation-delay:1.3s"/>
    </g>
  </svg>
</div>`;

const ctaLines = () => `
<div class="cta__lines" aria-hidden="true">
  <svg viewBox="0 0 1200 400" preserveAspectRatio="none">
    <path class="art-line" d="M0 320 C 300 300, 500 120, 800 160 S 1100 60, 1200 40" vector-effect="non-scaling-stroke"/>
    <path class="art-line art-line--accent" d="M0 360 C 320 340, 540 180, 820 210 S 1100 120, 1200 100" vector-effect="non-scaling-stroke"/>
  </svg>
</div>`;

function globeArt(dark = true) {
  // Abstract meridians + connection arcs (no map, no claims).
  return `
<div class="intl-art reveal" aria-hidden="true">
  <svg viewBox="0 0 500 500">
    <g class="art-rotate art-rotate--rev">
      <circle class="globe-line" cx="250" cy="250" r="200"/>
      <ellipse class="globe-line" cx="250" cy="250" rx="140" ry="200"/>
      <ellipse class="globe-line" cx="250" cy="250" rx="70" ry="200"/>
      <ellipse class="globe-line" cx="250" cy="250" rx="200" ry="70"/>
      <ellipse class="globe-line" cx="250" cy="250" rx="200" ry="140"/>
      <path class="globe-line" d="M50 250 H450 M250 50 V450"/>
    </g>
    <path class="globe-accent art-draw" pathLength="1" d="M180 200 Q 250 110 330 170"/>
    <path class="globe-accent art-draw" pathLength="1" d="M180 200 Q 150 300 230 340"/>
    <path class="globe-accent art-draw" pathLength="1" d="M180 200 Q 280 230 350 300"/>
    <circle class="globe-node" cx="180" cy="200" r="5"/>
    <circle class="globe-node art-pulse" cx="180" cy="200" r="11" opacity=".35"/>
    <circle class="globe-node" cx="330" cy="170" r="3.5"/>
    <circle class="globe-node" cx="230" cy="340" r="3.5"/>
    <circle class="globe-node" cx="350" cy="300" r="3.5"/>
    <text class="globe-label" x="194" y="196">BURSA</text>
  </svg>
</div>`;
}

function pageHero(ctx, { eyebrow, title, lead, index }) {
  const { t, dict, lang } = ctx;
  return `
<section class="page-hero">
  <div class="container">
    <nav aria-label="${esc(t.common.breadcrumb)}"><ol class="breadcrumb"><li><a href="${url(dict, lang, 'home')}">${t.nav.home}</a></li><li aria-current="page">${eyebrow}</li></ol></nav>
    <p class="eyebrow fade-up" style="--d:.05s">${eyebrow}</p>
    <h1 class="display reveal-lines"><span>${title}</span></h1>
    ${lead ? `<p class="lead fade-up" style="--d:.35s">${lead}</p>` : ''}
  </div>
  ${index ? `<span class="page-hero__index" aria-hidden="true">${index}</span>` : ''}
</section>`;
}

function cta(ctx, { title, text, primary, secondary } = {}) {
  const { t, dict, lang } = ctx;
  const c = t.cta;
  return `
<section class="section section--alt cta">
  ${ctaLines()}
  <div class="container cta__inner">
    <div class="reveal">
      <p class="eyebrow">${c.eyebrow}</p>
      <h2 class="h2">${title || c.title}</h2>
      <p class="lead" style="margin-top:1.25rem">${text || c.text}</p>
    </div>
    <div class="btn-row reveal" style="--d:.15s">
      <a class="btn" href="${url(dict, lang, 'contact')}">${primary || t.common.contactUs}${icons.arrow()}</a>
      ${secondary || ''}
    </div>
  </div>
</section>`;
}

function processSteps(ctx) {
  const { t } = ctx;
  return `<ol class="steps">${t.process.steps
    .map(
      (s, i) => `
    <li class="step reveal" style="--d:${i * 0.12}s">
      <span class="step__dot" aria-hidden="true"></span>
      <span class="step__num" aria-hidden="true">${pad(i + 1)}</span>
      <h3 class="step__title"><span class="sr-only">${pad(i + 1)} – </span>${s.title}</h3>
      <p class="step__text">${s.short}</p>
    </li>`
    )
    .join('')}</ol>`;
}

const notice = (title, text) =>
  `<div class="notice" role="note">${icons.info()}<div><strong>${title}</strong>${text}</div></div>`;

/* ---------- Pages ---------- */

export function home(ctx) {
  const { t, dict, lang } = ctx;
  const h = t.home;
  const serviceCards = t.services.list
    .map(
      (s, i) => `
    <article class="card card--link reveal" style="--d:${i * 0.08}s">
      <div class="card__top"><span class="card__icon">${SERVICE_ICONS[i]()}</span><span class="card__num" aria-hidden="true">${pad(i + 1)}</span></div>
      <h3 class="card__title"><a class="stretched" href="${url(dict, lang, 'services')}#${s.id}">${s.title}</a></h3>
      <p class="card__text">${s.short}</p>
      <ul class="card__list">${s.items.map((it) => `<li>${it.title}</li>`).join('')}</ul>
      <span class="card__foot link-arrow" aria-hidden="true">${t.common.details}${icons.arrow()}</span>
    </article>`
    )
    .join('');

  const principles = h.principles.items
    .map(
      (p, i) => `
    <div class="pillar reveal" style="--d:${i * 0.08}s">
      <div class="pillar__icon">${PRINCIPLE_ICONS[i]()}</div>
      <h3 class="pillar__title">${p.title}</h3>
      <p class="pillar__text">${p.text}</p>
    </div>`
    )
    .join('');

  return `
<section class="hero">
  ${heroArt()}
  <div class="container hero__inner">
    <p class="eyebrow fade-up" style="--d:.05s">${h.eyebrow}</p>
    <h1 class="display hero__title reveal-lines">${h.title}</h1>
    <p class="lead hero__lead fade-up" style="--d:.45s">${h.lead}</p>
    <div class="btn-row hero__actions fade-up" style="--d:.6s">
      <a class="btn" href="${url(dict, lang, 'services')}">${h.ctaPrimary}${icons.arrow()}</a>
      <a class="btn btn--ghost" href="${url(dict, lang, 'contact')}">${h.ctaSecondary}</a>
    </div>
    <dl class="hero__meta fade-up" style="--d:.8s">
      ${h.meta.map((m) => `<div class="hero__meta-item"><dt class="hero__meta-label">${m.label}</dt><dd class="hero__meta-value">${m.value}</dd></div>`).join('')}
    </dl>
  </div>
  <a class="hero__scroll" href="#intro"><span class="hero__scroll-line" aria-hidden="true"></span>${t.common.scroll}</a>
</section>

<section class="section" id="intro">
  <div class="container split">
    <div class="reveal"><p class="eyebrow">${h.intro.eyebrow}</p></div>
    <div>
      <p class="statement reveal">${h.intro.statement}</p>
      <div class="prose text-2 reveal" style="margin-top:2rem;--d:.1s"><p>${h.intro.text}</p></div>
      <div class="reveal" style="margin-top:2.25rem;--d:.2s"><a class="link-arrow" href="${url(dict, lang, 'about')}">${h.intro.link}${icons.arrow()}</a></div>
    </div>
  </div>
</section>

<section class="section section--alt" id="services">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="reveal"><p class="eyebrow">${h.services.eyebrow}</p><h2 class="h2">${h.services.title}</h2></div>
      <p class="lead reveal" style="--d:.1s">${h.services.lead}</p>
    </div>
    <div class="cards cards--4">${serviceCards}</div>
    <div class="reveal" style="margin-top:2.5rem"><a class="link-arrow" href="${url(dict, lang, 'services')}">${t.common.allServices}${icons.arrow()}</a></div>
  </div>
</section>

<section class="section" id="process">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="reveal"><p class="eyebrow">${h.process.eyebrow}</p><h2 class="h2">${h.process.title}</h2></div>
      <p class="lead reveal" style="--d:.1s">${h.process.lead}</p>
    </div>
    ${processSteps(ctx)}
    <div class="reveal" style="margin-top:3rem"><a class="link-arrow" href="${url(dict, lang, 'process')}">${h.process.link}${icons.arrow()}</a></div>
  </div>
</section>

<section class="section section--dark" id="international">
  <div class="container split split--even split--center">
    <div>
      <p class="eyebrow reveal">${h.intl.eyebrow}</p>
      <h2 class="h2 reveal" style="--d:.05s">${t.intl.title}</h2>
      <p class="lead reveal" style="margin-top:1.5rem;--d:.1s">${t.intl.lead}</p>
      <div class="btn-row reveal" style="margin-top:2.5rem;--d:.15s">
        <a class="btn" href="${url(dict, lang, 'international')}">${h.intl.cta}${icons.arrow()}</a>
      </div>
    </div>
    ${globeArt()}
  </div>
</section>

<section class="section" id="principles">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">${h.principles.eyebrow}</p><h2 class="h2">${h.principles.title}</h2></div>
    <div class="pillars pillars--4">${principles}</div>
  </div>
</section>
${cta(ctx)}`;
}

export function about(ctx) {
  const { t, dict, lang } = ctx;
  const a = t.about;
  return `
${pageHero(ctx, { eyebrow: t.nav.about, title: a.title, lead: a.lead })}

<section class="section">
  <div class="container split">
    <div class="sticky reveal">
      <div class="monogram" role="img" aria-label="Kerim Kahraman">
        <svg viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true">
          <circle class="art-line" cx="200" cy="230" r="150"/>
          <circle class="art-line" cx="200" cy="230" r="150" stroke-dasharray="2 8" />
          <path class="art-line art-line--accent art-draw" pathLength="1" d="M50 230 A150 150 0 0 1 200 80"/>
          <path class="art-line" d="M0 420 H400"/>
        </svg>
        <span class="monogram__letters" aria-hidden="true">K<span>K</span></span>
        <div class="monogram__caption" aria-hidden="true"><span>Kerim Kahraman</span><span>Bursa</span></div>
      </div>
    </div>
    <div>
      <p class="eyebrow reveal">${a.profileEyebrow}</p>
      <p class="statement reveal">${a.statement}</p>
      <div class="prose text-2 reveal" style="margin-top:2rem;--d:.1s">${a.paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>
      <div class="signature reveal" style="--d:.15s"><span class="signature__line" aria-hidden="true"></span><div><div class="signature__name">Kerim Kahraman</div><div class="signature__role">${t.brand.tag} · Bursa</div></div></div>
      <dl class="facts reveal" style="margin-top:3.5rem;--d:.2s">
        ${a.facts.map((f) => `<div class="fact"><dt class="fact__label">${f.label}</dt><dd class="fact__value">${f.value}</dd></div>`).join('')}
      </dl>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">${a.focus.eyebrow}</p><h2 class="h2">${a.focus.title}</h2></div>
    <div class="pillars pillars--4">
      ${a.focus.items
        .map(
          (p, i) => `<div class="pillar reveal" style="--d:${i * 0.08}s"><div class="pillar__icon">${SERVICE_ICONS[i]()}</div><h3 class="pillar__title">${p.title}</h3><p class="pillar__text">${p.text}</p></div>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="reveal"><p class="eyebrow">${a.approach.eyebrow}</p><h2 class="h2">${a.approach.title}</h2></div>
    <div class="reveal" style="--d:.1s">
      <div class="prose text-2">${a.approach.paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>
      <div style="margin-top:2.5rem">${notice(t.common.scopeTitle, t.common.scopeText)}</div>
    </div>
  </div>
</section>
${cta(ctx, { secondary: `<a class="btn btn--ghost" href="${url(dict, lang, 'services')}">${t.common.allServices}</a>` })}`;
}

export function services(ctx) {
  const { t, dict, lang } = ctx;
  const s = t.services;
  const blocks = s.list
    .map(
      (svc, i) => `
    <article class="service" id="${svc.id}">
      <div class="service__num reveal" aria-hidden="true">${pad(i + 1)}</div>
      <div class="reveal" style="--d:.05s">
        <h2 class="service__title">${svc.title}</h2>
        <p class="service__intro">${svc.intro}</p>
      </div>
      <ul class="service__items reveal" style="--d:.12s">
        ${svc.items.map((it) => `<li class="service__item"><span class="service__item-mark" aria-hidden="true"></span><div><h3 class="service__item-title">${it.title}</h3><p class="service__item-text">${it.text}</p></div></li>`).join('')}
      </ul>
    </article>`
    )
    .join('');
  return `
${pageHero(ctx, { eyebrow: t.nav.services, title: s.title, lead: s.lead })}

<section class="section">
  <div class="container">${blocks}</div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="reveal"><p class="eyebrow">${s.audience.eyebrow}</p><h2 class="h2">${s.audience.title}</h2></div>
      <p class="lead reveal" style="--d:.1s">${s.audience.lead}</p>
    </div>
    <div class="pillars pillars--4">
      ${s.audience.items.map((p, i) => `<div class="pillar reveal" style="--d:${i * 0.08}s"><div class="pillar__icon">${AUDIENCE_ICONS[i]()}</div><h3 class="pillar__title">${p.title}</h3><p class="pillar__text">${p.text}</p></div>`).join('')}
    </div>
    <div class="reveal" style="margin-top:3.5rem">${notice(t.common.scopeTitle, t.common.scopeText)}</div>
  </div>
</section>
${cta(ctx, { title: s.ctaTitle, secondary: `<a class="btn btn--ghost" href="${url(dict, lang, 'process')}">${t.nav.process}</a>` })}`;
}

export function process(ctx) {
  const { t, dict, lang } = ctx;
  const p = t.process;
  const details = p.steps
    .map(
      (s, i) => `
    <article class="step-detail">
      <div class="step-detail__head reveal"><span class="step-detail__num" aria-hidden="true">${pad(i + 1)}</span><h2 class="step-detail__title"><span class="sr-only">${pad(i + 1)} – </span>${s.title}</h2></div>
      <div class="reveal" style="--d:.1s">
        <p class="step-detail__lead">${s.lead}</p>
        <ul class="step-detail__list">${s.points.map((pt) => `<li>${icons.check()}<span>${pt}</span></li>`).join('')}</ul>
      </div>
    </article>`
    )
    .join('');
  return `
${pageHero(ctx, { eyebrow: t.nav.process, title: p.title, lead: p.lead })}

<section class="section section--tight">
  <div class="container">${processSteps(ctx)}</div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">${p.detailEyebrow}</p><h2 class="h2">${p.detailTitle}</h2></div>
    ${details}
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="reveal"><p class="eyebrow">${p.faq.eyebrow}</p><h2 class="h2">${p.faq.title}</h2></div>
    <div class="faq reveal" style="--d:.1s">
      ${p.faq.items.map((f) => `<details class="faq__item"><summary class="faq__q">${f.q}<span class="faq__toggle" aria-hidden="true"></span></summary><div class="faq__a"><p>${f.a}</p></div></details>`).join('')}
    </div>
  </div>
</section>
${cta(ctx)}`;
}

export function international(ctx) {
  const { t } = ctx;
  const n = t.intl;
  return `
${pageHero(ctx, { eyebrow: t.nav.international, title: n.title, lead: n.lead })}

<section class="section">
  <div class="container split split--even split--center">
    <div>
      <p class="eyebrow reveal">${n.whyEyebrow}</p>
      <p class="statement reveal">${n.statement}</p>
      <div class="prose text-2 reveal" style="margin-top:2rem;--d:.1s">${n.paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>
    </div>
    ${globeArt(false)}
  </div>
</section>

<section class="section section--dark">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">${n.areas.eyebrow}</p><h2 class="h2">${n.areas.title}</h2></div>
    <div class="pillars pillars--4">
      ${n.areas.items.map((p, i) => `<div class="pillar reveal" style="--d:${i * 0.08}s"><div class="pillar__icon">${[icons.handshake, icons.chat, icons.compass, icons.layers][i]()}</div><h3 class="pillar__title">${p.title}</h3><p class="pillar__text">${p.text}</p></div>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="reveal"><p class="eyebrow">${n.scope.eyebrow}</p><h2 class="h2">${n.scope.title}</h2></div>
    <div class="reveal" style="--d:.1s">
      <p class="lead">${n.scope.text}</p>
      <div style="margin-top:2.5rem">${notice(n.scope.noticeTitle, n.scope.noticeText)}</div>
    </div>
  </div>
</section>
${cta(ctx, { title: n.ctaTitle, text: n.ctaText })}`;
}

export function contact(ctx) {
  const { t, dict, lang, config } = ctx;
  const c = t.contact;
  const f = t.form;
  const cc = config.contact;
  const go = `<svg class="icon channel__go icon--arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>`;
  const channel = ({ icon, label, value, href, external, ltr }) =>
    href
      ? `<a class="channel" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}><span class="channel__icon">${icon}</span><span class="channel__body"><span class="channel__label">${label}</span><span class="channel__value"${ltr ? ' dir="ltr"' : ''}>${value}</span></span>${go}</a>`
      : `<div class="channel"><span class="channel__icon">${icon}</span><span class="channel__body"><span class="channel__label">${label}</span><span class="channel__value${value === t.common.soon ? ' channel__value--pending' : ''}">${value}</span></span></div>`;

  const channels = [
    channel({ icon: icons.whatsapp(), label: 'WhatsApp', value: cc.whatsapp ? c.waValue : t.common.soon, href: cc.whatsapp ? waLink(config, t.common.waMessage) : '', external: true }),
    cc.phone ? channel({ icon: icons.phone(), label: t.common.phoneLabel, value: esc(cc.phone), href: `tel:${cc.phone.replace(/\s+/g, '')}`, ltr: true }) : '',
    channel({ icon: icons.mail(), label: t.common.emailLabel, value: cc.email ? esc(cc.email) : t.common.soon, href: cc.email ? `mailto:${cc.email}` : '', ltr: !!cc.email }),
    channel({ icon: icons.linkedin(), label: 'LinkedIn', value: cc.linkedin ? c.linkedinValue : t.common.soon, href: cc.linkedin || '', external: true }),
    channel({ icon: icons.pin(), label: t.common.locationLabel, value: c.locationValue })
  ].join('');

  const opt = `<span class="opt">${f.optional}</span>`;
  const req = `<span class="req" aria-hidden="true">*</span>`;
  const messages = JSON.stringify(f.errors).replace(/</g, '\\u003c');

  return `
${pageHero(ctx, { eyebrow: t.nav.contact, title: c.title, lead: c.lead })}

<section class="section">
  <div class="container split">
    <div>
      <div class="sticky">
        <p class="eyebrow reveal">${c.channelsEyebrow}</p>
        <h2 class="h3 reveal" style="margin-bottom:1.75rem">${c.channelsTitle}</h2>
        <div class="channels reveal" style="--d:.08s">${channels}</div>
        <p class="text-2 reveal" style="margin-top:1.75rem;font-size:.92rem;--d:.12s">${c.serviceArea}</p>
      </div>
    </div>
    <div class="form-card reveal" style="--d:.1s" id="form">
      <h2 class="h3">${f.title}</h2>
      <p class="text-2" style="margin-top:.5rem;margin-bottom:2rem;font-size:.95rem">${f.intro}</p>
      <form class="form" id="contact-form" action="${esc(config.formEndpoint)}" method="post" novalidate data-endpoint="${esc(config.formEndpoint)}" data-lang="${lang}">
        <script type="application/json" id="form-messages">${messages}</script>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="field__label" for="f-name">${f.name}${req}</label>
            <input class="field__input" id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="f-name-err">
            <p class="field__error" id="f-name-err" aria-live="polite"></p>
          </div>
          <div class="field">
            <label class="field__label" for="f-company">${f.company}${opt}</label>
            <input class="field__input" id="f-company" name="company" type="text" autocomplete="organization" maxlength="120" aria-describedby="f-company-err">
            <p class="field__error" id="f-company-err" aria-live="polite"></p>
          </div>
        </div>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="field__label" for="f-email">${f.email}${req}</label>
            <input class="field__input" id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="160" dir="ltr" aria-describedby="f-email-err">
            <p class="field__error" id="f-email-err" aria-live="polite"></p>
          </div>
          <div class="field">
            <label class="field__label" for="f-phone">${f.phone}${opt}</label>
            <input class="field__input" id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="30" dir="ltr" placeholder="+90" aria-describedby="f-phone-err">
            <p class="field__error" id="f-phone-err" aria-live="polite"></p>
          </div>
        </div>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="field__label" for="f-country">${f.country}${opt}</label>
            <input class="field__input" id="f-country" name="country" type="text" autocomplete="country-name" maxlength="80" aria-describedby="f-country-err">
            <p class="field__error" id="f-country-err" aria-live="polite"></p>
          </div>
          <div class="field">
            <label class="field__label" for="f-service">${f.service}${req}</label>
            <select class="field__input" id="f-service" name="service" required aria-describedby="f-service-err">
              <option value="">${f.servicePlaceholder}</option>
              ${t.services.list.map((s) => `<option value="${s.id}">${s.title}</option>`).join('')}
              <option value="international">${f.serviceIntl}</option>
              <option value="other">${f.serviceOther}</option>
            </select>
            <p class="field__error" id="f-service-err" aria-live="polite"></p>
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="f-message">${f.message}${req}</label>
          <textarea class="field__input" id="f-message" name="message" required minlength="20" maxlength="2000" aria-describedby="f-message-hint f-message-err"></textarea>
          <p class="field__hint" id="f-message-hint">${f.messageHint}</p>
          <p class="field__error" id="f-message-err" aria-live="polite"></p>
        </div>
        <div class="field field--hp" aria-hidden="true">
          <label for="f-website">Website</label>
          <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>
        <p class="form__privacy">${f.privacyNote.replace('{kvkk}', url(dict, lang, 'kvkk')).replace('{privacy}', url(dict, lang, 'privacy'))}</p>
        <div class="field">
          <label class="check"><input type="checkbox" name="consent" id="f-consent" required aria-describedby="f-consent-err"><span>${f.consent.replace('{kvkk}', url(dict, lang, 'kvkk'))}</span></label>
          <p class="field__error" id="f-consent-err" aria-live="polite"></p>
        </div>
        <div class="form__status" id="form-status" role="status" aria-live="polite" tabindex="-1"></div>
        <div class="form__actions">
          <span class="field__hint">${f.required}</span>
          <button class="btn" type="submit" data-label="${esc(f.submit)}" data-sending="${esc(f.sending)}"><span class="btn__label">${f.submit}</span>${icons.arrow()}</button>
        </div>
      </form>
    </div>
  </div>
</section>`;
}

function legal(ctx, key, index) {
  const { t } = ctx;
  const L = t[key];
  const sections = L.sections
    .map((s, i) => {
      const body = s.body
        .map((b) => (Array.isArray(b) ? `<ul>${b.map((li) => `<li>${li}</li>`).join('')}</ul>` : `<p>${b}</p>`))
        .join('');
      return `<section id="s${i + 1}" aria-labelledby="s${i + 1}-t"><h2 id="s${i + 1}-t">${i + 1}. ${s.title}</h2>${body}</section>`;
    })
    .join('');
  return `
${pageHero(ctx, { eyebrow: L.eyebrow, title: L.title, lead: L.lead, index })}
<section class="section">
  <div class="container split">
    <aside class="toc-wrap"><nav class="sticky toc" aria-label="${esc(t.common.toc)}"><p class="toc__title">${t.common.toc}</p>${L.sections.map((s, i) => `<a href="#s${i + 1}">${i + 1}. ${s.title}</a>`).join('')}</nav></aside>
    <article class="legal">
      <p class="legal__meta">${t.common.lastUpdated}: ${L.updated}</p>
      ${sections}
    </article>
  </div>
</section>`;
}

export const privacy = (ctx) => legal(ctx, 'privacy');
export const kvkk = (ctx) => legal(ctx, 'kvkk');

export function notFound(ctx) {
  const { t, dict, lang } = ctx;
  return `
<section class="notfound">
  <div class="container">
    <div class="notfound__code" aria-hidden="true">404</div>
    <h1 class="h2">${t.notFound.title}</h1>
    <p class="lead">${t.notFound.text}</p>
    <div class="btn-row">
      <a class="btn" href="${url(dict, lang, 'home')}">${t.common.backHome}${icons.arrow()}</a>
      <a class="btn btn--ghost" href="${url(dict, lang, 'contact')}">${t.nav.contact}</a>
    </div>
  </div>
</section>`;
}
