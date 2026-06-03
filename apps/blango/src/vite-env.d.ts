/// <reference types="vite/client" />

/** Injected at build time from process.env / .env (see vite.config.ts). */
declare const __BLANGO_META_PIXEL_ID__: string;

interface ImportMetaEnv {
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
