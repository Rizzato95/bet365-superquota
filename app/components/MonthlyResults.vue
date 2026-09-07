<script setup lang="ts">
import type { Analysis } from '#shared/utils/analytics'
import { money, monthLabel } from '#shared/utils/format'
const props = defineProps<{ stats: Analysis }>()
const max = computed(() => Math.max(1, ...props.stats.months.map((m) => Math.abs(m.profit))))
</script>
<template>
  <section class="border border-[#2e3b31] bg-surface rounded-[10px] flex flex-col">
    <div
      class="px-4.5 flex justify-between items-center gap-3 pt-5 pb-0 md:px-5 md:pt-[23px] xl:px-6"
    >
      <div>
        <h2 class="text-[15px] font-semibold tracking-[-0.3px] md:text-base">Mese per mese</h2>
        <p class="text-[11px] text-[#819488] mt-[5px] md:text-xs">Il bilancio delle superquote</p>
      </div>
      <AppIcon name="calendar" :size="18" class="text-muted" />
    </div>
    <div v-if="!stats.months.length" class="px-6 py-7.5 text-[#91a697] text-[13px]">
      Nessun mese con scommesse concluse.
    </div>
    <div v-else class="px-4.5 py-[17px] flex flex-col gap-3.5 md:px-[23px] md:py-3.5 md:gap-2.5">
      <div v-for="m in stats.months" :key="m.month">
        <div
          class="flex justify-between gap-2.5 text-[13px] items-center flex-wrap md:text-xs md:flex-nowrap"
        >
          <span class="capitalize text-[#c0cdc4]"
            >{{ monthLabel(m.month)
            }}<small class="text-[10px] text-[#718677] ml-2 md:text-[9px]"
              >{{ m.count }} giocate</small
            ></span
          ><strong
            class="font-medium whitespace-nowrap text-[13px] tabular-nums md:text-xs"
            :class="m.profit < 0 ? 'text-negative' : 'text-mint'"
            >{{ money(m.profit, true) }}</strong
          >
        </div>
        <div class="h-1 bg-[#27372b] rounded-[5px] mt-[7px] overflow-hidden md:h-[3px] md:mt-1.5">
          <span
            class="block h-full rounded-[5px] opacity-75"
            :class="m.profit < 0 ? 'bg-[#c27a79]' : 'bg-[#55b582]'"
            :style="{ width: `${Math.max(2, (Math.abs(m.profit) / max) * 100)}%` }"
          />
        </div>
      </div>
    </div>
    <div
      class="px-4.5 py-[15px] border-t border-t-[#304031] flex justify-between text-[13px] mt-auto md:px-[23px] md:pt-3.5 md:pb-4.5 md:text-xs"
    >
      <span class="text-[#a0b0a4]">Totale periodo</span
      ><strong :class="stats.profit < 0 ? 'text-negative' : 'text-mint'">{{
        money(stats.profit, true)
      }}</strong>
    </div>
  </section>
</template>
