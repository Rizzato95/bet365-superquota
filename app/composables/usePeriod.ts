import type { PeriodFilter } from '#shared/types/offer'
import { filterSchema } from '#shared/utils/validation'

export function usePeriod() {
  const currentYear = Number(
    new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Europe/Rome' }).format(new Date()),
  )
  const route = useRoute()
  const router = useRouter()
  function periodValue<T extends string | number>(
    name: string,
    fallback: T,
    parse: (value: string) => T,
    stateFallback: T = fallback,
  ) {
    const state = useState(`period-${name}`, () => stateFallback)
    return computed({
      get: () =>
        route.path === '/archive'
          ? typeof route.query[name] === 'string'
            ? parse(route.query[name])
            : fallback
          : state.value,
      set: (value: T) => {
        if (route.path === '/archive') {
          const query = { ...route.query, [name]: String(value) }
          delete query.page
          void router.replace({ path: '/archive', query })
        } else state.value = value
      },
    })
  }
  const year = periodValue('year', currentYear, (v) =>
    /^\d{4}$/.test(v) && Number(v) >= 2026 && Number(v) <= currentYear ? Number(v) : currentYear,
  )
  const mode = periodValue<'all' | 'year' | 'month' | 'custom'>(
    'mode',
    'all',
    (v) => (v === 'year' || v === 'month' || v === 'custom' ? v : 'all'),
    'year',
  )
  const currentMonth = Number(
    new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Europe/Rome' }).format(new Date()),
  )
  const month = periodValue('month', currentMonth, (v) =>
    /^\d{1,2}$/.test(v) && Number(v) >= 1 && Number(v) <= 12 ? Number(v) : currentMonth,
  )
  const from = periodValue('from', `${currentYear}-01-01`, (v) => v)
  const to = periodValue('to', `${currentYear}-12-31`, (v) => v)
  const sport = periodValue('sport', '', (v) => v)
  const filters = computed<PeriodFilter>(() => {
    if (mode.value === 'all') return { sport: sport.value }
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
