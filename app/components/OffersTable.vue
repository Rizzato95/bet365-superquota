<script setup lang="ts">
import type { Offer } from '#shared/types/offer'
import { dateLabel, quota, money } from '#shared/utils/format'
import { settle } from '#shared/utils/analytics'
withDefaults(defineProps<{ offers: Offer[]; admin?: boolean; removed?: boolean }>(), {
  admin: false,
  removed: false,
})
defineEmits<{ edit: [offer: Offer]; remove: [offer: Offer]; restore: [offer: Offer] }>()
</script>
<template>
  <div class="border border-[#2e3b31] bg-surface rounded-[10px] overflow-x-auto hidden md:inline">
    <table class="border-collapse w-full text-left text-xs">
      <thead>
        <tr>
          <th
            class="px-3 py-3.5 bg-[#212e25] text-[#849e8c] text-[10px] uppercase tracking-[0.8px] font-[550] lg:p-[17px]"
          >
            Data
          </th>
          <th
            class="px-3 py-3.5 bg-[#212e25] text-[#849e8c] text-[10px] uppercase tracking-[0.8px] font-[550] lg:p-[17px]"
          >
            Evento e mercato
          </th>
          <th
            class="px-3 py-3.5 bg-[#212e25] text-[#849e8c] text-[10px] uppercase tracking-[0.8px] font-[550] lg:p-[17px]"
          >
            Sport
          </th>
          <th
            class="px-3 py-3.5 bg-[#212e25] text-[#849e8c] text-[10px] uppercase tracking-[0.8px] font-[550] text-right lg:p-[17px]"
          >
            Quota
          </th>
          <th
            class="px-3 py-3.5 bg-[#212e25] text-[#849e8c] text-[10px] uppercase tracking-[0.8px] font-[550] lg:p-[17px]"
          >
            Esito
          </th>
          <th
            v-if="!admin"
            class="px-3 py-3.5 bg-[#212e25] text-[#849e8c] text-[10px] uppercase tracking-[0.8px] font-[550] text-right lg:p-[17px]"
          >
            Utile su 100€
          </th>
          <th
            v-else
            class="px-3 py-3.5 bg-[#212e25] text-[#849e8c] text-[10px] uppercase tracking-[0.8px] font-[550] text-right lg:p-[17px]"
          >
            Azioni
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="group" v-for="offer in offers" :key="offer.id">
          <td
            class="px-3 py-3.5 border-t border-t-[#2b3b2f] whitespace-nowrap text-[#adbdaf] text-[11px] lg:px-[17px] lg:py-4.5 group-hover:bg-[#21302766]"
          >
            {{ dateLabel(offer.date, true) }}
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-[#2b3b2f] w-[40%] min-w-52.5 lg:px-[17px] lg:py-4.5 group-hover:bg-[#21302766]"
          >
            <strong class="text-[13px] text-[#dbe5de] font-[550]">{{ offer.event }}</strong>
            <p
              class="text-[11px] text-[#91a898] leading-[1.55] mt-[5px] whitespace-pre-line wrap-anywhere"
            >
              {{ offer.market }}
            </p>
          </td>
          <td
            class="px-3 py-3.5 text-muted border-t border-t-[#2b3b2f] lg:px-[17px] lg:py-4.5 group-hover:bg-[#21302766]"
          >
            {{ offer.sport }}
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-[#2b3b2f] text-right lg:px-[17px] lg:py-4.5 group-hover:bg-[#21302766]"
          >
            <div class="flex justify-end items-center gap-2">
              <del class="text-[11px] text-[#779080]" v-if="offer.original_odds">{{
                quota(offer.original_odds)
              }}</del
              ><strong class="text-[17px] text-lime font-semibold">{{
                quota(offer.boosted_odds)
              }}</strong>
            </div>
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-[#2b3b2f] lg:px-[17px] lg:py-4.5 group-hover:bg-[#21302766]"
          >
            <StatusBadge :outcome="offer.outcome" />
          </td>
          <td
            class="px-3 py-3.5 tabular-nums border-t border-t-[#2b3b2f] text-right lg:px-[17px] lg:py-4.5 group-hover:bg-[#21302766]"
            v-if="!admin"
            :class="[offer.outcome === 'lost' ? 'text-negative' : 'text-mint']"
          >
            {{ offer.outcome === 'pending' ? '—' : money(settle(offer, 100).profit / 100, true) }}
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-[#2b3b2f] lg:px-[17px] lg:py-4.5 group-hover:bg-[#21302766]"
            v-else
          >
            <div class="flex gap-[7px] justify-end">
              <template v-if="!removed"
                ><button
                  class="border border-[#3c4c3d] inline-grid place-items-center h-9.5 w-9.5 rounded-md bg-[#233128] text-[#c6d7cb]"
                  :aria-label="`Modifica ${offer.event}`"
                  @click="$emit('edit', offer)"
                >
                  <AppIcon name="edit" :size="17" /></button
                ><button
                  class="border border-[#3c4c3d] inline-grid place-items-center h-9.5 w-9.5 rounded-md bg-[#233128] text-[#f09b98]"
                  :aria-label="`Rimuovi ${offer.event}`"
                  @click="$emit('remove', offer)"
                >
                  <AppIcon name="trash" :size="17" /></button></template
              ><button
                v-else
                class="px-3 py-2 border border-[#3a4c3e] inline-flex items-center justify-center gap-[9px] min-h-9.5 rounded-[7px] text-xs font-[550] transition-colors duration-150 bg-[#24332a] text-[#c4d3c9] hover:bg-[#304334]"
                @click="$emit('restore', offer)"
              >
                <AppIcon name="restore" :size="15" />Ripristina
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="grid gap-3.5 md:hidden md:gap-[normal]">
    <div v-for="offer in offers" :key="offer.id">
      <OfferCard :offer="offer" />
      <div
        v-if="admin"
        class="px-3.5 py-3 border border-[#40553f] flex justify-between gap-3 bg-[#223329] rounded-[0_0_9px_9px] mt-[-4px] md:inline md:justify-normal md:gap-[normal] md:pl-0 md:border-l-[0px]"
      >
        <template v-if="!removed"
          ><button
            class="px-3 py-2 border border-[#3a4c3e] inline-flex items-center justify-center gap-[9px] min-h-9.5 rounded-[7px] text-xs font-[550] transition-colors duration-150 bg-[#24332a] text-[#c4d3c9] hover:bg-[#304334]"
            @click="$emit('edit', offer)"
          >
            <AppIcon name="edit" :size="15" />Modifica</button
          ><button
            class="px-3 py-2 border border-[#3a4c3e] inline-flex items-center justify-center gap-[9px] min-h-9.5 rounded-[7px] text-xs font-[550] transition-colors duration-150 bg-[#24332a] text-[#f09b98] hover:bg-[#304334]"
            @click="$emit('remove', offer)"
          >
            Rimuovi
          </button></template
        ><button
          v-else
          class="px-3 py-2 border border-[#3a4c3e] inline-flex items-center justify-center gap-[9px] min-h-9.5 rounded-[7px] text-xs font-[550] transition-colors duration-150 bg-[#24332a] text-[#c4d3c9] hover:bg-[#304334]"
          @click="$emit('restore', offer)"
        >
          <AppIcon name="restore" :size="15" />Ripristina
        </button>
      </div>
    </div>
  </div>
</template>
