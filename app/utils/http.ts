export function isUnauthorizedError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const response = error as {
    status?: unknown
    statusCode?: unknown
    response?: { status?: unknown }
  }

  return [response.status, response.statusCode, response.response?.status].some(
    (status) => status === 401,
  )
}
export function httpErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') return fallback
  const data = 'data' in error ? error.data : undefined
  if (!data || typeof data !== 'object') return fallback
  return 'statusMessage' in data && typeof data.statusMessage === 'string'
    ? data.statusMessage
    : fallback
}
