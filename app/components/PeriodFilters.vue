<script setup lang="ts">
import { sports } from '#shared/types/offer'
const { year, currentYear, mode, month, from, to, sport, valid } = usePeriod()
const years = Array.from({ length: Math.max(1, currentYear - 2026 + 1) }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Intl.DateTimeFormat('it', { month: 'long' }).format(new Date(2026, i, 1)),
}))
</script>
<template>
  <div
    class="flex gap-1.5 flex-wrap justify-between items-center border-b border-b-line pb-[17px] mb-4.5 md:gap-2.5 md:pb-5.5 md:mb-6"
  >
    <div class="flex items-center gap-1.5 flex-wrap md:gap-2">
      <AppIcon name="calendar" :size="17" class="text-muted mr-1.5 hidden md:block" />
      <label class="sr-only" for="period-mode">Tipo di periodo</label
      ><select
        id="period-mode"
        v-model="mode"
        class="py-2 border border-[#354238] text-[#d4ddd7] bg-[#1b251e] min-h-10 rounded-md pr-[25px] pl-[9px] text-[11px] max-w-full appearance-none bg-[url('/icons/chevron-down.svg')] bg-position-[right_7px_center] bg-no-repeat xs:text-xs md:pr-7.5 md:pl-[11px] md:text-[13px] md:bg-position-[right_9px_center]"
      >
        <option class="text-foreground bg-[#1b251e]" value="year">Anno completo</option>
        <option class="text-foreground bg-[#1b251e]" value="month">Mese</option>
        <option class="text-foreground bg-[#1b251e]" value="custom">Personalizzato</option>
      </select>
      <template v-if="mode !== 'custom'"
        ><label class="sr-only" for="period-year">Anno</label
        ><select
          id="period-year"
          v-model.number="year"
          class="py-2 border border-[#354238] text-lime bg-[#1b251e] min-h-10 rounded-md pr-[25px] pl-[9px] text-[11px] max-w-full appearance-none bg-[url('/icons/chevron-down.svg')] bg-position-[right_7px_center] bg-no-repeat min-w-17 xs:text-xs md:pr-7.5 md:pl-[11px] md:text-[13px] md:bg-position-[right_9px_center] md:min-w-[85px]"
        >
          <option class="text-foreground bg-[#1b251e]" v-for="y in years" :key="y" :value="y">
            {{ y }}
          </option>
        </select></template
      >
      <template v-if="mode === 'month'"
        ><label class="sr-only" for="period-month">Mese</label
        ><select
          id="period-month"
          v-model.number="month"
          class="py-2 border border-[#354238] text-[#d4ddd7] bg-[#1b251e] min-h-10 rounded-md pr-[25px] pl-[9px] text-[11px] max-w-full appearance-none bg-[url('/icons/chevron-down.svg')] bg-position-[right_7px_center] bg-no-repeat xs:text-xs md:pr-7.5 md:pl-[11px] md:text-[13px] md:bg-position-[right_9px_center]"
        >
          <option
            class="text-foreground bg-[#1b251e]"
            v-for="m in months"
            :key="m.value"
            :value="m.value"
          >
            {{ m.label }}
          </option>
        </select></template
      >
      <template v-if="mode === 'custom'"
        ><label class="flex items-center gap-2 text-[11px] text-muted md:text-xs"
          >Dal<input
            class="p-2 border border-[#354238] min-w-0 text-xs rounded-md bg-[#1b251e] min-h-10 md:text-[13px]"
            v-model="from"
            aria-label="Data iniziale"
            type="date" /></label
        ><label class="flex items-center gap-2 text-[11px] text-muted md:text-xs"
          >Al<input
            class="p-2 border border-[#354238] min-w-0 text-xs rounded-md bg-[#1b251e] min-h-10 md:text-[13px]"
            v-model="to"
            aria-label="Data finale"
            type="date" /></label
      ></template>
    </div>
    <label class="flex items-center gap-0 text-[#93a595] md:gap-[9px]"
      ><AppIcon class="hidden md:block" name="filter" :size="15" /><span class="sr-only">Sport</span
      ><select
        v-model="sport"
        class="py-2 border border-[#354238] text-[#d4ddd7] bg-[#1b251e] min-h-10 rounded-md pr-[21px] pl-0 text-[10px] max-w-full appearance-none bg-[url('/icons/chevron-down.svg')] bg-position-[right_7px_center] bg-no-repeat xs:pl-1 xs:text-[11px] md:pr-7.5 md:pl-[11px] md:text-[13px] md:bg-position-[right_9px_center]"
      >
        <option class="text-foreground bg-[#1b251e]" value="">Tutti gli sport</option>
        <option class="text-foreground bg-[#1b251e]" v-for="s in sports" :key="s">{{ s }}</option>
      </select></label
    >
    <p v-if="!valid" class="w-full text-[#f3a79c] text-xs leading-[1.6]" role="alert">
      Inserisci un intervallo di date valido.
    </p>
  </div>
</template>
