<script setup lang="ts">
import type { Analysis } from '#shared/utils/analytics'
import { money, percentage } from '#shared/utils/format'
defineProps<{ stats: Analysis; stake: number }>()
</script>
<template>
  <div class="grid grid-cols-2 gap-2.5 mb-4.5 md:grid-cols-4 md:gap-3 md:mb-6 lg:gap-3.5">
    <article
      class="px-3 py-4 border border-[#3b5b41] bg-profit-gradient bg-transparent rounded-lg relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-5 xl:pb-5"
    >
      <div
        class="text-xs text-secondary flex justify-between items-center gap-1 relative z-1 md:text-xs"
      >
        Utile netto <AppIcon class="text-mint w-4 md:w-4.5" name="trend" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-2xl tracking-tight font-semibold mt-3.5 mb-2.5 leading-tight whitespace-nowrap relative z-1 md:tracking-tight md:mt-3 md:mb-2"
        :class="stats.profit < 0 ? 'text-negative' : 'text-mint'"
        :style="{ '--amount-length': money(stats.profit, true).length }"
        >{{ money(stats.profit, true) }}</strong
      ><span
        class="text-xs text-stat-helper relative z-1 flex items-center gap-1 flex-wrap md:text-xs"
        >con {{ money(stake) }} per superquota</span
      >
      <div
        class="border border-[#5c8d3e33] absolute w-32.5 h-32.5 right-[-55px] top-6 rounded-full shadow-[0_0_0_15px_#5c8d3e12,_0_0_0_30px_#5c8d3e0b]"
      />
    </article>
    <article
      class="px-3 py-4 border border-[#303e33] bg-metric-gradient bg-transparent rounded-lg relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-5 xl:pb-5"
    >
      <div
        class="text-xs text-secondary flex justify-between items-center gap-1 relative z-1 md:text-xs"
      >
        Rendimento <AppIcon class="text-icon-muted w-4 md:w-4.5" name="chart" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-2xl tracking-tight font-semibold mt-3.5 mb-2.5 leading-tight whitespace-nowrap relative z-1 xs:text-2xl md:text-2xl md:tracking-tight md:mt-3 md:mb-2 xl:text-3xl 2xl:text-4xl"
        >{{ percentage(stats.roi)
        }}<span class="text-xs text-mint tracking-tight font-medium ml-2 md:text-xs"
          >ROI</span
        ></strong
      ><span
        class="text-xs text-stat-helper relative z-1 flex items-center gap-1 flex-wrap md:text-xs"
        >sul totale puntato</span
      >
    </article>
    <article
      class="px-3 py-4 border border-[#303e33] bg-metric-gradient bg-transparent rounded-lg relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-5 xl:pb-5"
    >
      <div
        class="text-xs text-secondary flex justify-between items-center gap-1 relative z-1 md:text-xs"
      >
        Superquote vinte <AppIcon class="text-icon-muted w-4 md:w-4.5" name="trophy" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-2xl tracking-tight font-semibold mt-3.5 mb-2.5 leading-tight whitespace-nowrap relative z-1 xs:text-2xl md:text-2xl md:tracking-tight md:mt-3 md:mb-2 xl:text-3xl 2xl:text-4xl"
        >{{ percentage(stats.winRate) }}</strong
      ><span
        class="text-xs text-stat-helper relative z-1 flex items-center gap-1 flex-wrap md:text-xs"
        ><span class="text-mint">{{ stats.wins }} vinte</span
        ><span class="mx-0.5 my-0 text-muted">/</span>{{ stats.settled }} concluse</span
      >
    </article>
    <article
      class="px-3 py-4 border border-[#303e33] bg-metric-gradient bg-transparent rounded-lg relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-5 xl:pb-5"
    >
      <div
        class="text-xs text-secondary flex justify-between items-center gap-1 relative z-1 md:text-xs"
      >
        Scommesse tracciate
        <AppIcon class="text-icon-muted w-4 md:w-4.5" name="archive" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-2xl tracking-tight font-semibold mt-3.5 mb-2.5 leading-tight whitespace-nowrap relative z-1 xs:text-2xl md:text-2xl md:tracking-tight md:mt-3 md:mb-2 xl:text-3xl 2xl:text-4xl"
        >{{ stats.total
        }}<span
          class="p-1 border border-[#43543f] inline-block text-xs tracking-tight text-mint ml-1.5 rounded-lg align-middle xs:text-xs md:hidden md:text-xs md:ml-2.5 xl:inline-block"
          >SUPERQUOTE</span
        ></strong
      ><span
        class="text-xs text-stat-helper relative z-1 flex items-center gap-1 flex-wrap md:text-xs"
        ><span v-if="stats.pending" class="w-[5px] h-[5px] rounded-full bg-[#dfd482] mr-1" />{{
          stats.pending
        }}
        in attesa<span v-if="stats.voids"> · {{ stats.voids }} rimborsate</span></span
      >
    </article>
  </div>
</template>
