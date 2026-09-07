import { z } from 'zod'
export default defineEventHandler(async (event) => {
  assertOrigin(event)
  const input = parseInput(
    z.object({ email: z.email(), password: z.string().min(1).max(200) }).strict(),
    await readBody(event),
  )
  const db = sessionDatabase(event)
  const { data, error } = await db.auth.signInWithPassword(input)
  if (error || !data.user)
    throw createError({ statusCode: 401, statusMessage: 'Email o password non corrette.' })
  if (data.user.app_metadata.role !== 'admin') {
    await db.auth.signOut()
    throw createError({
      statusCode: 403,
      statusMessage: 'Questo account non è abilitato alla gestione.',
    })
  }
  return { success: true }
})
