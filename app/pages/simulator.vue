<script setup lang="ts">
import { stakeSchema } from '#shared/utils/validation'
import { money, quota } from '#shared/utils/format'
usePageSeo({
  title: 'Simulatore superquote bet365',
  description:
    'Simula il rendimento storico delle superquote bet365 scegliendo una puntata fissa personalizzata.',
  path: '/simulator',
})
const stake = ref(100),
  enteredStake = ref('100')
const stakeError = computed(() => {
  const result = stakeSchema.safeParse(enteredStake.value.replace(',', '.'))
  return result.success ? '' : result.error.issues[0]!.message
})
watch(enteredStake, (value) => {
  const parsed = stakeSchema.safeParse(value.replace(',', '.'))
  if (parsed.success) stake.value = parsed.data
})
const { data, status, error, refresh, stats, comparison } = useStatistics(stake)
</script>
<template>
  <div class="flex items-center justify-between mb-6 gap-2.5 md:mb-6.5 md:gap-5">
    <div>
      <h1 class="text-3xl font-semibold tracking-tight leading-tight md:text-4xl">Simulatore</h1>
      <p class="mt-1 text-sm leading-relaxed text-muted">
        Scopri il rendimento storico con una puntata fissa.
      </p>
    </div>
  </div>
  <PeriodFilters />
  <section
    class="px-4.5 py-5 border border-panel-border bg-transparent rounded-lg flex items-center gap-5 flex-wrap mb-5.5 bg-simulator-gradient md:p-6 md:gap-6"
  >
    <div class="flex gap-3 items-center flex-1 min-w-full md:gap-4 lg:min-w-55">
      <span
        class="border border-[#4c6c43] bg-[#314f36] text-lime h-[43px] w-[43px] rounded-lg grid place-items-center shrink-0 md:h-13.5 md:w-13.5 md:rounded-xl"
      >
        <AppIcon name="simulator" :size="26" />
      </span>
      <div>
        <h2 class="text-base tracking-tight font-medium md:text-lg">
          Quanto avresti ottenuto con una puntata fissa?
        </h2>
        <p class="text-xs text-mint mt-1.5 leading-relaxed max-w-[235px] md:text-xs md:max-w-none">
          L’importo viene applicato a tutte le scommesse del periodo.
        </p>
      </div>
    </div>
    <div
      class="flex items-center gap-2.5 w-full justify-between md:gap-3.5 lg:w-auto lg:justify-normal"
    >
      <div class="flex gap-1 md:gap-1.5">
        <button
          class="px-2.5 py-2.5 border border-[#4b6148] min-h-11 text-sm rounded-md text-foreground bg-[#223b2a] xs:px-3 md:px-4 md:py-2.5 aria-pressed:border-lime aria-pressed:bg-lime aria-pressed:text-canvas aria-pressed:font-semibold"
          v-for="amount in [10, 100, 200]"
          :key="amount"
          :aria-pressed="!stakeError && stake === amount"
          @click="enteredStake = String(amount)"
        >
          {{ amount }}€
        </button>
      </div>
      <label
        class="focus-within:outline-2 focus-within:outline-solid focus-within:outline-mint focus-within:-outline-offset-2 p-2.5 border border-[#668657] flex items-center w-[99px] rounded-md bg-[#122219] gap-1 xs:w-27.5 md:px-3 md:py-2 md:w-45 lg:w-[135px]"
        ><span class="sr-only text-mint">Importo per superquota</span
        ><input
          class="focus-visible:outline-none border-0 w-full min-w-0 text-lg leading-tight bg-transparent text-foreground tabular-nums md:text-xl"
          v-model="enteredStake"
          type="text"
          inputmode="decimal"
          aria-label="Importo per superquota"
          :aria-invalid="!!stakeError"
          :aria-describedby="stakeError ? 'stake-error' : undefined"
        /><span class="text-mint">€</span></label
      >
    </div>
  </section>
  <DataState
    v-if="error || !data"
    :error="!!error"
    :loading="status === 'pending'"
    @retry="refresh()"
  />
  <div
    v-else
    :class="{ 'pointer-events-none opacity-55': status === 'pending' || !!stakeError }"
    :aria-busy="status === 'pending'"
  >
    <p v-if="stakeError" id="stake-error" role="alert" class="text-xs text-lime mb-4">
      I risultati mantengono l’ultimo importo valido: {{ money(stake) }}.
    </p>
    <MetricCards :stats="stats" :stake="stake" />
    <div
      class="px-4.5 py-5 border border-panel-border bg-surface rounded-lg grid grid-cols-2 gap-5 mb-6 md:px-6 md:py-5.5 md:grid-cols-4"
    >
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-panel-divider max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-panel-divider md:[&+div]:pl-5.5"
      >
        <span class="text-xs text-stat-label">Totale puntato</span
        ><strong class="wrap-anywhere text-xl font-medium tracking-tight tabular-nums md:text-xl">{{
          money(stats.staked)
        }}</strong
        ><small class="text-xs text-stat-note leading-relaxed md:text-xs"
          >{{ stats.settled }} scommesse vinte o perse</small
        >
      </div>
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-panel-divider max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-panel-divider md:[&+div]:pl-5.5"
      >
        <span class="text-xs text-stat-label">Incassi lordi</span
        ><strong class="wrap-anywhere text-xl font-medium tracking-tight tabular-nums md:text-xl">{{
          money(stats.returns)
        }}</strong
        ><small class="text-xs text-stat-note leading-relaxed md:text-xs"
          >Comprendono le puntate vincenti</small
        >
      </div>
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-panel-divider max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-panel-divider md:[&+div]:pl-5.5"
      >
        <span class="text-xs text-stat-label">Quota media</span
        ><strong class="wrap-anywhere text-xl font-medium tracking-tight tabular-nums md:text-xl">{{
          quota(stats.averageOdds)
        }}</strong
        ><small class="text-xs text-stat-note leading-relaxed md:text-xs"
          >Sulle scommesse vinte o perse</small
        >
      </div>
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-panel-divider max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-panel-divider md:[&+div]:pl-5.5"
      >
        <span class="text-xs text-stat-label">Puntate rimborsate</span
        ><strong class="wrap-anywhere text-xl font-medium tracking-tight tabular-nums md:text-xl">{{
          money(stats.refunded)
        }}</strong
        ><small class="text-xs text-stat-note leading-relaxed md:text-xs"
          >{{ stats.voids }} scommesse · escluse dal ROI</small
        >
      </div>
    </div>
    <div
      class="hidden grid-cols-1 gap-4.5 items-stretch mb-7.5 md:grid md:grid-cols-[minmax(0,_1.9fr)_minmax(250px,_1fr)] md:gap-3.5 md:mb-8.5 lg:grid-cols-[minmax(0,_1.8fr)_minmax(240px,_1fr)] xl:grid-cols-[minmax(0,_2.25fr)_minmax(260px,_1fr)] xl:gap-5"
    >
      <PerformancePanel :stats="stats" :comparison="comparison" :stake="stake" />
      <MonthlyResults :stats="stats" />
    </div>
    <details class="group px-4.5 py-0 border border-panel-border bg-surface rounded-lg md:px-5.5">
      <summary
        class="px-0 py-5 cursor-pointer flex gap-2.5 items-center text-mint text-xs list-none md:text-sm [&::-webkit-details-marker]:hidden"
      >
        <AppIcon class="last:ml-auto group-open:last:rotate-90" name="help" :size="18" />Come
        vengono calcolati i risultati
        <AppIcon class="last:ml-auto group-open:last:rotate-90" name="right" :size="17" />
      </summary>
      <div class="px-0 pt-0 pb-6 text-xs leading-loose text-muted md:text-sm">
        <p>
          Una vincita restituisce la puntata moltiplicata per la quota. L’utile è l’incasso meno la
          puntata. Una perdita vale −{{ money(stake) }}, un rimborso ha utile zero. Ogni incasso
          viene arrotondato ai centesimi prima della somma.
        </p>
        <p class="mt-3">
          ROI = utile netto / totale puntato. Percentuale di vittorie = vinte / (vinte + perse). Le
          scommesse in attesa e rimborsate non entrano in questi due indicatori. Nel confronto
          utilizziamo soltanto gli eventi con entrambe le quote.
        </p>
        <p class="mt-3">
          La simulazione descrive il passato e non è una previsione dei risultati futuri.
        </p>
      </div>
    </details>
  </div>
</template>
