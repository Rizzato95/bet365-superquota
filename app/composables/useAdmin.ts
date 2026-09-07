export function useAdmin() {
  const event = useRequestEvent()
  return useFetch<{ admin: boolean; email: string | null }>('/api/auth/session', {
    key: 'admin-session',
    lazy: true,
    async onResponse({ response }) {
      if (import.meta.server && event) {
        // SSR's internal fetch does not forward refreshed session cookies automatically.
        const { appendResponseHeader, setResponseHeader } = await import('h3')
        for (const cookie of response.headers.getSetCookie()) {
          appendResponseHeader(event, 'set-cookie', cookie)
        }
        setResponseHeader(event, 'cache-control', 'private, no-store')
      }
    },
  })
}
