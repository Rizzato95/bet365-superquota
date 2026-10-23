<script setup lang="ts">
import type { Offer } from '#shared/types/offer'
import { money } from '#shared/utils/format'

const props = defineProps<{ offers: Offer[]; stake: number; loading?: boolean }>()
const dialog = ref<HTMLDialogElement | null>(null)
const titleId = useId()
const sortedOffers = computed(() =>
  [...props.offers].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
)
let previousOverflow: string | undefined
function open() {
  if (!dialog.value || dialog.value.open) return
  previousOverflow = document.documentElement.style.overflow
  dialog.value.showModal()
  document.documentElement.style.overflow = 'hidden'
}
function restoreScroll() {
  if (previousOverflow === undefined) return
  document.documentElement.style.overflow = previousOverflow
  previousOverflow = undefined
}
function closeOnBackdrop(event: MouseEvent) {
  if (event.target !== dialog.value || !dialog.value) return
  const rect = dialog.value.getBoundingClientRect()
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.value.close()
}
onBeforeUnmount(() => {
  dialog.value?.close()
  restoreScroll()
})
</script>

<template>
  <span role="status">
    <button
      type="button"
      class="inline-flex min-h-11 items-center gap-1.5 text-mint text-xs underline underline-offset-4 hover:text-foreground disabled:opacity-55 disabled:cursor-default"
      aria-haspopup="dialog"
      :disabled="loading || !offers.length"
      @click="open"
    >
      {{ offers.length }} scommesse
      <AppIcon name="right" :size="15" />
    </button>
  </span>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    class="m-auto w-full max-w-[min(70rem,calc(100%_-_32px))] max-h-[calc(100dvh_-_32px)] overflow-hidden rounded-lg border border-panel-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-[#06140cba] backdrop:backdrop-blur-[4px]"
    @close="restoreScroll"
    @click="closeOnBackdrop"
  >
    <div class="flex max-h-[calc(100dvh_-_34px)] flex-col">
      <header
        class="flex shrink-0 items-start justify-between gap-4 border-b border-panel-divider p-5 md:p-6"
      >
        <div>
          <h2 :id="titleId" class="text-xl font-semibold leading-tight">
            Scommesse della simulazione
          </h2>
          <p class="mt-2 text-sm text-mint leading-relaxed">
            {{ offers.length }} scommesse con i filtri attuali · Puntata di {{ money(stake) }}
          </p>
        </div>
        <button
          type="button"
          autofocus
          class="shrink-0 rounded-md border border-action-border bg-action px-3 py-2 min-h-11 text-sm text-action-text hover:bg-action-hover"
          @click="dialog?.close()"
        >
          Chiudi
        </button>
      </header>
      <div class="min-h-0 overflow-y-auto overscroll-contain p-5 md:p-6">
        <ul class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <li v-for="offer in sortedOffers" :key="offer.id" class="min-w-0 flex flex-col">
            <OfferCard :offer="offer" :stake="stake" class="h-full" />
          </li>
        </ul>
      </div>
    </div>
  </dialog>
</template>
