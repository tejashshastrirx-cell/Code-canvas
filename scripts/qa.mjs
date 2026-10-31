// Browser QA: loads every route at desktop + mobile size, scrolls the page, records console
// errors / failed requests, and saves screenshots to qa-screenshots/.
// Usage: npm run build && npm run qa   (needs Playwright + Chromium; pre-installed in Claude Code Web)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { console.error('Playwright not available here — skip QA or run in Claude Code Web.'); process.exit(0); }

const PORT = 4173, BASE = `http://localhost:${PORT}/`;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
mkdirSync('qa-screenshots', { recursive: true });

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const routes = ['', '#/kit', '#/assets'];
const sizes = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
let problems = 0;
for (const [sizeName, viewport] of Object.entries(sizes)) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport, colorScheme: 'dark' });
    page.setDefaultTimeout(120000);
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('requestfailed', (r) => errs.push('REQFAIL ' + r.url()));
    page.on('response', (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    const name = `${sizeName}-${route.replace(/\W/g, '') || 'home'}`;
    await page.screenshot({ path: `qa-screenshots/${name}.png` });
    if (!route) {
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0, i = 0; y < h; y += viewport.height * 0.9, i++) {
        await page.mouse.wheel(0, viewport.height * 0.9);
        await page.waitForTimeout(700);
        if (i % 3 === 2) await page.screenshot({ path: `qa-screenshots/${name}-scroll${i}.png` });
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (overflow) errs.push('Horizontal overflow detected');
    }
    const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
    console.log(`${errs.length ? '✘' : '✔'} ${name}  canvases=${canvases}${errs.length ? '\n   ' + [...new Set(errs)].slice(0, 8).join('\n   ') : ''}`);
    problems += errs.length;
    await page.close();
  }
}
await browser.close();
server.kill();
console.log(problems ? `\n${problems} problem(s) found` : '\nQA passed: no console errors, failed requests or overflow.');
process.exit(problems ? 1 : 0);
