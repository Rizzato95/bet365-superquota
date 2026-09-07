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
    class="px-4.5 border border-[#354034] rounded-lg bg-card-gradient bg-[#1b231d] pt-4.5 pb-0 min-w-0 flex flex-col overflow-hidden md:px-3.5 md:pt-3.5 xl:px-5 xl:pt-5"
  >
    <div class="flex justify-between items-center gap-3 mb-3.5 md:mb-4">
      <span class="text-xs text-muted flex items-center gap-1.5 md:text-xs"
        ><span class="text-sm" aria-hidden="true">{{ sportIcons[offer.sport] }}</span
        >{{ offer.sport }}</span
      ><span class="text-xs text-mint md:text-xs">{{ dateLabel(offer.date) }}</span>
    </div>
    <h3 class="text-base leading-tight font-semibold tracking-tight md:text-sm">
      {{ offer.event }}
    </h3>
    <p
      class="whitespace-pre-line wrap-anywhere text-sm text-mint leading-relaxed mt-2 min-h-0 mb-1 md:text-xs md:min-h-14.5 md:mb-0"
    >
      {{ offer.market }}
    </p>
    <div
      class="p-3 -mx-1.5 flex justify-between gap-2.5 items-center bg-[#141b16aa] mt-4 mb-0 rounded-lg flex-nowrap md:px-2.5 md:py-2.5 md:-mx-2 md:mt-4.5 md:flex-wrap xl:flex-nowrap"
    >
      <span class="text-lime text-xs tracking-tight font-bold flex items-center gap-0.5 md:text-xs"
        >SUPER<span class="text-white">QUOTA</span><AppIcon name="boost" :size="17"
      /></span>
      <div class="flex items-center gap-1.5 shrink-0 ml-auto xl:ml-0">
        <del class="text-mint text-sm md:text-sm" v-if="offer.original_odds !== null">{{
          quota(offer.original_odds)
        }}</del
        ><AppIcon class="text-foreground" name="boost" :size="17" /><strong
          class="text-2xl leading-tight tracking-tight md:text-2xl"
          >{{ quota(offer.boosted_odds) }}</strong
        >
      </div>
    </div>
    <div
      class="px-0 py-3 flex items-center justify-between mt-3 border-t border-t-[#2d3b30] gap-2.5 md:mt-3"
    >
      <StatusBadge :outcome="offer.outcome" /><span
        class="text-sm font-semibold flex items-end flex-col leading-relaxed tabular-nums md:text-xs"
        v-if="offer.outcome !== 'pending'"
        :class="[net < 0 ? 'text-negative' : 'text-mint']"
        >{{ money(net, true)
        }}<small class="text-xs font-normal text-mint md:text-xs"
          >utile su {{ money(stake) }}</small
        ></span
      ><span v-else class="text-xs text-muted">Da aggiornare</span>
    </div>
  </article>
</template>
