export function useAdmin() {
  const event = useRequestEvent()
  const shouldFetchOnServer = useRoute().path.startsWith('/management')
  return useFetch<{ admin: boolean; email: string | null }>('/api/auth/session', {
    key: 'admin-session',
    lazy: true,
    server: shouldFetchOnServer,
    async onResponse({ response }) {
      if (import.meta.server && event) {
        // SSR's internal fetch does not forward refreshed session cookies automatically.
        const { appendResponseHeader, setResponseHeader } = await import('h3')
        for (const cookie of response.headers.getSetCookie()) {
          appendResponseHeader(event, 'set-cookie', cookie)
        }
        setResponseHeader(event, 'cache-control', 'private, no-cache')
      }
    },
  })
}
