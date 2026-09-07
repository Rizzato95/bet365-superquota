<script setup lang="ts">
import type { Outcome } from '#shared/types/offer'
import { outcomeLabels } from '#shared/utils/format'
defineProps<{ outcome: Outcome }>()
const colors: Record<Outcome, string> = {
  won: 'text-[#7addac] bg-[#274c36]',
  lost: 'text-[#eaa1a0] bg-[#493130]',
  pending: 'text-[#e1d68d] bg-[#49452c]',
  void: 'text-[#a7bac9] bg-[#293d48]',
}
const icons = { won: 'check', lost: 'close', pending: 'pending', void: 'restore' }
</script>
<template>
  <span
    class="px-[7px] py-[5px] inline-flex items-center gap-1 rounded text-[11px] font-medium whitespace-nowrap md:px-1.5 md:py-1 md:text-[10px]"
    :class="colors[outcome]"
    ><AppIcon :name="icons[outcome]" :size="12" />{{ outcomeLabels[outcome] }}</span
  >
</template>
