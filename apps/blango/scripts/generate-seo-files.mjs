import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_ORIGIN, SITEMAP_PATHS } from '../site.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toAbsoluteUrl(pathname) {
  if (pathname === '/') {
    return `${SITE_ORIGIN}/`;
  }
  return `${SITE_ORIGIN}${pathname}`;
}

function buildSitemapXml() {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = SITEMAP_PATHS.map((pathname) => {
    const loc = escapeXml(toAbsoluteUrl(pathname));
    const priority = pathname === '/' ? '1.0' : '0.8';
    const changefreq = pathname === '/' ? 'weekly' : 'monthly';

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}

export function generateSeoFiles() {
  mkdirSync(publicDir, { recursive: true });

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const robotsPath = path.join(publicDir, 'robots.txt');

  writeFileSync(sitemapPath, buildSitemapXml(), 'utf8');
  writeFileSync(robotsPath, buildRobotsTxt(), 'utf8');

  console.log(`[blango] Wrote ${sitemapPath}`);
  console.log(`[blango] Wrote ${robotsPath}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  generateSeoFiles();
}
