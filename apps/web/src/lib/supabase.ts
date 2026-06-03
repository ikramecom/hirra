import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw) return '';
  return raw.trim().replace(/\/+$/, '');
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[riyanaluxe] Supabase env vars missing. Copy .env.example → apps/web/.env.local and fill in your project URL + anon key.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey ?? '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
