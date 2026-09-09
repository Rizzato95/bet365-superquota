<script setup lang="ts">
import type { OfferPage } from '#shared/types/offer'
import { archiveSchema } from '#shared/utils/validation'
usePageSeo({
  title: 'Archivio superquote bet365',
  description:
    'Esplora tutte le superquote bet365 archiviate, con ricerca e filtri per periodo, sport ed esito.',
  path: '/archive',
})
const { filters } = usePeriod()
const page = ref(1),
  search = ref(''),
  debouncedSearch = ref(''),
  outcome = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    debouncedSearch.value = value
  }, 250)
})
onBeforeUnmount(() => clearTimeout(timer))
watch(
  [filters, debouncedSearch, outcome],
  () => {
    page.value = 1
  },
  { flush: 'sync' },
)
const query = computed(() => ({
  ...filters.value,
  page: page.value,
  search: debouncedSearch.value,
  outcome: outcome.value,
}))
const { data, status, error, refresh } = useAsyncData<OfferPage>(
  'archive-offers',
  async () => {
    const parsed = archiveSchema.safeParse(query.value)
    if (!parsed.success) throw new Error('Filtri non validi. Riprova.')

    const filters = parsed.data
    const db = usePublicDatabase()
    let offersQuery = db.from('offers').select('*', { count: 'exact' }).is('deleted_at', null)
    if (filters.from) offersQuery = offersQuery.gte('date', filters.from)
    if (filters.to) offersQuery = offersQuery.lte('date', filters.to)
    if (filters.sport) offersQuery = offersQuery.eq('sport', filters.sport)
    if (filters.outcome) offersQuery = offersQuery.eq('outcome', filters.outcome)
    if (filters.search) {
      const literal = filters.search.replace(/[\\%_]/g, '\\$&').replace(/"/g, '\\"')
      offersQuery = offersQuery.or(`event.ilike."%${literal}%",market.ilike."%${literal}%"`)
    }
    const pageSize = 25
    const { data, count, error } = await offersQuery
      .order('date', { ascending: false })
      .order('id', { ascending: false })
      .range((filters.page - 1) * pageSize, filters.page * pageSize - 1)
    if (error) throw new Error('Impossibile caricare l’archivio. Riprova.')

    return { offers: data ?? [], total: count ?? 0, page: filters.page, pageSize }
  },
  {
    lazy: true,
    server: false,
    watch: [query],
  },
)
</script>
<template>
  <div class="flex items-center justify-between mb-6 gap-2.5 md:mb-6.5 md:gap-5">
    <div>
      <h1 class="text-3xl font-semibold tracking-tight leading-tight md:text-4xl">Archivio</h1>
      <p class="mt-1 text-sm leading-relaxed text-muted">
        Consulta e filtra tutte le superquote registrate.
      </p>
    </div>
  </div>
  <PeriodFilters /><ArchiveControls
    v-model:search="search"
    v-model:outcome="outcome"
    :total="data?.total"
  /><DataState
    v-if="error || !data || !data.offers.length"
    :error="!!error"
    :loading="status === 'pending'"
    :empty="data?.offers.length === 0"
    @retry="refresh()"
  />
  <div
    v-else
    :class="{ 'pointer-events-none opacity-55': status === 'pending' }"
    :aria-busy="status === 'pending'"
  >
    <OffersTable :offers="data.offers" />
  </div>
  <PaginationBar
    v-if="data && data.total > 0"
    v-model="page"
    :total="data.total"
    :page-size="data.pageSize"
    :loading="status === 'pending'"
  />
</template>
