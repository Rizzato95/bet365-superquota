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
    <OfferSearch v-model="search" /><label class="flex-1 md:flex-initial"
      ><span class="sr-only">Esito</span
      ><AppSelect v-model="outcome" :options="outcomeOptions" /></label
    ><span class="ml-auto whitespace-nowrap text-mint text-xs md:text-xs"
      >{{ total ?? 0 }} scommesse</span
    >
  </div>
</template>
