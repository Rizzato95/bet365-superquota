<script setup lang="ts">
import { stakeSchema } from '#shared/utils/validation'
import { money, quota } from '#shared/utils/format'
useHead({ title: 'Simulator' })
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
const { data, status, error, refresh, stats, comparison } = await useStatistics(stake)
</script>
<template>
  <div class="flex items-center justify-between mb-[23px] gap-2.5 md:mb-6.5 md:gap-5">
    <h1 class="text-[29px] font-[660] tracking-[-1.25px] leading-[1.25] md:text-[34px]">
      Simulator
    </h1>
  </div>
  <PeriodFilters />
  <section
    class="px-4.5 py-5 border border-[#2e3b31] bg-transparent rounded-[10px] flex items-center gap-[21px] flex-wrap mb-5.5 bg-[linear-gradient(115deg,_#243e2d,_#1a281f)] md:p-6 md:gap-6"
  >
    <div class="flex gap-3 items-center flex-1 min-w-full md:gap-4 lg:min-w-55">
      <span
        class="border border-[#4c6c43] bg-[#314f36] text-lime h-[43px] w-[43px] rounded-[10px] grid place-items-center shrink-0 md:h-13.5 md:w-13.5 md:rounded-xl"
      >
        <AppIcon name="simulator" :size="26" />
      </span>
      <div>
        <h2 class="text-base tracking-[-0.4px] font-[550] md:text-lg">
          Quanto avresti ottenuto con una puntata fissa?
        </h2>
        <p
          class="text-[11px] text-[#9ab09e] mt-1.5 leading-[1.6] max-w-[235px] md:text-xs md:max-w-none"
        >
          L’importo viene applicato a tutte le scommesse del periodo.
        </p>
      </div>
    </div>
    <div
      class="flex items-center gap-2.5 w-full justify-between md:gap-3.5 lg:w-auto lg:justify-normal"
    >
      <div class="flex gap-[5px] md:gap-1.5">
        <button
          class="px-[11px] py-2.5 border border-[#4b6148] min-h-11 text-sm rounded-md text-[#b4c9b9] bg-[#223b2a] xs:px-[13px] md:px-4 md:py-[11px] aria-pressed:border-lime aria-pressed:bg-lime aria-pressed:text-[#233523] aria-pressed:font-[650]"
          v-for="amount in [10, 100, 200]"
          :key="amount"
          :aria-pressed="!stakeError && stake === amount"
          @click="enteredStake = String(amount)"
        >
          {{ amount }}€
        </button>
      </div>
      <label
        class="focus-within:outline-2 focus-within:outline-solid focus-within:outline-mint focus-within:-outline-offset-2 p-2.5 border border-[#668657] flex items-center w-[99px] rounded-md bg-[#122219] gap-[5px] xs:w-27.5 md:px-3 md:py-2 md:w-45 lg:w-[135px]"
        ><span class="sr-only text-[#9ab092]">Importo per superquota</span
        ><input
          class="focus-visible:outline-none border-0 w-full min-w-0 text-lg leading-[1.3] bg-transparent text-[#eff4df] tabular-nums md:text-xl"
          v-model="enteredStake"
          type="text"
          inputmode="decimal"
          aria-label="Importo per superquota"
          :aria-invalid="!!stakeError"
          :aria-describedby="stakeError ? 'stake-error' : undefined"
        /><span class="text-[#9ab092]">€</span></label
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
    <p v-if="stakeError" id="stake-error" role="alert" class="text-xs text-[#e7cf85] mb-4">
      I risultati mantengono l’ultimo importo valido: {{ money(stake) }}.
    </p>
    <MetricCards :stats="stats" :stake="stake" />
    <div
      class="px-4.5 py-5 border border-[#2e3b31] bg-surface rounded-[10px] grid grid-cols-2 gap-5 mb-6 md:px-6 md:py-5.5 md:grid-cols-4"
    >
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-[#354731] max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-[#354731] md:[&+div]:pl-5.5"
      >
        <span class="text-[11px] text-[#98ae9c]">Totale puntato</span
        ><strong
          class="wrap-anywhere text-[21px] font-[550] tracking-[-0.5px] tabular-nums md:text-[22px]"
          >{{ money(stats.staked) }}</strong
        ><small class="text-[9px] text-[#7d9484] leading-[1.5] md:text-[10px]"
          >{{ stats.settled }} scommesse vinte o perse</small
        >
      </div>
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-[#354731] max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-[#354731] md:[&+div]:pl-5.5"
      >
        <span class="text-[11px] text-[#98ae9c]">Incassi lordi</span
        ><strong
          class="wrap-anywhere text-[21px] font-[550] tracking-[-0.5px] tabular-nums md:text-[22px]"
          >{{ money(stats.returns) }}</strong
        ><small class="text-[9px] text-[#7d9484] leading-[1.5] md:text-[10px]"
          >Comprendono le puntate vincenti</small
        >
      </div>
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-[#354731] max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-[#354731] md:[&+div]:pl-5.5"
      >
        <span class="text-[11px] text-[#98ae9c]">Quota media</span
        ><strong
          class="wrap-anywhere text-[21px] font-[550] tracking-[-0.5px] tabular-nums md:text-[22px]"
          >{{ quota(stats.averageOdds) }}</strong
        ><small class="text-[9px] text-[#7d9484] leading-[1.5] md:text-[10px]"
          >Sulle scommesse vinte o perse</small
        >
      </div>
      <div
        class="flex flex-col gap-2 max-md:even:border-l max-md:even:border-[#354731] max-md:even:pl-4 md:[&+div]:border-l md:[&+div]:border-[#354731] md:[&+div]:pl-5.5"
      >
        <span class="text-[11px] text-[#98ae9c]">Puntate rimborsate</span
        ><strong
          class="wrap-anywhere text-[21px] font-[550] tracking-[-0.5px] tabular-nums md:text-[22px]"
          >{{ money(stats.refunded) }}</strong
        ><small class="text-[9px] text-[#7d9484] leading-[1.5] md:text-[10px]"
          >{{ stats.voids }} scommesse · escluse dal ROI</small
        >
      </div>
    </div>
    <div
      class="grid grid-cols-1 gap-4.5 items-stretch mb-7.5 md:grid-cols-[minmax(0,_1.9fr)_minmax(250px,_1fr)] md:gap-[15px] md:mb-8.5 lg:grid-cols-[minmax(0,_1.8fr)_minmax(240px,_1fr)] xl:grid-cols-[minmax(0,_2.25fr)_minmax(260px,_1fr)] xl:gap-5"
    >
      <PerformancePanel :stats="stats" :comparison="comparison" :stake="stake" />
      <MonthlyResults :stats="stats" />
    </div>
    <details class="group px-4.5 py-0 border border-[#2e3b31] bg-surface rounded-[10px] md:px-5.5">
      <summary
        class="px-0 py-5 cursor-pointer flex gap-2.5 items-center text-[#abc3b3] text-xs list-none md:text-[13px] [&::-webkit-details-marker]:hidden"
      >
        <AppIcon class="last:ml-auto group-open:last:rotate-90" name="help" :size="18" />Come
        vengono calcolati i risultati
        <AppIcon class="last:ml-auto group-open:last:rotate-90" name="right" :size="17" />
      </summary>
      <div class="px-0 pt-0 pb-[23px] text-xs leading-[1.8] text-[#a0b3a7] md:text-[13px]">
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
