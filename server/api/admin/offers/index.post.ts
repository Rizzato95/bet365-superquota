import { offerSchema } from '../../../../shared/utils/validation'
export default defineEventHandler(async (event) => {
  assertOrigin(event)
  const db = await requireAdmin(event)
  const input = parseInput(offerSchema, await readBody(event))
  const { data, error } = await db.from('offers').insert(input).select().single()
  if (error) databaseError(error)
  setResponseStatus(event, 201)
  return data
})
