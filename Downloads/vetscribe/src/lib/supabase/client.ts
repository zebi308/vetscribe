import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Keep a single Supabase client instance across the entire app.
// This avoids multiple GoTrueClient instances sharing the same auth storage key.
let supabaseInstance: SupabaseClient | null = null

if (url && key) {
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export const supabase = supabaseInstance

export const isSupabaseConfigured = Boolean(supabaseInstance)
