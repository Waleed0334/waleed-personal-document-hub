import { createClient } from '@supabase/supabase-js';

const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.VITE_SUPABASE_ANON_KEY;

// Check if valid credentials exist and are not default placeholder strings
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('your-supabase-anon-key')) return false;
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'waleed_vault_auth_token',
      },
    })
  : null;

/**
 * Health check to verify connection to the Supabase backend
 */
export const checkSupabaseHealth = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env',
      url: supabaseUrl || null,
    };
  }

  try {
    // Attempt a lightweight ping query
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // It's possible the table isn't created yet or RLS rejected anonymous ping
      return {
        connected: true,
        schemaReady: !error.message.includes('relation "public.categories" does not exist'),
        message: error.message,
        url: supabaseUrl,
      };
    }
    return {
      connected: true,
      schemaReady: true,
      message: 'Connected to Supabase PostgreSQL',
      url: supabaseUrl,
    };
  } catch (err) {
    return {
      connected: false,
      message: err.message || 'Failed to reach Supabase',
      url: supabaseUrl,
    };
  }
};
