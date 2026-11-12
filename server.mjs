#!/usr/bin/env node
/**
 * Minimal production-ready server — zero dependencies.
 *  - Serves the generated static site from ./dist (clean URLs, 404 pages, security headers)
 *  - POST /api/contact : validates the contact form and forwards it to CONTACT_WEBHOOK_URL
 *
 * Environment variables:
 *   PORT                 default 8080
 *   CONTACT_WEBHOOK_URL  HTTPS endpoint that receives the validated JSON payload
 *                        (e.g. an email-sending serverless function, Make/Zapier/n8n webhook,
 *                        or any transactional e-mail API you control).
 *   CONTACT_WEBHOOK_TOKEN optional bearer token sent to the webhook
 *   ALLOWED_ORIGIN       e.g. https://www.example.com — rejects cross-site form posts
 *   NODE_ENV             "production" disables the development fallback
 *
 * Privacy by design: form data is NOT stored on disk and NOT written to logs.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 8080;
const PROD = process.env.NODE_ENV === 'production';
const WEBHOOK = process.env.CONTACT_WEBHOOK_URL || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';
const LANG_PREFIXES = ['en', 'de', 'ar', 'ru'];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  ...(PROD ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' } : {})
};

/* ---------- Contact API ---------- */
const SERVICES = new Set(['is-gelistirme', 'kurumsal-iliskiler', 'operasyonel-surecler', 'medikal-sektor', 'international', 'other']);
const LANGS = new Set(['tr', 'en', 'de', 'ar', 'ru']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;
const hits = new Map(); // ip -> timestamps (in memory only)

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max + 1) : '');

function validate(body) {
  const d = {
    name: str(body.name, 100),
    company: str(body.company, 120),
    email: str(body.email, 160),
    phone: str(body.phone, 30),
    country: str(body.country, 80),
    service: str(body.service, 40),
    message: str(body.message, 2000),
    lang: LANGS.has(body.lang) ? body.lang : 'tr'
  };
  const errors = [];
  if (d.name.length < 2 || d.name.length > 100) errors.push('name');
  if (d.company.length > 120) errors.push('company');
  if (!EMAIL_RE.test(d.email) || d.email.length > 160) errors.push('email');
  if (d.phone && !PHONE_RE.test(d.phone)) errors.push('phone');
  if (d.country.length > 80) errors.push('country');
  if (!SERVICES.has(d.service)) errors.push('service');
  if (d.message.length < 20 || d.message.length > 2000) errors.push('message');
  if (body.consent !== true) errors.push('consent');
  return { data: d, errors };
}

function readBody(req, limit = 16 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(Object.assign(new Error('too large'), { status: 413 })); req.destroy(); }
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function json(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY_HEADERS });
  res.end(JSON.stringify(obj));
}

async function handleContact(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false });
  const origin = req.headers.origin;
  if (ALLOWED_ORIGIN && origin && origin !== ALLOWED_ORIGIN) return json(res, 403, { ok: false });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return json(res, 415, { ok: false });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
  if (rateLimited(ip)) return json(res, 429, { ok: false });

  let body;
  try { body = JSON.parse(await readBody(req)); } catch (e) { return json(res, e.status || 400, { ok: false }); }
  if (!body || typeof body !== 'object') return json(res, 400, { ok: false });
  if (body.website) return json(res, 200, { ok: true }); // honeypot

  const { data, errors } = validate(body);
  if (errors.length) return json(res, 422, { ok: false, errors });

  if (WEBHOOK) {
    try {
      const r = await fetch(WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {})
        },
        body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(10000)
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      return json(res, 200, { ok: true });
    } catch (e) {
      console.error('[contact] delivery failed:', e.message); // no personal data in logs
      return json(res, 502, { ok: false });
    }
  }
  if (!PROD) {
    console.log(`[contact] (dev) valid submission received — service=${data.service}, lang=${data.lang}. Set CONTACT_WEBHOOK_URL to deliver it.`);
    return json(res, 200, { ok: true, dev: true });
  }
  console.error('[contact] CONTACT_WEBHOOK_URL is not configured');
  return json(res, 503, { ok: false });
}

/* ---------- Static files ---------- */
async function serveFile(res, file, status = 200) {
  const data = await readFile(file);
  const ext = extname(file);
  const cache = file.includes(`${'/'}assets${'/'}`) ? 'public, max-age=31536000, immutable' : ext === '.html' ? 'no-cache' : 'public, max-age=86400';
  res.writeHead(status, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': cache, ...SECURITY_HEADERS });
  res.end(data);
}

async function handleStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  let path;
  try { path = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, safe);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!path.endsWith('/')) { res.writeHead(301, { Location: path + '/' }); return res.end(); }
      file = join(file, 'index.html');
    }
    return await serveFile(res, file);
  } catch {
    const lang = path.split('/')[1];
    const notFound = join(ROOT, LANG_PREFIXES.includes(lang) ? lang : '', '404.html');
    try { return await serveFile(res, notFound, 404); } catch { res.writeHead(404); return res.end('Not found'); }
  }
}

createServer((req, res) => {
  const p = req.url.split('?')[0];
  (p === '/api/contact' ? handleContact(req, res) : handleStatic(req, res)).catch((e) => {
    console.error(e);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  });
}).listen(PORT, () => console.log(`→ http://localhost:${PORT}  (${PROD ? 'production' : 'development'})`));
