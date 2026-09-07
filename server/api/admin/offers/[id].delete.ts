import { z } from 'zod'
export default defineEventHandler(async (event) => {
  assertOrigin(event)
  const db = await requireAdmin(event)
  const id = parseInput(z.uuid(), getRouterParam(event, 'id'))
  const { data, error } = await db
    .from('offers')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null)
    .select('id')
    .maybeSingle()
  if (error) databaseError(error)
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Scommessa non trovata' })
  return { success: true }
})
