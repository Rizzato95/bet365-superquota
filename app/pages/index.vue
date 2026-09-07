<script setup lang="ts">
useHead({ title: 'Overview' })
const { data, error, status, refresh, stats, offers, comparison } = await useStatistics()
const latest = computed(() =>
  [...offers.value]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 6),
)
</script>
<template>
  <div class="flex items-center justify-between mb-[23px] gap-2.5 md:mb-6.5 md:gap-5">
    <h1 class="text-[29px] font-[660] tracking-[-1.25px] leading-[1.25] md:text-[34px]">
      Overview
    </h1>
  </div>
  <PeriodFilters />
  <DataState
    v-if="error || !data"
    :error="!!error"
    :loading="status === 'pending'"
    @retry="refresh()"
  />
  <div
    v-else
    :class="{ 'pointer-events-none opacity-55': status === 'pending' }"
    :aria-busy="status === 'pending'"
  >
    <MetricCards :stats="stats" :stake="100" />
    <div
      class="grid grid-cols-1 gap-4.5 items-stretch mb-7.5 md:grid-cols-[minmax(0,_1.9fr)_minmax(250px,_1fr)] md:gap-[15px] md:mb-8.5 lg:grid-cols-[minmax(0,_1.8fr)_minmax(240px,_1fr)] xl:grid-cols-[minmax(0,_2.25fr)_minmax(260px,_1fr)] xl:gap-5"
    >
      <PerformancePanel :stats="stats" :comparison="comparison" :stake="100" /><MonthlyResults
        :stats="stats"
      />
    </div>
    <section>
      <div class="flex justify-between items-center mb-[17px] gap-2.5 md:mb-5 md:gap-3">
        <div>
          <h2
            class="text-lg font-semibold tracking-[-0.4px] flex gap-2.5 items-center md:text-[19px]"
          >
            Ultime superquote<span
              class="px-1.5 py-0.5 border border-[#3c4c40] text-[#9bad9e] rounded-[5px] text-[10px] tracking-[0] font-medium"
              >{{ latest.length }}</span
            >
          </h2>
          <p class="text-[#83958a] text-[11px] mt-1.5 md:text-xs">
            Le scommesse più recenti e i loro risultati
          </p>
        </div>
        <NuxtLink
          to="/archive"
          class="flex items-center gap-[5px] text-[#72cda3] text-[11px] whitespace-nowrap md:gap-2 md:text-xs hover:text-[#a1ecc2]"
          >View archive<AppIcon name="arrow" :size="17"
        /></NuxtLink>
      </div>
      <div
        v-if="latest.length"
        class="grid grid-cols-1 gap-[13px] md:grid-cols-3 md:gap-3 xl:gap-4"
      >
        <OfferCard v-for="offer in latest" :key="offer.id" :offer="offer" />
      </div>
      <DataState v-else empty />
    </section>
  </div>
</template>
