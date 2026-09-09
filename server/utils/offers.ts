import { createError } from 'h3'
import type { H3Event } from 'h3'
import type { z } from 'zod'
import type { OfferPage } from '../../shared/types/offer'
import { archiveSchema, filterSchema } from '../../shared/utils/validation'

export function parseInput<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value)
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues.map((i) => i.message).join('. '),
    })
  return parsed.data
}
export function databaseError(error: { message: string; code?: string }) {
  console.error('Database request failed', { code: error.code })
  throw createError({
    statusCode: error.code === '42501' ? 403 : 500,
    statusMessage: 'Impossibile completare la richiesta. Riprova.',
  })
}
function filterQuery<
  T extends {
    gte: (...args: any[]) => any
    lte: (...args: any[]) => any
    eq: (...args: any[]) => any
  },
>(query: T, filters: z.infer<typeof filterSchema>): T {
  if (filters.from) query = query.gte('date', filters.from)
  if (filters.to) query = query.lte('date', filters.to)
  if (filters.sport) query = query.eq('sport', filters.sport)
  return query
}
export async function listOffers(event: H3Event, input: unknown): Promise<OfferPage> {
  const filters = parseInput(archiveSchema, input),
    pageSize = 25
  const db = await requireAdmin(event)
  let query = db.from('offers').select('*', { count: 'exact' })
  query =
    filters.deleted === 'true' ? query.not('deleted_at', 'is', null) : query.is('deleted_at', null)
  query = filterQuery(query, filters)
  if (filters.outcome) query = query.eq('outcome', filters.outcome)
  if (filters.search) {
    const literal = filters.search.replace(/[\\%_]/g, '\\$&').replace(/"/g, '\\"')
    query = query.or(`event.ilike."%${literal}%",market.ilike."%${literal}%"`)
  }
  const { data, count, error } = await query
    .order('date', { ascending: false })
    .order('id', { ascending: false })
    .range((filters.page - 1) * pageSize, filters.page * pageSize - 1)
  if (error) databaseError(error)
  return { offers: data ?? [], total: count ?? 0, page: filters.page, pageSize }
}
