<script setup lang="ts">
import type { Outcome } from '#shared/types/offer'
import { outcomeLabels } from '#shared/utils/format'
defineProps<{ outcome: Outcome }>()
const colors: Record<Outcome, string> = {
  won: 'text-mint bg-outcome-won',
  lost: 'text-negative bg-outcome-lost',
  pending: 'text-lime bg-outcome-pending',
  void: 'text-foreground bg-outcome-void',
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
