// Takes PNG screenshots of every Kumbida reference screen and template, with the real fonts.
// Run from the repo root (needs internet for Google Fonts):
//   npm i -D playwright && npx playwright install chromium
//   node design/scripts/screenshots.mjs
// Output: design/screenshots/pages/*.png and design/screenshots/templates/<category>/*.png
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const outDir = path.join(root, 'screenshots');
const browser = await chromium.launch();

async function shoot(file, viewport, fullPage, suffix = '') {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(path.join(root, file)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const out = path.join(outDir, file.replace(/\.html$/, suffix + '.png'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, fullPage });
  await page.close();
  console.log('saved', path.relative(root, out));
}

for (const p of manifest.pages) {
  const phone = /HostPay/.test(p.file);
  await shoot(p.file, phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, true);
  if (!phone) await shoot(p.file, { width: 390, height: 844 }, true, '-mobile');
}
for (const t of manifest.templates) await shoot(t.file, { width: 390, height: 844 }, false);
await browser.close();
