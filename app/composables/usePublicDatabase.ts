import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#shared/types/database'

let client: SupabaseClient<Database> | undefined

export function usePublicDatabase() {
  const config = useRuntimeConfig()
  const { supabaseUrl, supabasePublishableKey } = config.public
  if (!supabaseUrl || !supabasePublishableKey)
    throw new Error('Database non configurato. Riprova più tardi.')

  const createPublicClient = () =>
    createClient<Database>(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  // Server requests never share a client or carry an administrator session.
  if (import.meta.server) return createPublicClient()
  client ??= createPublicClient()
  return client
}
