import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { createError, getHeader, getRequestURL, parseCookies, setCookie, setHeader } from 'h3'
import type { H3Event } from 'h3'
import type { Database } from '../../shared/types/database'

function credentials(event: H3Event) {
  const config = useRuntimeConfig(event)
  if (!config.public.supabaseUrl || !config.public.supabasePublishableKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database non configurato. Collega il progetto Supabase dedicato.',
    })
  }
  return { url: config.public.supabaseUrl, key: config.public.supabasePublishableKey }
}
export function publicDatabase(event: H3Event) {
  const { url, key } = credentials(event)
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
export function sessionDatabase(event: H3Event) {
  const { url, key } = credentials(event)
  setHeader(event, 'cache-control', 'private, no-store')
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () =>
        Object.entries(parseCookies(event)).map(([name, value]) => ({ name, value: value ?? '' })),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies)
          setCookie(event, name, value, {
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            secure: !import.meta.dev,
            path: '/',
          })
      },
    },
  })
}
export function assertOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin')
  const expected = new URL(useRuntimeConfig(event).public.siteUrl).origin
  const local = import.meta.dev && origin === getRequestURL(event).origin
  if (!origin || (origin !== expected && !local))
    throw createError({ statusCode: 403, statusMessage: 'Origine della richiesta non autorizzata' })
}
export async function requireAdmin(event: H3Event) {
  const db = sessionDatabase(event)
  const {
    data: { user },
    error,
  } = await db.auth.getUser()
  if (error || !user) throw createError({ statusCode: 401, statusMessage: 'Accedi per continuare' })
  if (user.app_metadata.role !== 'admin')
    throw createError({ statusCode: 403, statusMessage: 'Accesso riservato all’amministratore' })
  return db
}
