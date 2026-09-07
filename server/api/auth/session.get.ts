export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'private, no-cache')
  const db = sessionDatabase(event)
  const {
    data: { user },
  } = await db.auth.getUser()
  return {
    admin: user?.app_metadata.role === 'admin',
    email: user?.email ?? null,
  }
})
