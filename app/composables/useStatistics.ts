import type { Offer, StatisticsSource } from '#shared/types/offer'
import { analyze, compareOdds } from '#shared/utils/analytics'
import { filterSchema } from '#shared/utils/validation'

export function useStatistics(stake: Ref<number> = ref(100)) {
  const period = usePeriod()
  const result = useAsyncData<StatisticsSource>(
    'statistics',
    async () => {
      const parsed = filterSchema.safeParse(period.filters.value)
      if (!parsed.success) throw new Error('Filtri non validi. Riprova.')

      const filters = parsed.data
      const db = usePublicDatabase()
      const offers: Offer[] = []
      // Keep the same pagination safeguard as the former API route.
      for (let offset = 0; ; offset += 1000) {
        let query = db.from('offers').select('*').is('deleted_at', null)
        if (filters.from) query = query.gte('date', filters.from)
        if (filters.to) query = query.lte('date', filters.to)
        if (filters.sport) query = query.eq('sport', filters.sport)
        const { data, error } = await query
          .order('date')
          .order('id')
          .range(offset, offset + 999)
        if (error) throw new Error('Impossibile caricare le statistiche. Riprova.')
        offers.push(...(data ?? []))
        if (!data || data.length < 1000) break
      }
      return { offers }
    },
    {
      lazy: true,
      server: false,
      watch: [period.filters],
    },
  )
  const offers = computed(() => result.data.value?.offers ?? [])
  const stats = computed(() =>
    analyze(offers.value, stake.value, 'boosted', period.filters.value.from),
  )
  const comparison = computed(() =>
    compareOdds(offers.value, stake.value, period.filters.value.from),
  )
  return { ...result, offers, stats, comparison, period }
}
