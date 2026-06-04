import { chromium } from 'playwright';

const url = process.argv[2] ?? 'https://www.blangostudio.com/';

const consoleLogs = [];
const collectRequests = [];

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage();

page.on('console', (msg) => {
  const text = msg.text();
  if (text.includes('[Blango GA4]')) consoleLogs.push(text);
});

page.on('request', (req) => {
  const u = req.url();
  if (u.includes('google-analytics.com/g/collect')) {
    collectRequests.push({ at: Date.now(), url: u, method: req.method() });
  }
});

page.on('response', async (res) => {
  const u = res.url();
  if (u.includes('google-analytics.com/g/collect')) {
    console.log('collect response', res.status(), u.slice(0, 120));
  }
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

console.log('--- after initial load, collects:', collectRequests.length);

await page.click('a[href="/pricing"]', { timeout: 10000 }).catch(() => null);
await page.waitForTimeout(5000);

console.log('--- after /pricing, collects:', collectRequests.length);
collectRequests.forEach((r, i) => {
  const params = new URL(r.url).searchParams;
  console.log(`#${i + 1}`, {
    tid: params.get('tid'),
    en: params.get('en'),
    dl: params.get('dl'),
    dr: params.get('dr'),
    dt: params.get('dt'),
    ep: params.get('ep.page_path') ?? params.get('dl'),
  });
  console.log(r.url.slice(0, 300));
});

console.log('--- console ---');
consoleLogs.forEach((l) => console.log(l));

await browser.close();
