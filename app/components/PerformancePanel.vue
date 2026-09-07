<script setup lang="ts">
import type { Analysis, compareOdds } from '#shared/utils/analytics'
import { money } from '#shared/utils/format'
defineProps<{ stats: Analysis; comparison: ReturnType<typeof compareOdds>; stake: number }>()
const compare = ref(false)
</script>
<template>
  <section class="border border-panel-border bg-surface rounded-lg flex flex-col min-w-0">
    <div class="px-4.5 flex justify-between items-center gap-3 pt-5 pb-0 md:px-5 md:pt-6 xl:px-6">
      <div>
        <h2 class="text-sm font-semibold tracking-tight md:text-base">Andamento del profitto</h2>
        <p class="text-xs text-mint mt-1 md:text-xs">
          Utile cumulativo · {{ money(stake) }} per scommessa
        </p>
      </div>
      <span
        class="border border-[#3c4e3d] w-[33px] h-[33px] grid place-items-center rounded-lg text-mint"
        ><AppIcon name="trend" :size="19"
      /></span>
    </div>
    <div
      class="px-3 flex items-center justify-between gap-2 pt-4 pb-0.5 flex-wrap xs:px-4.5 md:px-5 md:gap-3.5 md:pt-6 md:pb-3 xl:px-6"
    >
      <div class="flex gap-2.5 flex-wrap text-xs text-muted xs:text-xs md:gap-4 md:text-xs">
        <span class="flex items-center gap-1.5"
          ><i class="inline-block w-1.5 h-1.5 bg-mint rounded-full shrink-0" />Quota
          maggiorata</span
        ><span class="flex items-center gap-1.5" v-if="compare"
          ><i class="inline-block w-1.5 h-1.5 bg-lime rounded-full shrink-0" />Quota originale</span
        >
      </div>
      <label
        class="flex items-center gap-1.5 text-xs text-muted cursor-pointer min-h-8 relative xs:text-xs md:text-xs"
        ><input
          class="peer absolute top-0 right-0 bottom-0 left-0 w-full h-full opacity-0 cursor-pointer"
          v-model="compare"
          type="checkbox"
          role="switch"
        /><span
          class="peer-focus-visible:outline-2 peer-focus-visible:outline-solid peer-focus-visible:outline-mint peer-focus-visible:-outline-offset-2 inline-block w-[27px] h-[15px] rounded-full bg-[#35463a] relative after:content-[''] after:absolute after:left-[3px] after:top-0.5 after:w-[9px] after:h-[9px] after:rounded-full after:bg-[#8ea596] after:transition-transform after:duration-150 peer-checked:bg-[#377956] peer-checked:after:bg-[#8aefbb] peer-checked:after:translate-x-3"
        /><span>Confronta quote</span></label
      >
    </div>
    <div
      v-if="
        compare
          ? !comparison.boosted.settled && !comparison.boosted.voids
          : !stats.settled && !stats.voids
      "
      class="p-7.5 flex items-center justify-center text-center flex-col gap-3.5 min-h-70 text-mint"
    >
      <AppIcon name="chart" :size="36" /><strong class="text-base text-heading font-medium">{{
        compare ? 'Nessun risultato confrontabile' : 'Nessun risultato da mostrare'
      }}</strong>
      <p class="text-sm leading-relaxed">
        {{
          compare
            ? 'Servono scommesse concluse con entrambe le quote.'
            : 'Il grafico apparirà quando ci saranno scommesse concluse.'
        }}
      </p>
    </div>
    <ClientOnly v-else
      ><ProfitChart
        :points="compare ? comparison.boosted.points : stats.points"
        :original="compare ? comparison.original.points : undefined" /><template #fallback
        ><div
          class="mx-3 h-[235px] relative mt-3 mb-2.5 min-w-0 bg-chart-gradient bg-transparent rounded-lg md:mx-5 md:h-[285px] md:mt-3 md:mb-3.5 lg:h-70 xl:h-[285px] 2xl:h-80" /></template
    ></ClientOnly>
    <div
      v-if="compare"
      class="px-0 py-3.5 mx-4.5 my-0 border-t border-t-[#2b392e] flex justify-between gap-2 text-mint text-xs flex-wrap leading-relaxed md:mx-6 md:mt-auto md:pt-3.5 md:pb-4.5 md:gap-3 md:text-xs"
    >
      <span
        >{{ comparison.included }} scommesse confrontabili · {{ comparison.excluded }} escluse senza
        quota originale</span
      ><strong :class="comparison.extraProfit < 0 ? 'text-negative' : 'text-mint'"
        >{{ money(comparison.extraProfit, true) }} grazie al boost</strong
      >
    </div>
    <div
      v-else
      class="px-0 py-3.5 mx-4.5 my-0 border-t border-t-[#2b392e] flex justify-between gap-2 text-mint text-xs md:mx-6 md:mt-auto md:pt-3.5 md:pb-4.5 md:gap-3 md:text-xs"
    >
      <span class="first:flex first:items-center first:gap-1.5 last:hidden md:last:inline"
        ><i class="inline-block w-1.5 h-1.5 bg-mint rounded-full shrink-0" />Risultati storici,
        senza reinvestimento</span
      ><span class="first:flex first:items-center first:gap-1.5 last:hidden md:last:inline"
        >Partenza da 0 €</span
      >
    </div>
  </section>
</template>
