/**
 * Portfolio-Screenshots: immer erst Cookie-Banner schließen, dann Startseite (oben).
 * node scripts/capture-site-previews.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'assets', 'previews');

/** Kompakter Viewport — entspricht ungefähr dem sichtbaren Mockup */
const VIEW = { width: 1366, height: 820 };

const SELECTORS = [
  '#onetrust-accept-btn-handler',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#CybotCookiebotDialogBodyButtonAccept',
  'button[id*="cookie"][id*="accept" i]',
  'button.cmpboxbtn.cmpboxbtnyes',
  'a.cc-btn.cc-allow',
  '[data-testid="cookie-accept-all"]',
  'button:has-text("Alle akzeptieren")',
  'button:has-text("Alle Cookies akzeptieren")',
  'button:has-text("Alles akzeptieren")',
  'button:has-text("Akzeptieren")',
  'button:has-text("Zustimmen")',
  'button:has-text("Einverstanden")',
  'button:has-text("Verstanden")',
  'button:has-text("OK")',
  'text=Alle akzeptieren',
  'text=Akzeptieren',
];

async function dismissCookies(page) {
  for (let round = 0; round < 4; round++) {
    for (const sel of SELECTORS) {
      try {
        const loc = page.locator(sel).first();
        if (await loc.isVisible({ timeout: 400 })) {
          await loc.click({ timeout: 4000, force: true });
          await page.waitForTimeout(900);
        }
      } catch {
        /* weiter */
      }
    }
    try {
      await page.evaluate(() => {
        const nodes = document.querySelectorAll('button, a[role="button"], a.button, input[type="submit"]');
        for (const el of nodes) {
          const t = (el.textContent || el.value || '').trim();
          if (!t || t.length > 80) continue;
          if (
            /^(alle\s+)?(cookies?\s+)?akzeptieren|zustimmen|einverstanden|verstanden|accept(\s+all)?$/i.test(
              t
            )
          ) {
            el.click();
            return;
          }
        }
      });
    } catch {
      /* */
    }
    await page.waitForTimeout(500);
  }
}

async function shot(name, url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEW });
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(1500);
  await dismissCookies(page);
  await page.waitForTimeout(1200);
  await dismissCookies(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ type: 'png' });
  await mkdir(outDir, { recursive: true });
  const path = join(outDir, `${name}.png`);
  await writeFile(path, buf);
  console.log('OK', path);
  await browser.close();
}

const SITES = [
  ['luolou', 'https://luolou.de/'],
  ['delifiona', 'https://www.delifiona.de/'],
  ['bevisiblle', 'https://bevisiblle.de/'],
  ['baypw', 'https://baypw.de/'],
  ['gaerte-shk', 'https://www.gaerte-shk.de/'],
];

for (const [name, url] of SITES) {
  await shot(name, url);
}
