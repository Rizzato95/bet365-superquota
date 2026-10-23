<script setup lang="ts">
import type { OfferPage } from '#shared/types/offer'
import { archiveSchema } from '#shared/utils/validation'
const route = useRoute()
const router = useRouter()
const { filters } = usePeriod()
const page = computed(() => {
  const raw = route.query.page
  if (raw === undefined) return 1
  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw) || Number(raw) > 100000)
    throw createError({ statusCode: 404, statusMessage: 'Pagina non trovata' })
  return Number(raw)
})
const supportedFilters = ['mode', 'year', 'month', 'from', 'to', 'sport', 'search', 'outcome']
const filtered = computed(() => supportedFilters.some((key) => route.query[key] !== undefined))
function pageTo(nextPage: number) {
  const query: Record<string, string> = {}
  for (const key of supportedFilters) {
    const value = route.query[key]
    if (typeof value === 'string' && value) query[key] = value
  }
  if (nextPage > 1) query.page = String(nextPage)
  return { path: '/archive', query }
}
const canonicalPath = computed(() => {
  const params = new URLSearchParams(pageTo(page.value).query)
  return `/archive${params.size ? `?${params}` : ''}`
})
usePageSeo({
  title: () => `Archivio superquote bet365${page.value > 1 ? ` · Pagina ${page.value}` : ''}`,
  description:
    'Esplora tutte le superquote bet365 archiviate, con ricerca e filtri per periodo, sport ed esito.',
  path: canonicalPath,
  noindex: filtered,
})
function queryValue(name: string) {
  return typeof route.query[name] === 'string' ? route.query[name] : ''
}
const search = ref(queryValue('search'))
const debouncedSearch = computed(() => queryValue('search'))
let timer: ReturnType<typeof setTimeout> | undefined
watch(
  () => route.query.search,
  () => {
    search.value = queryValue('search')
  },
)
watch(search, (value) => {
  clearTimeout(timer)
  if (value === queryValue('search')) return
  timer = setTimeout(() => {
    void router.replace({
      path: '/archive',
      query: { ...route.query, search: value || undefined, page: undefined },
    })
  }, 250)
})
onBeforeUnmount(() => clearTimeout(timer))
const outcome = computed({
  get: () => queryValue('outcome'),
  set: (value: string) => {
    void router.replace({
      path: '/archive',
      query: { ...route.query, outcome: value || undefined, page: undefined },
    })
  },
})
const query = computed(() => ({
  ...filters.value,
  page: page.value,
  search: debouncedSearch.value,
  outcome: outcome.value,
}))
const { data, status, error, refresh } = await useAsyncData<OfferPage>(
  computed(() => `${offerDataKeys.archivePrefix}${JSON.stringify(query.value)}`),
  async () => {
    const parsed = archiveSchema.safeParse(query.value)
    if (!parsed.success)
      throw createError({ statusCode: 400, statusMessage: 'Filtri non validi. Riprova.' })

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
    if (error?.code === 'PGRST103')
      throw createError({ statusCode: 404, statusMessage: 'Pagina non trovata' })
    if (error) throw new Error('Impossibile caricare l’archivio. Riprova.')

    return { offers: data ?? [], total: count ?? 0, page: filters.page, pageSize }
  },
  {
    server: true,
  },
)
watchEffect(() => {
  if (error.value?.statusCode === 404)
    throw createError({ statusCode: 404, statusMessage: 'Pagina non trovata' })
  if (
    status.value === 'success' &&
    data.value?.page === page.value &&
    page.value > Math.max(1, Math.ceil(data.value.total / data.value.pageSize))
  ) {
    throw createError({ statusCode: 404, statusMessage: 'Pagina non trovata' })
  }
})
if (import.meta.server && error.value) setResponseStatus(error.value.statusCode === 400 ? 400 : 503)
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
    :model-value="page"
    :page-to="pageTo"
    :total="data.total"
    :page-size="data.pageSize"
    :loading="status === 'pending'"
  />
</template>
