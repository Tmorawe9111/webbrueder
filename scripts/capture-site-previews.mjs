/**
 * Erzeugt PNG-Screenshots für Portfolio-Previews (Viewport nach Cookie-Banner wo nötig).
 * Ausführen: node scripts/capture-site-previews.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'assets', 'previews');

const VIEW = { width: 1600, height: 1000 };

async function dismissCookies(page) {
  const candidates = [
    'button:has-text("Alle akzeptieren")',
    'button:has-text("Alle Cookies akzeptieren")',
    'button:has-text("Akzeptieren")',
    'button:has-text("Zustimmen")',
    'button:has-text("Einverstanden")',
    '#onetrust-accept-btn-handler',
    'button.cmpboxbtn.cmpboxbtnyes',
    '[data-cy="cookie-accept-all"]',
    'a.cc-btn.cc-allow',
  ];
  for (const sel of candidates) {
    try {
      const loc = page.locator(sel).first();
      if (await loc.isVisible({ timeout: 1500 })) {
        await loc.click({ timeout: 3000 });
        await page.waitForTimeout(1200);
        return true;
      }
    } catch {
      /* next */
    }
  }
  return false;
}

async function shot(name, url, { cookiesFirst = false } = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEW });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(cookiesFirst ? 2000 : 800);
  if (cookiesFirst) await dismissCookies(page);
  await page.waitForTimeout(cookiesFirst ? 1500 : 500);
  const buf = await page.screenshot({ type: 'png' });
  await mkdir(outDir, { recursive: true });
  const path = join(outDir, `${name}.png`);
  await writeFile(path, buf);
  console.log('OK', path);
  await browser.close();
}

await shot('delifiona', 'https://www.delifiona.de/', { cookiesFirst: true });
await shot('gaerte-shk', 'https://www.gaerte-shk.de/', { cookiesFirst: true });
await shot('baypw', 'https://baypw.de/', { cookiesFirst: true });
