import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..');
const SHOTS_DIR = join(ROOT, 'temporary screenshots');

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const widthArg = process.argv[4];
const width  = widthArg ? parseInt(widthArg, 10) : 1440;
// Pass --viewport to capture only the viewport (not full-page); use with anchor URLs
const viewportOnly = process.argv.includes('--viewport');
const height = 900;

if (!url.startsWith('http://') && !url.startsWith('https://')) {
  console.error('URL must start with http:// or https://');
  console.error('Usage: node screenshot.mjs <url> [label] [width]');
  process.exit(1);
}

await mkdir(SHOTS_DIR, { recursive: true });

const existing = await readdir(SHOTS_DIR);
const numbers = existing
  .map(f => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map(m => parseInt(m[1], 10));
const nextNum = (numbers.length ? Math.max(...numbers) : 0) + 1;

const filename = label
  ? `screenshot-${nextNum}-${label}.png`
  : `screenshot-${nextNum}.png`;
const outPath = join(SHOTS_DIR, filename);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Force all .reveal elements visible so full-page screenshots aren't blank
  // (IntersectionObserver doesn't fire reliably during puppeteer fullPage capture)
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  });

  // Auto-scroll to trigger any other lazy/animated content (videos, framer hydration, etc.)
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        total += distance;
        if (total >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });

  await new Promise(r => setTimeout(r, 1200));

  if (viewportOnly) {
    // Re-trigger anchor scroll after our auto-scroll reset to top
    const hashIndex = url.indexOf('#');
    if (hashIndex >= 0) {
      const anchor = url.slice(hashIndex);
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, anchor);
      await new Promise(r => setTimeout(r, 400));
    }
    await page.screenshot({ path: outPath, fullPage: false });
  } else {
    await page.screenshot({ path: outPath, fullPage: true });
  }
  console.log(`saved → ${outPath}  (${width}x${height} @2x, full-page)`);
} finally {
  await browser.close();
}
