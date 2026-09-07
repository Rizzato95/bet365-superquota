<script setup lang="ts">
import type { Analysis } from '#shared/utils/analytics'
import { money, monthLabel } from '#shared/utils/format'
const props = defineProps<{ stats: Analysis }>()
const max = computed(() => Math.max(1, ...props.stats.months.map((m) => Math.abs(m.profit))))
</script>
<template>
  <section class="border border-panel-border bg-surface rounded-lg flex flex-col">
    <div class="px-4.5 flex justify-between items-center gap-3 pt-5 pb-0 md:px-5 md:pt-6 xl:px-6">
      <div>
        <h2 class="text-sm font-semibold tracking-tight md:text-base">Mese per mese</h2>
        <p class="text-xs text-mint mt-1 md:text-xs">Il bilancio delle superquote</p>
      </div>
      <AppIcon name="calendar" :size="18" class="text-muted" />
    </div>
    <div v-if="!stats.months.length" class="px-6 py-7.5 text-mint text-sm">
      Nessun mese con scommesse concluse.
    </div>
    <div v-else class="px-4.5 py-4 flex flex-col gap-3.5 md:px-6 md:py-3.5 md:gap-2.5">
      <div v-for="m in stats.months" :key="m.month">
        <div
          class="flex justify-between gap-2.5 text-sm items-center flex-wrap md:text-xs md:flex-nowrap"
        >
          <span class="capitalize text-foreground"
            >{{ monthLabel(m.month)
            }}<small class="text-xs text-mint ml-2 md:text-xs">{{ m.count }} giocate</small></span
          ><strong
            class="font-medium whitespace-nowrap text-sm tabular-nums md:text-xs"
            :class="m.profit < 0 ? 'text-negative' : 'text-mint'"
            >{{ money(m.profit, true) }}</strong
          >
        </div>
        <div class="h-1 bg-[#27372b] rounded-lg mt-1.5 overflow-hidden md:h-[3px] md:mt-1.5">
          <span
            class="block h-full rounded-lg opacity-75"
            :class="m.profit < 0 ? 'bg-[#c27a79]' : 'bg-[#55b582]'"
            :style="{ width: `${Math.max(2, (Math.abs(m.profit) / max) * 100)}%` }"
          />
        </div>
      </div>
    </div>
    <div
      class="px-4.5 py-3.5 border-t border-t-[#304031] flex justify-between text-sm mt-auto md:px-6 md:pt-3.5 md:pb-4.5 md:text-xs"
    >
      <span class="text-muted">Totale periodo</span
      ><strong :class="stats.profit < 0 ? 'text-negative' : 'text-mint'">{{
        money(stats.profit, true)
      }}</strong>
    </div>
  </section>
</template>
