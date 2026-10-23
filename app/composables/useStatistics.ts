import type { Offer, StatisticsSource } from '#shared/types/offer'
import { compareOdds } from '#shared/utils/analytics'
import { filterSchema } from '#shared/utils/validation'

export async function useStatistics(stake: Ref<number> = ref(100), search: Ref<string> = ref('')) {
  const period = usePeriod()
  const event = useRequestEvent()
  const result = await useAsyncData<StatisticsSource>(
    offerDataKeys.statistics,
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
      server: true,
      watch: [period.filters],
    },
  )
  if (import.meta.server && result.error.value && event) {
    const { setResponseStatus } = await import('h3')
    setResponseStatus(event, 503)
  }
  const offers = computed(() => {
    const offers = result.data.value?.offers ?? []
    const term = search.value.trim().toLocaleLowerCase('it')
    if (!term) return offers
    return offers.filter(
      (offer) =>
        offer.event.toLocaleLowerCase('it').includes(term) ||
        offer.market.toLocaleLowerCase('it').includes(term),
    )
  })
  const comparison = computed(() =>
    compareOdds(offers.value, stake.value, period.filters.value.from),
  )
  const stats = computed(() => comparison.value.boosted)
  return { ...result, offers, stats, comparison, period }
}
