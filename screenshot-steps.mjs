import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..');
const SHOTS_DIR = join(ROOT, 'temporary screenshots');

await mkdir(SHOTS_DIR, { recursive: true });

const existing = await readdir(SHOTS_DIR);
const numbers = existing
  .map(f => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map(m => parseInt(m[1], 10));
let n = (numbers.length ? Math.max(...numbers) : 0);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/welcome.html', { waitUntil: 'networkidle0', timeout: 30000 });

  const steps = [
    { label: 'welcome',     stepIdx: 0 },
    { label: 'biz-name',    stepIdx: 1 },
    { label: 'logo',        stepIdx: 2 },
    { label: 'colors',      stepIdx: 3 },
    { label: 'photos',      stepIdx: 4 },
    { label: 'services',    stepIdx: 5 },
    { label: 'success',     stepIdx: 6 },
  ];

  for (const { label, stepIdx } of steps) {
    // Force show this step (skip animation)
    await page.evaluate((idx) => {
      document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      const target = document.querySelector(`.step[data-step="${idx}"]`);
      if (target) {
        target.classList.add('active');
        target.style.opacity = '1';
        target.style.transform = 'none';
      }
      const pct = idx >= 6 ? 100 : (idx / 5) * 100;
      const fill = document.getElementById('progress');
      if (fill) fill.style.width = `${pct}%`;
    }, stepIdx);

    await new Promise(r => setTimeout(r, 600));

    n += 1;
    const outPath = join(SHOTS_DIR, `screenshot-${n}-step-${label}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`saved → step-${label}`);
  }
} finally {
  await browser.close();
}
