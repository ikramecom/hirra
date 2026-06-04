import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOREPO_ROOT = path.resolve(__dirname, '../..');

const BLANGO_GA4_MEASUREMENT_ID = 'G-6PJH1GP650';

/** Meta Pixel IDs are numeric; strip anything else before embedding in HTML. */
function sanitizeMetaPixelId(raw: string): string {
  return raw.replace(/\D/g, '');
}

/** GA4 IDs must match G-XXXXXXXX; fallback to Blango default. */
function resolveGa4Id(mode: string): string {
  const fromProcess = process.env.VITE_GA4_ID?.trim() ?? '';
  const fromApp = loadEnv(mode, __dirname, '').VITE_GA4_ID?.trim() ?? '';
  const fromRoot = loadEnv(mode, MONOREPO_ROOT, '').VITE_GA4_ID?.trim() ?? '';
  const candidate = fromProcess || fromApp || fromRoot || BLANGO_GA4_MEASUREMENT_ID;
  return /^G-[A-Z0-9]+$/i.test(candidate) ? candidate.toUpperCase() : BLANGO_GA4_MEASUREMENT_ID;
}

/**
 * Resolve VITE_META_PIXEL_ID for builds (Vercel injects into process.env).
 * Also loads apps/blango/.env* and repo-root .env* via loadEnv.
 */
function resolveMetaPixelId(mode: string): string {
  const fromProcess = process.env.VITE_META_PIXEL_ID?.trim() ?? '';
  const fromApp = loadEnv(mode, __dirname, '').VITE_META_PIXEL_ID?.trim() ?? '';
  const fromRoot = loadEnv(mode, MONOREPO_ROOT, '').VITE_META_PIXEL_ID?.trim() ?? '';
  return sanitizeMetaPixelId(fromProcess || fromApp || fromRoot);
}

function ga4HtmlPlugin(measurementId: string): Plugin {
  return {
    name: 'blango-ga4-html',
    transformIndexHtml(html) {
      if (!measurementId) {
        return html;
      }

      const snippet = `<!-- @blango/studio Google Analytics (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${measurementId}',{send_page_view:false});
document.documentElement.dataset.blangoGa4='1';
</script>`;

      if (html.includes('<head>')) {
        return html.replace('<head>', `<head>\n    ${snippet}`);
      }

      return html.includes('</head>')
        ? html.replace('</head>', `${snippet}\n  </head>`)
        : html;
    },
  };
}

function metaPixelHtmlPlugin(pixelId: string): Plugin {
  return {
    name: 'blango-meta-pixel-html',
    transformIndexHtml(html) {
      if (!pixelId) {
        return html;
      }

      const snippet = `<!-- @blango/studio Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');
fbq('track','PageView');
document.documentElement.dataset.blangoMetaPixel='1';
</script>
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&amp;noscript=1"/></noscript>`;

      return html.includes('</head>')
        ? html.replace('</head>', `${snippet}\n  </head>`)
        : html;
    },
  };
}

export default defineConfig(({ mode }) => {
  const metaPixelId = resolveMetaPixelId(mode);
  const ga4Id = resolveGa4Id(mode);

  return {
    plugins: [react(), ga4HtmlPlugin(ga4Id), metaPixelHtmlPlugin(metaPixelId)],
    envDir: MONOREPO_ROOT,
    define: {
      __BLANGO_META_PIXEL_ID__: JSON.stringify(metaPixelId),
      __BLANGO_GA4_ID__: JSON.stringify(ga4Id),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5180,
      strictPort: true,
      host: true,
    },
    preview: {
      port: 4180,
    },
  };
});
