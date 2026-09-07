export default defineEventHandler(async (event) => {
  assertOrigin(event)
  if (!isSnapshot(event)) {
    const { error } = await sessionDatabase(event).auth.signOut()
    if (error)
      throw createError({ statusCode: 500, statusMessage: 'Disconnessione non riuscita. Riprova.' })
  }
  return { success: true }
})
