<script setup lang="ts">
import type { OfferPage } from '#shared/types/offer'
useHead({ title: 'Archive' })
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
const { data, status, error, refresh } = await useFetch<OfferPage>('/api/offers', { query })
</script>
<template>
  <div class="flex items-center justify-between mb-[23px] gap-2.5 md:mb-6.5 md:gap-5">
    <h1 class="text-[29px] font-[660] tracking-[-1.25px] leading-[1.25] md:text-[34px]">Archive</h1>
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
