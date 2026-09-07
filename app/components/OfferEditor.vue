<script setup lang="ts">
import type { Offer, OfferInput } from '#shared/types/offer'
import { sports, outcomes } from '#shared/types/offer'
import { outcomeLabels } from '#shared/utils/format'
import { offerSchema } from '#shared/utils/validation'
const props = defineProps<{ offer: Offer | null }>()
const emit = defineEmits<{ saved: []; cancel: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const form = reactive({
  date:
    props.offer?.date ??
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date()),
  event: props.offer?.event ?? '',
  market: props.offer?.market ?? '',
  sport: props.offer?.sport ?? 'Calcio',
  original_odds: props.offer?.original_odds?.toString() ?? '',
  boosted_odds: props.offer?.boosted_odds.toString() ?? '',
  outcome: props.offer?.outcome ?? 'pending',
})
const errors = ref<Record<string, string>>({}),
  serverError = ref(''),
  saving = ref(false)
onMounted(() => dialog.value?.showModal())
onBeforeUnmount(() => dialog.value?.close())
async function save() {
  serverError.value = ''
  errors.value = {}
  const parsed = offerSchema.safeParse({
    ...form,
    original_odds: Number(form.original_odds.replace(',', '.')),
    boosted_odds: Number(form.boosted_odds.replace(',', '.')),
  })
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors.value[String(issue.path[0])] = issue.message
    return
  }
  saving.value = true
  try {
    await $fetch(props.offer ? `/api/admin/offers/${props.offer.id}` : '/api/admin/offers', {
      method: props.offer ? 'PATCH' : 'POST',
      body: parsed.data as OfferInput,
    })
    await refreshNuxtData()
    emit('saved')
  } catch (error: any) {
    serverError.value = error.data?.statusMessage || 'Salvataggio non riuscito. Riprova.'
  } finally {
    saving.value = false
  }
}
</script>
<template>
  <dialog
    ref="dialog"
    class="p-0 m-auto border border-[#4a6349] fixed top-0 right-0 bottom-0 left-0 rounded-lg bg-[#1a291f] text-foreground w-150 max-w-[calc(100%_-_20px)] max-h-[calc(100dvh_-_20px)] overflow-auto shadow-[0_30px_100px_#0008] md:max-w-[calc(100%_-_30px)] md:max-h-[calc(100dvh_-_40px)] backdrop:bg-[#06140cba] backdrop:backdrop-blur-[4px]"
    aria-labelledby="editor-title"
    @cancel.prevent="!saving && emit('cancel')"
  >
    <form @submit.prevent="save">
      <div
        class="px-4.5 py-5 flex justify-between items-center border-b border-b-[#3b503a] gap-3.5 md:px-6.5 md:py-6"
      >
        <div>
          <span
            class="text-xs tracking-tight text-mint font-semibold mb-2 md:text-xs md:tracking-tight"
            >GESTIONE EVENTI</span
          >
          <h2 class="text-xl tracking-tight font-medium md:text-xl" id="editor-title">
            {{ offer ? 'Modifica superquota' : 'Nuova superquota' }}
          </h2>
        </div>
        <button
          type="button"
          class="border border-icon-border inline-grid place-items-center h-9.5 w-9.5 rounded-md bg-icon-surface text-foreground"
          aria-label="Chiudi"
          :disabled="saving"
          @click="emit('cancel')"
        >
          <AppIcon name="close" />
        </button>
      </div>
      <div class="px-4.5 py-5 flex flex-col gap-4.5 md:px-6.5 md:py-6">
        <div class="grid grid-cols-2 gap-3 md:gap-4.5">
          <label class="flex flex-col gap-2 text-xs text-label md:text-sm"
            >Data<input
              class="p-3 border border-input-border min-w-0 text-base rounded-md bg-input min-h-11 w-full text-input-text md:text-sm"
              v-model="form.date"
              type="date"
              required
              :aria-invalid="!!errors.date"
            /><small v-if="errors.date" class="text-error text-xs leading-relaxed">{{
              errors.date
            }}</small></label
          ><label class="flex flex-col gap-2 text-xs text-label md:text-sm"
            >Sport<select
              class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 select-control md:text-sm"
              v-model="form.sport"
            >
              <option class="text-foreground bg-control" v-for="s in sports" :key="s">
                {{ s }}
              </option>
            </select></label
          >
        </div>
        <label class="flex flex-col gap-2 text-xs text-label md:text-sm"
          >Evento<input
            class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 md:text-sm"
            v-model="form.event"
            autofocus
            placeholder="Es. Juventus - Milan"
            maxlength="240"
            required
            :aria-invalid="!!errors.event"
          /><small v-if="errors.event" class="text-error text-xs leading-relaxed">{{
            errors.event
          }}</small></label
        ><label class="flex flex-col gap-2 text-xs text-label md:text-sm"
          >Mercato<textarea
            class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 resize-y leading-relaxed md:text-sm"
            v-model="form.market"
            rows="4"
            placeholder="Inserisci le condizioni della superquota, anche su più righe"
            maxlength="2000"
            required
            :aria-invalid="!!errors.market"
          /><small v-if="errors.market" class="text-error text-xs leading-relaxed">{{
            errors.market
          }}</small></label
        >
        <div class="grid grid-cols-2 gap-3 md:gap-4.5">
          <label class="flex flex-col gap-2 text-xs text-label md:text-sm"
            >Quota originale<input
              class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 md:text-sm"
              v-model="form.original_odds"
              inputmode="decimal"
              placeholder="2,00"
              required
              :aria-invalid="!!errors.original_odds"
            /><small v-if="errors.original_odds" class="text-error text-xs leading-relaxed">{{
              errors.original_odds
            }}</small></label
          ><label class="flex flex-col gap-2 text-xs text-label md:text-sm"
            >Quota maggiorata<input
              class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 md:text-sm"
              v-model="form.boosted_odds"
              inputmode="decimal"
              placeholder="3,00"
              required
              :aria-invalid="!!errors.boosted_odds"
            /><small v-if="errors.boosted_odds" class="text-error text-xs leading-relaxed">{{
              errors.boosted_odds
            }}</small></label
          >
        </div>
        <label class="flex flex-col gap-2 text-xs text-label md:text-sm"
          >Esito<select
            class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 select-control md:text-sm"
            v-model="form.outcome"
          >
            <option class="text-foreground bg-control" v-for="o in outcomes" :key="o" :value="o">
              {{ outcomeLabels[o] }}
            </option>
          </select></label
        >
        <p
          v-if="serverError"
          class="px-3.5 py-3 mx-0 my-3.5 border border-alert-border text-error text-xs leading-relaxed rounded-lg bg-alert"
          role="alert"
        >
          {{ serverError }}
        </p>
      </div>
      <div
        class="px-4.5 py-4 flex gap-2.5 justify-end border-t border-t-[#3c513e] bg-[#15231a] md:px-6.5 md:py-4.5"
      >
        <button
          type="button"
          class="px-4 py-2.5 border border-action-border inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-sm font-medium transition-colors duration-150 bg-action text-action-text hover:bg-action-hover"
          :disabled="saving"
          @click="emit('cancel')"
        >
          Annulla</button
        ><button
          type="submit"
          class="px-4 py-2.5 border border-transparent inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-sm font-medium transition-colors duration-150 bg-lime-action text-canvas hover:bg-lime-hover"
          :disabled="saving"
        >
          <AppIcon
            :name="saving ? 'loading' : 'check'"
            :size="17"
            :class="{ 'animate-spin': saving }"
          />{{ saving ? 'Salvataggio…' : 'Salva superquota' }}
        </button>
      </div>
    </form>
  </dialog>
</template>
