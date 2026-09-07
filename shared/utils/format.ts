export const money = (n: number, signed = false) =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    useGrouping: 'always',
    signDisplay: signed ? 'exceptZero' : 'auto',
  }).format(n)
export const percentage = (n: number | null) =>
  n === null ? '—' : `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(n)}%`
export const quota = (n: number | null) =>
  n === null
    ? '—'
    : new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(
        n,
      )
export const dateLabel = (date: string, year = false) =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    ...(year ? { year: 'numeric' as const } : {}),
    timeZone: 'Europe/Rome',
  }).format(new Date(`${date}T12:00:00Z`))
export const monthLabel = (month: string) =>
  new Intl.DateTimeFormat('it-IT', { month: 'long', timeZone: 'Europe/Rome' }).format(
    new Date(`${month}-01T12:00:00Z`),
  )
export const outcomeLabels = {
  won: 'Vinta',
  lost: 'Persa',
  pending: 'In attesa',
  void: 'Rimborsata',
} as const
