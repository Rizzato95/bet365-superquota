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
    class="flex gap-1.5 flex-wrap justify-between items-center border-b border-b-line pb-4 mb-4.5 md:gap-2.5 md:pb-5.5 md:mb-6"
  >
    <div class="flex items-center gap-1.5 flex-wrap md:gap-2">
      <AppIcon name="calendar" :size="17" class="text-muted mr-1.5 hidden md:block" />
      <label class="sr-only" for="period-mode">Tipo di periodo</label
      ><select
        id="period-mode"
        v-model="mode"
        class="py-2 border border-control-border text-control-text bg-control min-h-10 rounded-md pl-2 text-xs max-w-full select-control xs:text-xs md:pl-2.5 md:text-sm"
      >
        <option class="text-foreground bg-control" value="year">Anno completo</option>
        <option class="text-foreground bg-control" value="month">Mese</option>
        <option class="text-foreground bg-control" value="custom">Personalizzato</option>
      </select>
      <template v-if="mode !== 'custom'"
        ><label class="sr-only" for="period-year">Anno</label
        ><select
          id="period-year"
          v-model.number="year"
          class="py-2 border border-control-border text-lime bg-control min-h-10 rounded-md pl-2 text-xs max-w-full select-control min-w-17 xs:text-xs md:pl-2.5 md:text-sm md:min-w-[85px]"
        >
          <option class="text-foreground bg-control" v-for="y in years" :key="y" :value="y">
            {{ y }}
          </option>
        </select></template
      >
      <template v-if="mode === 'month'"
        ><label class="sr-only" for="period-month">Mese</label
        ><select
          id="period-month"
          v-model.number="month"
          class="py-2 border border-control-border text-control-text bg-control min-h-10 rounded-md pl-2 text-xs max-w-full select-control xs:text-xs md:pl-2.5 md:text-sm"
        >
          <option
            class="text-foreground bg-control"
            v-for="m in months"
            :key="m.value"
            :value="m.value"
          >
            {{ m.label }}
          </option>
        </select></template
      >
      <template v-if="mode === 'custom'"
        ><label class="flex items-center gap-2 text-xs text-muted md:text-xs"
          >Dal<input
            class="p-2 border border-control-border min-w-0 text-xs rounded-md bg-control min-h-10 md:text-sm"
            v-model="from"
            aria-label="Data iniziale"
            type="date" /></label
        ><label class="flex items-center gap-2 text-xs text-muted md:text-xs"
          >Al<input
            class="p-2 border border-control-border min-w-0 text-xs rounded-md bg-control min-h-10 md:text-sm"
            v-model="to"
            aria-label="Data finale"
            type="date" /></label
      ></template>
    </div>
    <label class="flex items-center gap-0 text-mint md:gap-2"
      ><AppIcon class="hidden md:block" name="filter" :size="15" /><span class="sr-only">Sport</span
      ><select
        v-model="sport"
        class="py-2 border border-control-border text-control-text bg-control min-h-10 rounded-md pl-0 text-xs max-w-full select-control xs:pl-1 xs:text-xs md:pl-2.5 md:text-sm"
      >
        <option class="text-foreground bg-control" value="">Tutti gli sport</option>
        <option class="text-foreground bg-control" v-for="s in sports" :key="s">{{ s }}</option>
      </select></label
    >
    <p v-if="!valid" class="w-full text-error text-xs leading-relaxed" role="alert">
      Inserisci un intervallo di date valido.
    </p>
  </div>
</template>
