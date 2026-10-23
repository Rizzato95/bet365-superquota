const currencyOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'EUR',
  useGrouping: 'always',
}
const moneyFormatter = new Intl.NumberFormat('it-IT', currencyOptions)
const signedMoneyFormatter = new Intl.NumberFormat('it-IT', {
  ...currencyOptions,
  signDisplay: 'exceptZero',
})
const percentageFormatter = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 })
const oddsFormatter = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})
const dateOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  timeZone: 'Europe/Rome',
}
const dateFormatter = new Intl.DateTimeFormat('it-IT', dateOptions)
const fullDateFormatter = new Intl.DateTimeFormat('it-IT', { ...dateOptions, year: 'numeric' })
const monthFormatter = new Intl.DateTimeFormat('it-IT', {
  month: 'long',
  timeZone: 'Europe/Rome',
})

export const money = (value: number, signed = false) =>
  (signed ? signedMoneyFormatter : moneyFormatter).format(value)

export const percentage = (value: number | null) =>
  value === null ? '—' : `${percentageFormatter.format(value)}%`

export const quota = (value: number | null) => (value === null ? '—' : oddsFormatter.format(value))

export const dateLabel = (date: string, year = false) =>
  (year ? fullDateFormatter : dateFormatter).format(new Date(`${date}T12:00:00Z`))

export const monthLabel = (month: string) =>
  monthFormatter.format(new Date(`${month}-01T12:00:00Z`))

export const outcomeLabels = {
  won: 'Vinta',
  lost: 'Persa',
  pending: 'In attesa',
  void: 'Rimborsata',
} as const
