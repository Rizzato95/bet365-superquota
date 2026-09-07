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
  <div class="border border-panel-border bg-surface rounded-lg overflow-x-auto hidden md:inline">
    <table class="border-collapse w-full text-left text-xs">
      <thead>
        <tr>
          <th
            class="px-3 py-3.5 bg-table-header text-table-heading text-xs uppercase tracking-tight font-medium lg:p-4"
          >
            Data
          </th>
          <th
            class="px-3 py-3.5 bg-table-header text-table-heading text-xs uppercase tracking-tight font-medium lg:p-4"
          >
            Evento e mercato
          </th>
          <th
            class="px-3 py-3.5 bg-table-header text-table-heading text-xs uppercase tracking-tight font-medium lg:p-4"
          >
            Sport
          </th>
          <th
            class="px-3 py-3.5 bg-table-header text-table-heading text-xs uppercase tracking-tight font-medium text-right lg:p-4"
          >
            Quota
          </th>
          <th
            class="px-3 py-3.5 bg-table-header text-table-heading text-xs uppercase tracking-tight font-medium lg:p-4"
          >
            Esito
          </th>
          <th
            v-if="!admin"
            class="px-3 py-3.5 bg-table-header text-table-heading text-xs uppercase tracking-tight font-medium text-right lg:p-4"
          >
            Utile su 100€
          </th>
          <th
            v-else
            class="px-3 py-3.5 bg-table-header text-table-heading text-xs uppercase tracking-tight font-medium text-right lg:p-4"
          >
            Azioni
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="group" v-for="offer in offers" :key="offer.id">
          <td
            class="px-3 py-3.5 border-t border-t-table-border whitespace-nowrap text-secondary text-xs lg:px-4 lg:py-4.5 group-hover:bg-table-hover"
          >
            {{ dateLabel(offer.date, true) }}
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-table-border w-[40%] min-w-52.5 lg:px-4 lg:py-4.5 group-hover:bg-table-hover"
          >
            <strong class="text-sm text-foreground font-medium">{{ offer.event }}</strong>
            <p class="text-xs text-mint leading-relaxed mt-1 whitespace-pre-line wrap-anywhere">
              {{ offer.market }}
            </p>
          </td>
          <td
            class="px-3 py-3.5 text-muted border-t border-t-table-border lg:px-4 lg:py-4.5 group-hover:bg-table-hover"
          >
            {{ offer.sport }}
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-table-border text-right lg:px-4 lg:py-4.5 group-hover:bg-table-hover"
          >
            <div class="flex justify-end items-center gap-2">
              <del class="text-xs text-mint" v-if="offer.original_odds">{{
                quota(offer.original_odds)
              }}</del
              ><strong class="text-base text-lime font-semibold">{{
                quota(offer.boosted_odds)
              }}</strong>
            </div>
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-table-border lg:px-4 lg:py-4.5 group-hover:bg-table-hover"
          >
            <StatusBadge :outcome="offer.outcome" />
          </td>
          <td
            class="px-3 py-3.5 tabular-nums border-t border-t-table-border text-right lg:px-4 lg:py-4.5 group-hover:bg-table-hover"
            v-if="!admin"
            :class="[offer.outcome === 'lost' ? 'text-negative' : 'text-mint']"
          >
            {{ offer.outcome === 'pending' ? '—' : money(settle(offer, 100).profit / 100, true) }}
          </td>
          <td
            class="px-3 py-3.5 border-t border-t-table-border lg:px-4 lg:py-4.5 group-hover:bg-table-hover"
            v-else
          >
            <div class="flex gap-1.5 justify-end">
              <template v-if="!removed"
                ><button
                  class="border border-icon-border inline-grid place-items-center h-9.5 w-9.5 rounded-md bg-icon-surface text-foreground"
                  :aria-label="`Modifica ${offer.event}`"
                  @click="$emit('edit', offer)"
                >
                  <AppIcon name="edit" :size="17" /></button
                ><button
                  class="border border-icon-border inline-grid place-items-center h-9.5 w-9.5 rounded-md bg-icon-surface text-negative"
                  :aria-label="`Rimuovi ${offer.event}`"
                  @click="$emit('remove', offer)"
                >
                  <AppIcon name="trash" :size="17" /></button></template
              ><button
                v-else
                class="px-3 py-2 border border-action-border inline-flex items-center justify-center gap-2 min-h-9.5 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-action-text hover:bg-action-hover"
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
  <div class="grid gap-3.5 md:hidden md:gap-0">
    <div v-for="offer in offers" :key="offer.id">
      <OfferCard :offer="offer" />
      <div
        v-if="admin"
        class="px-3.5 py-3 border border-[#40553f] flex justify-between gap-3 bg-[#223329] rounded-lg -mt-1 md:inline md:justify-normal md:gap-0 md:pl-0 md:border-l-0"
      >
        <template v-if="!removed"
          ><button
            class="px-3 py-2 border border-action-border inline-flex items-center justify-center gap-2 min-h-9.5 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-action-text hover:bg-action-hover"
            @click="$emit('edit', offer)"
          >
            <AppIcon name="edit" :size="15" />Modifica</button
          ><button
            class="px-3 py-2 border border-action-border inline-flex items-center justify-center gap-2 min-h-9.5 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-negative hover:bg-action-hover"
            @click="$emit('remove', offer)"
          >
            Rimuovi
          </button></template
        ><button
          v-else
          class="px-3 py-2 border border-action-border inline-flex items-center justify-center gap-2 min-h-9.5 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-action-text hover:bg-action-hover"
          @click="$emit('restore', offer)"
        >
          <AppIcon name="restore" :size="15" />Ripristina
        </button>
      </div>
    </div>
  </div>
</template>
