export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'private, no-store')
  if (isSnapshot(event)) return { admin: false, email: null, mode: 'snapshot' as const }
  const db = sessionDatabase(event)
  const {
    data: { user },
  } = await db.auth.getUser()
  return {
    admin: user?.app_metadata.role === 'admin',
    email: user?.email ?? null,
    mode: 'live' as const,
  }
})
