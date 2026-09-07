import { z } from 'zod'
import { offerSchema } from '../../../../shared/utils/validation'
export default defineEventHandler(async (event) => {
  assertOrigin(event)
  const db = await requireAdmin(event)
  const id = parseInput(z.uuid(), getRouterParam(event, 'id'))
  const input = parseInput(offerSchema, await readBody(event))
  const { data, error } = await db
    .from('offers')
    .update(input)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .maybeSingle()
  if (error) databaseError(error)
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Scommessa non trovata' })
  return data
})
