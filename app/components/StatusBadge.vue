<script setup lang="ts">
import type { Outcome } from '#shared/types/offer'
import { outcomeLabels } from '#shared/utils/format'
defineProps<{ outcome: Outcome }>()
const colors: Record<Outcome, string> = {
  won: 'text-green-500 bg-[#274c36]',
  lost: 'text-negative bg-[#493130]',
  pending: 'text-lime bg-[#49452c]',
  void: 'text-foreground bg-[#293d48]',
}
const icons = { won: 'check', lost: 'close', pending: 'pending', void: 'restore' }
</script>
<template>
  <span
    class="px-1.5 py-1 inline-flex items-center gap-1 rounded text-xs font-medium whitespace-nowrap md:px-1.5 md:py-1 md:text-xs"
    :class="colors[outcome]">
    <AppIcon :name="icons[outcome]" :size="12" />{{ outcomeLabels[outcome] }}
  </span>
</template>
