/* Kerim Kahraman — site script (no dependencies) */
(function () {
  'use strict';

  var doc = document.documentElement;
  var body = document.body;

  /* ---------- Header state on scroll ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var label = toggle.querySelector('.sr-only');
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
      body.classList.toggle('menu-open', open);
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(function () { menu.classList.add('is-open'); });
        var first = menu.querySelector('a');
        if (first) setTimeout(function () { first.focus(); }, 50);
      } else {
        menu.classList.remove('is-open');
        setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 450);
      }
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
  }

  /* ---------- Language preference ---------- */
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    if (a.tagName !== 'A') return;
    a.addEventListener('click', function () {
      try { localStorage.setItem('kk-lang', a.dataset.lang); } catch (e) { /* storage unavailable */ }
      if (location.hash) a.href = a.href.split('#')[0] + location.hash;
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal, .step');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var msgs = {};
  try { msgs = JSON.parse(document.getElementById('form-messages').textContent); } catch (e) { /* noop */ }
  var status = document.getElementById('form-status');
  var submit = form.querySelector('button[type="submit"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;

  var rules = {
    name: function (v) { return !v ? msgs.required : v.length < 2 ? msgs.name : v.length > 100 ? msgs.tooLong : ''; },
    company: function (v) { return v.length > 120 ? msgs.tooLong : ''; },
    email: function (v) { return !v ? msgs.required : !EMAIL_RE.test(v) || v.length > 160 ? msgs.email : ''; },
    phone: function (v) { return v && (!PHONE_RE.test(v) || v.replace(/\D/g, '').length < 7) ? msgs.phone : ''; },
    country: function (v) { return v.length > 80 ? msgs.tooLong : ''; },
    service: function (v) { return !v ? msgs.service : ''; },
    message: function (v) { return !v ? msgs.required : v.length < 20 ? msgs.messageMin : v.length > 2000 ? msgs.messageMax : ''; },
    consent: function (v, el) { return !el.checked ? msgs.consent : ''; }
  };

  var fieldEl = function (name) { return form.elements[name]; };
  var setError = function (name, message) {
    var el = fieldEl(name);
    var err = document.getElementById(el.id + '-err');
    if (message) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    if (err) err.textContent = message || '';
  };
  var validateField = function (name) {
    var el = fieldEl(name);
    var value = el.type === 'checkbox' ? '' : el.value.trim();
    var message = rules[name](value, el);
    setError(name, message);
    return !message;
  };

  Object.keys(rules).forEach(function (name) {
    var el = fieldEl(name);
    if (!el) return;
    var touched = false;
    el.addEventListener('blur', function () { if (el.value || touched) { touched = true; validateField(name); } });
    el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', function () {
      if (el.getAttribute('aria-invalid') === 'true' || el.type === 'checkbox') validateField(name);
    });
  });

  var showStatus = function (type, text) {
    status.className = 'form__status is-visible form__status--' + type;
    status.textContent = text;
  };
  var setBusy = function (busy) {
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submit.querySelector('.btn__label').textContent = busy ? submit.dataset.sending : submit.dataset.label;
  };

  var lastSubmit = 0;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form__status';
    status.textContent = '';

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = fieldEl(name);
    });
    if (firstInvalid) {
      showStatus('error', msgs.summary);
      firstInvalid.focus();
      return;
    }

    // Client-side throttle (server enforces its own limits too)
    var now = Date.now();
    if (now - lastSubmit < 15000) { showStatus('error', msgs.rate); return; }

    // Honeypot: silently "succeed" for bots
    if (form.elements.website.value) {
      form.reset();
      showStatus('success', msgs.success);
      return;
    }

    var payload = {
      name: fieldEl('name').value.trim(),
      company: fieldEl('company').value.trim(),
      email: fieldEl('email').value.trim(),
      phone: fieldEl('phone').value.trim(),
      country: fieldEl('country').value.trim(),
      service: fieldEl('service').value,
      message: fieldEl('message').value.trim(),
      consent: true,
      lang: form.dataset.lang,
      website: ''
    };

    // Static hosting without a form backend: hand the validated message over to WhatsApp.
    if (!form.dataset.endpoint) {
      if (!form.dataset.wa) { showStatus('error', msgs.server); return; }
      var label = function (n) {
        var l = form.querySelector('label[for="' + fieldEl(n).id + '"]');
        return l ? l.firstChild.textContent.trim() : n;
      };
      var svc = fieldEl('service');
      var lines = ['name', 'company', 'email', 'phone', 'country'].filter(function (n) { return payload[n]; })
        .map(function (n) { return label(n) + ': ' + payload[n]; });
      lines.push(label('service') + ': ' + svc.options[svc.selectedIndex].text, '', payload.message);
      window.open('https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      lastSubmit = Date.now();
      showStatus('success', msgs.whatsapp);
      status.focus();
      return;
    }

    setBusy(true);
    var controller = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);

    fetch(form.dataset.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (res.status === 429) throw { kind: 'rate' };
        if (!res.ok) throw { kind: 'server' };
        lastSubmit = Date.now();
        form.reset();
        showStatus('success', msgs.success);
        status.focus();
      })
      .catch(function (err) {
        var kind = err && err.kind ? err.kind : 'network';
        showStatus('error', msgs[kind] || msgs.server);
      })
      .then(function () {
        clearTimeout(timer);
        setBusy(false);
      });
  });

  doc.classList.add('form-ready');
})();
