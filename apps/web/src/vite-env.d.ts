/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_BRAND_NAME: string;
  readonly VITE_BRAND_NAME_AR: string;
  readonly VITE_WHATSAPP_PHONE: string;
  readonly VITE_GA4_ID: string;
  readonly VITE_HOTJAR_ID: string;
  readonly VITE_TIKTOK_PIXEL_ID: string;
  readonly VITE_SNAP_PIXEL_ID: string;
  readonly VITE_META_PIXEL_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
