import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#shared/types/database'

let client: SupabaseClient<Database> | undefined

export function usePublicDatabase() {
  const config = useRuntimeConfig()
  const { supabaseUrl, supabasePublishableKey } = config.public
  if (!supabaseUrl || !supabasePublishableKey)
    throw new Error('Database non configurato. Riprova più tardi.')

  client ??= createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return client
}
