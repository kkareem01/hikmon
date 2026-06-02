/**
 * Local dev server for hikmon.net.
 * - Serves static files (Vercel does this in prod), clean-URL aware.
 * - Routes the booking API (/api/*) to lib/handlers.mjs, mirroring the Vercel
 *   serverless functions in /api/*.mjs so the booking flow works locally.
 *
 * The Stripe/onboarding functions (api/*.js) are NOT routed here — they need
 * live Stripe keys and are exercised on Vercel. Run: node serve.mjs
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  handleConfig,
  handleAvailability,
  handleAvailabilityMonth,
  handleCreateBooking,
  handleGetBooking,
  handleGetBookingIcs,
} from './lib/handlers.mjs';
import * as log from './lib/log.mjs';

const PORT = Number(process.env.PORT || 3000);
const ROOT = resolve(fileURLToPath(import.meta.url), '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/plain; charset=utf-8',
};

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > limit) { reject(new Error('Payload too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw.length === 0) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

async function handleApi(req, res, path) {
  if (req.method === 'POST') {
    try { req.body = await readBody(req); }
    catch (e) {
      res.writeHead(400, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, error: e.message }));
    }
  }

  if (req.method === 'GET' && path === '/api/config') return handleConfig(req, res);
  if (req.method === 'GET' && path === '/api/availability') return handleAvailability(req, res);
  if (req.method === 'GET' && path === '/api/availability/month') return handleAvailabilityMonth(req, res);
  if (req.method === 'POST' && path === '/api/bookings') return handleCreateBooking(req, res);

  const icsMatch = path.match(/^\/api\/bookings\/([A-Za-z0-9-]+)\/ics$/);
  if (req.method === 'GET' && icsMatch) return handleGetBookingIcs(req, res, icsMatch[1]);
  const idMatch = path.match(/^\/api\/bookings\/([A-Za-z0-9-]+)$/);
  if (req.method === 'GET' && idMatch) return handleGetBooking(req, res, idMatch[1]);

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: false, error: 'Not found.' }));
}

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(req.url.split('?')[0]);

    if (path.startsWith('/api/')) return handleApi(req, res, path);

    let filePath = normalize(join(ROOT, path));
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

    let s;
    try { s = await stat(filePath); } catch { s = null; }
    if (s && s.isDirectory()) {
      filePath = join(filePath, 'index.html');
      try { s = await stat(filePath); } catch { s = null; }
    }
    if (!s && !extname(filePath)) {
      const htmlPath = filePath + '.html';
      try { const hs = await stat(htmlPath); if (hs.isFile()) { filePath = htmlPath; s = hs; } } catch {}
    }
    if (!s || !s.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }

    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error: ' + err.message);
  }
});

server.listen(PORT, () => {
  const dry = process.env.DRY_RUN_EMAIL === 'true';
  console.log(`serve.mjs → http://localhost:${PORT}  (root: ${ROOT})${dry ? '  [DRY_RUN_EMAIL]' : ''}`);
});
