/**
 * Portfolio-Screenshots: Cookie-Banner zuverlässig schließen, dann Startseite oben.
 * Viewport exakt 16:9 wie .portfolio-shot img (aspect-ratio 16/9).
 * node scripts/capture-site-previews.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'assets', 'previews');

/** Exakt 16:9 — passt zu object-fit cover im CSS ohne Zusatzbeschnitt */
const VIEW = { width: 1600, height: 900 };

const SELECTORS = [
  '#onetrust-accept-btn-handler',
  '#onetrust-pc-btn-handler',
  'button#accept-recommended-btn-handler',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#CybotCookiebotDialogBodyButtonAccept',
  'button[id*="cookie"][id*="accept" i]',
  'button.cmpboxbtn.cmpboxbtnyes',
  'a.cc-btn.cc-allow',
  'button.fc-button.fc-cta-consent',
  '[data-testid="cookie-accept-all"]',
  'button:has-text("Alle akzeptieren")',
  'button:has-text("Alle Cookies akzeptieren")',
  'button:has-text("Alles akzeptieren")',
  'button:has-text("Akzeptieren")',
  'button:has-text("Zustimmen")',
  'button:has-text("Einverstanden")',
  'button:has-text("Verstanden")',
  'button:has-text("OK")',
  'role=button[name="Alle akzeptieren"]',
  'role=button[name="Akzeptieren"]',
  'text=Alle akzeptieren',
  'text=Akzeptieren',
];

const ACCEPT_RE =
  /(alle(\s+cookies?)?\s+)?akzeptieren|alles\s+akzeptieren|zustimmen|einverstanden|^verstanden$|^ok$|accept(\s+all)?|allow(\s+all)?|ich\s+stimme(\s+zu)?/i;

async function tryClickAll(page) {
  for (const sel of SELECTORS) {
    try {
      const loc = page.locator(sel).first();
      if (await loc.isVisible({ timeout: 350 })) {
        await loc.click({ timeout: 5000, force: true });
        await page.waitForTimeout(600);
      }
    } catch {
      /* */
    }
  }
  try {
    await page.evaluate(() => {
      const nodes = document.querySelectorAll(
        'button, a[role="button"], a.button, input[type="submit"], [role="button"]'
      );
      for (const el of nodes) {
        const t = (el.textContent || el.value || '').replace(/\s+/g, ' ').trim();
        if (!t || t.length > 120) continue;
        if (
          /(alle(\s+cookies?)?\s+)?akzeptieren|alles\s+akzeptieren|zustimmen|einverstanden|^verstanden$|^ok$|accept(\s+all)?|allow(\s+all)?|ich\s+stimme(\s+zu)?/i.test(
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
  try {
    await page.evaluate(() => {
      const re =
        /(alle(\s+cookies?)?\s+)?akzeptieren|alles\s+akzeptieren|zustimmen|einverstanden|^verstanden$|^ok$|accept(\s+all)?|allow(\s+all)?|ich\s+stimme(\s+zu)?/i;
      function walk(root) {
        const candidates = root.querySelectorAll(
          'button, a[role="button"], [role="button"], input[type="submit"], a.button'
        );
        for (const el of candidates) {
          const t = (el.textContent || el.value || '').replace(/\s+/g, ' ').trim();
          if (!t || t.length > 120) continue;
          if (re.test(t)) {
            el.click();
            return true;
          }
        }
        for (const el of root.querySelectorAll('*')) {
          if (el.shadowRoot && walk(el.shadowRoot)) return true;
        }
        return false;
      }
      return walk(document);
    });
  } catch {
    /* */
  }
}

async function dismissCookies(page) {
  for (let round = 0; round < 5; round++) {
    await tryClickAll(page);
    await page.waitForTimeout(400);
  }
}

async function waitForBannerSettled(page, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const visible = await page.evaluate(() => {
      const check = (el) => {
        if (!el) return false;
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0)
          return false;
        const r = el.getBoundingClientRect();
        return r.width > 80 && r.height > 40;
      };
      const ids = [
        'onetrust-banner-sdk',
        'onetrust-consent-sdk',
        'CybotCookiebotDialog',
        'cookiescript_injected',
        'cookiescript_injected-wrapper',
      ];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (check(el)) return true;
      }
      const cmp = document.querySelector('.cmpbox, .cc-window, [class*="cookie-banner" i], [id*="cookieconsent" i]');
      if (cmp && check(cmp)) return true;
      return false;
    });
    if (!visible) return;
    await page.waitForTimeout(250);
  }
}

async function shot(browser, name, url) {
  const context = await browser.newContext({
    viewport: VIEW,
    locale: 'de-DE',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(1800);
  await dismissCookies(page);
  await page.waitForTimeout(800);
  await dismissCookies(page);
  await waitForBannerSettled(page, 8000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const buf = await page.screenshot({ type: 'png' });
  await mkdir(outDir, { recursive: true });
  const path = join(outDir, `${name}.png`);
  await writeFile(path, buf);
  console.log('OK', path);
  await context.close();
}

const SITES = [
  ['luolou', 'https://luolou.de/'],
  ['delifiona', 'https://www.delifiona.de/'],
  ['bevisiblle', 'https://bevisiblle.de/'],
  ['baypw', 'https://baypw.de/'],
  ['gaerte-shk', 'https://www.gaerte-shk.de/'],
];

const browser = await chromium.launch({ headless: true });
try {
  for (const [name, url] of SITES) {
    await shot(browser, name, url);
  }
} finally {
  await browser.close();
}
