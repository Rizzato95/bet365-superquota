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
