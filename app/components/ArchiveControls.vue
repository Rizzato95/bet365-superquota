<script setup lang="ts">
import { outcomes } from '#shared/types/offer'
import { outcomeLabels } from '#shared/utils/format'
const search = defineModel<string>('search', { required: true })
const outcome = defineModel<string>('outcome', { required: true })
defineProps<{ total?: number }>()
const outcomeOptions = [
  { value: '', label: 'Tutti gli esiti' },
  ...outcomes.map((value) => ({ value, label: outcomeLabels[value] })),
]
</script>
<template>
  <div
    id="archive-controls"
    class="mx-0 scroll-mt-24 flex items-center gap-2.5 mt-2 mb-4.5 flex-wrap md:gap-3 md:mb-5.5 md:flex-nowrap"
  >
    <label
      class="px-3.5 py-0 border border-[#38473b] flex items-center gap-2.5 bg-[#1c271f] rounded-lg max-w-none w-full text-mint md:max-w-112.5 focus-within:outline-2 focus-within:outline-solid focus-within:outline-mint focus-within:-outline-offset-2"
      ><AppIcon name="search" :size="18" /><input
        class="px-0 py-3 border-0 bg-transparent outline-none text-foreground w-full text-sm md:text-sm focus-visible:outline-none placeholder:text-mint"
        v-model="search"
        maxlength="120"
        type="search"
        placeholder="Cerca evento o mercato…"
        aria-label="Cerca evento o mercato" /></label
    ><label class="flex-1 md:flex-initial"
      ><span class="sr-only">Esito</span
      ><AppSelect
        v-model="outcome"
        :options="outcomeOptions"
      /></label
    ><span class="ml-auto whitespace-nowrap text-mint text-xs md:text-xs"
      >{{ total ?? 0 }} scommesse</span
    >
  </div>
</template>
