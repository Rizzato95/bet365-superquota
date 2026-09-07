import type { PeriodFilter } from '#shared/types/offer'
import { filterSchema } from '#shared/utils/validation'

export function usePeriod() {
  const currentYear = Number(
    new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Europe/Rome' }).format(new Date()),
  )
  const year = useState('period-year', () => currentYear)
  const mode = useState<'year' | 'month' | 'custom'>('period-mode', () => 'year')
  const month = useState('period-month', () =>
    Number(
      new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Europe/Rome' }).format(
        new Date(),
      ),
    ),
  )
  const from = useState('period-from', () => `${currentYear}-01-01`)
  const to = useState('period-to', () => `${currentYear}-12-31`)
  const sport = useState('period-sport', () => '')
  const filters = computed<PeriodFilter>(() => {
    if (mode.value === 'custom') return { from: from.value, to: to.value, sport: sport.value }
    if (mode.value === 'month')
      return {
        from: `${year.value}-${String(month.value).padStart(2, '0')}-01`,
        to: new Date(Date.UTC(year.value, month.value, 0)).toISOString().slice(0, 10),
        sport: sport.value,
      }
    return { from: `${year.value}-01-01`, to: `${year.value}-12-31`, sport: sport.value }
  })
  const valid = computed(() => filterSchema.safeParse(filters.value).success)
  return { currentYear, year, mode, month, from, to, sport, filters, valid }
}
