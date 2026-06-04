import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4180/';

const consoleLogs = [];
const collectRequests = [];
const gtagScriptRequests = [];

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage();

page.on('console', (msg) => {
  const text = msg.text();
  if (text.includes('[Blango GA4]') || text.includes('gtag')) {
    consoleLogs.push(text);
  }
});

page.on('request', (req) => {
  const u = req.url();
  if (u.includes('google-analytics.com/g/collect') || u.includes('google-analytics.com/j/collect')) {
    collectRequests.push(u);
  }
  if (u.includes('googletagmanager.com/gtag/js')) {
    gtagScriptRequests.push(u);
  }
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

const runtimeState = await page.evaluate(() => ({
  hasWindowGtag: typeof window.gtag === 'function',
  hasDataLayer: Array.isArray(window.dataLayer),
  dataLayerLength: window.dataLayer?.length ?? 0,
  dataLayer: window.dataLayer?.slice(0, 20),
  blangoGa4Dataset: document.documentElement.dataset.blangoGa4,
  gtagScriptPresent: !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
}));

console.log('=== URL ===', url);
console.log('=== Runtime state ===', JSON.stringify(runtimeState, null, 2));
console.log('=== GA4 console logs ===');
consoleLogs.forEach((l) => console.log(l));
console.log('=== gtag.js requests ===', gtagScriptRequests.length);
gtagScriptRequests.forEach((u) => console.log(u));
console.log('=== g/collect requests ===', collectRequests.length);
collectRequests.forEach((u) => console.log(u.slice(0, 200)));

await page.click('a[href="/pricing"]', { timeout: 10000 }).catch(() => null);
await page.waitForTimeout(3000);

const afterNav = await page.evaluate(() => ({
  dataLayerLength: window.dataLayer?.length ?? 0,
  dataLayerTail: window.dataLayer?.slice(-5),
}));

console.log('=== After /pricing navigation ===', JSON.stringify(afterNav, null, 2));
console.log('=== g/collect after nav ===', collectRequests.length);

await browser.close();

if (collectRequests.length === 0) {
  console.error('FAIL: No g/collect requests detected');
  process.exit(1);
}

console.log('PASS: g/collect requests detected');
