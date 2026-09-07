<script setup lang="ts">
import type { Analysis } from '#shared/utils/analytics'
import { money, percentage } from '#shared/utils/format'
defineProps<{ stats: Analysis; stake: number }>()
</script>
<template>
  <div class="grid grid-cols-2 gap-2.5 mb-4.5 md:grid-cols-4 md:gap-3 md:mb-[25px] lg:gap-[15px]">
    <article
      class="px-3 py-4 border border-[#3b5b41] bg-[linear-gradient(120deg,_#1e392a,_#1a2c20)] bg-transparent rounded-[10px] relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-[21px] xl:pb-[19px]"
    >
      <div
        class="text-[11px] text-[#adbdaf] flex justify-between items-center gap-[5px] relative z-1 md:text-xs"
      >
        Utile netto <AppIcon class="text-[#77b885] w-4 md:w-4.5" name="trend" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-[clamp(12px,_calc(100cqw_/_var(--amount-length)_*_1.8),_30px)] tracking-[-0.9px] font-[650] mt-3.5 mb-2.5 leading-[1.1] whitespace-nowrap relative z-1 md:tracking-[-1px] md:mt-3 md:mb-2"
        :class="stats.profit < 0 ? 'text-negative' : 'text-mint'"
        :style="{ '--amount-length': money(stats.profit, true).length }"
        >{{ money(stats.profit, true) }}</strong
      ><span
        class="text-[10px] text-[#7f9786] relative z-1 flex items-center gap-1 flex-wrap md:text-[11px]"
        >con {{ money(stake) }} per superquota</span
      >
      <div
        class="border border-[#5c8d3e33] absolute w-32.5 h-32.5 right-[-55px] top-[23px] rounded-full shadow-[0_0_0_15px_#5c8d3e12,_0_0_0_30px_#5c8d3e0b]"
      />
    </article>
    <article
      class="px-3 py-4 border border-[#303e33] bg-[linear-gradient(125deg,_#1e2821,_#19221c)] bg-transparent rounded-[10px] relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-[21px] xl:pb-[19px]"
    >
      <div
        class="text-[11px] text-[#adbdaf] flex justify-between items-center gap-[5px] relative z-1 md:text-xs"
      >
        Rendimento <AppIcon class="text-[#738b76] w-4 md:w-4.5" name="chart" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-[23px] tracking-[-0.9px] font-[650] mt-3.5 mb-2.5 leading-[1.1] whitespace-nowrap relative z-1 xs:text-[26px] md:text-[25px] md:tracking-[-1px] md:mt-3 md:mb-2 xl:text-3xl 2xl:text-4xl"
        >{{ percentage(stats.roi)
        }}<span class="text-[9px] text-[#889f8e] tracking-[1px] font-medium ml-2 md:text-[10px]"
          >ROI</span
        ></strong
      ><span
        class="text-[10px] text-[#7f9786] relative z-1 flex items-center gap-1 flex-wrap md:text-[11px]"
        >sul totale puntato</span
      >
    </article>
    <article
      class="px-3 py-4 border border-[#303e33] bg-[linear-gradient(125deg,_#1e2821,_#19221c)] bg-transparent rounded-[10px] relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-[21px] xl:pb-[19px]"
    >
      <div
        class="text-[11px] text-[#adbdaf] flex justify-between items-center gap-[5px] relative z-1 md:text-xs"
      >
        Superquote vinte <AppIcon class="text-[#738b76] w-4 md:w-4.5" name="trophy" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-[23px] tracking-[-0.9px] font-[650] mt-3.5 mb-2.5 leading-[1.1] whitespace-nowrap relative z-1 xs:text-[26px] md:text-[25px] md:tracking-[-1px] md:mt-3 md:mb-2 xl:text-3xl 2xl:text-4xl"
        >{{ percentage(stats.winRate) }}</strong
      ><span
        class="text-[10px] text-[#7f9786] relative z-1 flex items-center gap-1 flex-wrap md:text-[11px]"
        ><span class="text-mint">{{ stats.wins }} vinte</span
        ><span class="mx-0.5 my-0 text-[#536b5a]">/</span>{{ stats.settled }} concluse</span
      >
    </article>
    <article
      class="px-3 py-4 border border-[#303e33] bg-[linear-gradient(125deg,_#1e2821,_#19221c)] bg-transparent rounded-[10px] relative overflow-hidden min-h-[137px] @container xs:px-3.5 md:px-4 md:py-4.5 md:min-h-36.5 xl:px-5.5 xl:pt-[21px] xl:pb-[19px]"
    >
      <div
        class="text-[11px] text-[#adbdaf] flex justify-between items-center gap-[5px] relative z-1 md:text-xs"
      >
        Scommesse tracciate
        <AppIcon class="text-[#738b76] w-4 md:w-4.5" name="archive" :size="18" />
      </div>
      <strong
        class="mx-0 tabular-nums block text-[23px] tracking-[-0.9px] font-[650] mt-3.5 mb-2.5 leading-[1.1] whitespace-nowrap relative z-1 xs:text-[26px] md:text-[25px] md:tracking-[-1px] md:mt-3 md:mb-2 xl:text-3xl 2xl:text-4xl"
        >{{ stats.total
        }}<span
          class="p-1 border border-[#43543f] inline-block text-[6px] tracking-[0.7px] text-[#879b8a] ml-[7px] rounded-[3px] align-middle xs:text-[7px] md:hidden md:text-[8px] md:ml-2.5 xl:inline-block"
          >SUPERQUOTE</span
        ></strong
      ><span
        class="text-[10px] text-[#7f9786] relative z-1 flex items-center gap-1 flex-wrap md:text-[11px]"
        ><span v-if="stats.pending" class="w-[5px] h-[5px] rounded-full bg-[#dfd482] mr-1" />{{
          stats.pending
        }}
        in attesa<span v-if="stats.voids"> · {{ stats.voids }} rimborsate</span></span
      >
    </article>
  </div>
</template>
