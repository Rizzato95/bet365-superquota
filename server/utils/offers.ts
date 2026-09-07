import { createError } from 'h3'
import type { H3Event } from 'h3'
import type { z } from 'zod'
import type { Offer, OfferPage, StatisticsSource } from '../../shared/types/offer'
import { archiveSchema, filterSchema } from '../../shared/utils/validation'
import snapshot from '../data/offers-2026.json'

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
function filterSnapshot(filters: z.infer<typeof filterSchema>) {
  return (snapshot as Offer[]).filter(
    (o) =>
      !o.deleted_at &&
      (!filters.from || o.date >= filters.from) &&
      (!filters.to || o.date <= filters.to) &&
      (!filters.sport || o.sport === filters.sport),
  )
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
export async function listOffers(
  event: H3Event,
  input: unknown,
  admin = false,
): Promise<OfferPage> {
  const filters = parseInput(archiveSchema, input),
    pageSize = 25
  if (isSnapshot(event) && !admin) {
    let offers = filterSnapshot(filters).filter(
      (o) =>
        (!filters.outcome || o.outcome === filters.outcome) &&
        `${o.event} ${o.market}`
          .toLocaleLowerCase('it')
          .includes(filters.search.toLocaleLowerCase('it')),
    )
    offers.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    if (filters.deleted === 'true') offers = []
    return {
      offers: offers.slice((filters.page - 1) * pageSize, filters.page * pageSize),
      total: offers.length,
      page: filters.page,
      pageSize,
      mode: 'snapshot',
    }
  }
  const db = admin ? await requireAdmin(event) : publicDatabase(event)
  let query = db.from('offers').select('*', { count: 'exact' })
  query =
    admin && filters.deleted === 'true'
      ? query.not('deleted_at', 'is', null)
      : query.is('deleted_at', null)
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
  return { offers: data ?? [], total: count ?? 0, page: filters.page, pageSize, mode: 'live' }
}
export async function statisticsSource(event: H3Event, input: unknown): Promise<StatisticsSource> {
  const filters = parseInput(filterSchema, input)
  if (isSnapshot(event)) return { offers: filterSnapshot(filters), mode: 'snapshot' }
  const db = publicDatabase(event),
    offers: Offer[] = []
  // Fetch every row; the API's default 1,000-row limit must not truncate statistics.
  for (let offset = 0; ; offset += 1000) {
    const query = filterQuery(db.from('offers').select('*').is('deleted_at', null), filters)
    const { data, error } = await query
      .order('date')
      .order('id')
      .range(offset, offset + 999)
    if (error) databaseError(error)
    offers.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }
  return { offers, mode: 'live' }
}
