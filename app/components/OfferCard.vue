<script setup lang="ts">
import type { Offer } from '#shared/types/offer'
import { dateLabel, quota, money } from '#shared/utils/format'
import { settle } from '#shared/utils/analytics'
const props = withDefaults(defineProps<{ offer: Offer; stake?: number }>(), { stake: 100 })
const net = computed(() => settle(props.offer, props.stake).profit / 100)
const sportIcons: Record<string, string> = {
  Calcio: '⚽',
  Tennis: '🎾',
  Basket: '🏀',
  Motori: '🏁',
  Altro: '◉',
}
</script>
<template>
  <article
    class="px-4.5 border border-[#354034] rounded-[9px] bg-[radial-gradient(ellipse_at_0_0,_#3a3f2250,_transparent_70%)] bg-[#1b231d] pt-4.5 pb-0 min-w-0 flex flex-col overflow-hidden md:px-3.5 md:pt-[15px] xl:px-[19px] xl:pt-[19px]"
  >
    <div class="flex justify-between items-center gap-3 mb-[15px] md:mb-[17px]">
      <span class="text-[11px] text-[#a4b4a5] flex items-center gap-1.5 md:text-[10px]"
        ><span class="text-sm" aria-hidden="true">{{ sportIcons[offer.sport] }}</span
        >{{ offer.sport }}</span
      ><span class="text-[11px] text-[#889b8d] md:text-[10px]">{{ dateLabel(offer.date) }}</span>
    </div>
    <h3 class="text-[17px] leading-[1.4] font-semibold tracking-[-0.2px] md:text-[15px]">
      {{ offer.event }}
    </h3>
    <p
      class="whitespace-pre-line wrap-anywhere text-[13px] text-[#9cafa1] leading-[1.6] mt-[9px] min-h-0 mb-[5px] md:text-xs md:min-h-14.5 md:mb-0"
    >
      {{ offer.market }}
    </p>
    <div
      class="p-3 mx-[-6px] flex justify-between gap-2.5 items-center bg-[#141b16aa] mt-4 mb-0 rounded-[5px] flex-nowrap md:px-2.5 md:py-[11px] md:mx-[-7px] md:mt-4.5 md:flex-wrap xl:flex-nowrap"
    >
      <span
        class="text-lime text-xs tracking-[0.1px] font-[750] flex items-center gap-[3px] md:text-[10px]"
        >SUPER<span class="text-white">QUOTA</span><AppIcon name="boost" :size="17"
      /></span>
      <div class="flex items-center gap-1.5 shrink-0 ml-auto xl:ml-0">
        <del
          class="text-[#768b7c] text-[15px] md:text-[13px]"
          v-if="offer.original_odds !== null"
          >{{ quota(offer.original_odds) }}</del
        ><AppIcon class="text-[#b9c8bd]" name="boost" :size="17" /><strong
          class="text-[27px] leading-[1] tracking-[-0.7px] md:text-2xl"
          >{{ quota(offer.boosted_odds) }}</strong
        >
      </div>
    </div>
    <div
      class="px-0 py-[13px] flex items-center justify-between mt-[13px] border-t border-t-[#2d3b30] gap-2.5 md:mt-3"
    >
      <StatusBadge :outcome="offer.outcome" /><span
        class="text-sm font-semibold flex items-end flex-col leading-[1.5] tabular-nums md:text-xs"
        v-if="offer.outcome !== 'pending'"
        :class="[net < 0 ? 'text-negative' : 'text-mint']"
        >{{ money(net, true)
        }}<small class="text-[10px] font-normal text-[#7a9080] md:text-[9px]"
          >utile su {{ money(stake) }}</small
        ></span
      ><span v-else class="text-[10px] text-[#9a9d7e]">Da aggiornare</span>
    </div>
  </article>
</template>
