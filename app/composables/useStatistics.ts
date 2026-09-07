import type { StatisticsSource } from '#shared/types/offer'
import { analyze, compareOdds } from '#shared/utils/analytics'

export function useStatistics(stake: Ref<number> = ref(100)) {
  const period = usePeriod()
  const result = useFetch<StatisticsSource>('/api/statistics', {
    query: period.filters,
    lazy: true,
  })
  const offers = computed(() => result.data.value?.offers ?? [])
  const stats = computed(() =>
    analyze(offers.value, stake.value, 'boosted', period.filters.value.from),
  )
  const comparison = computed(() =>
    compareOdds(offers.value, stake.value, period.filters.value.from),
  )
  return { ...result, offers, stats, comparison, period }
}
