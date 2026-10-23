<script setup lang="ts">
import type { Offer } from '#shared/types/offer'

defineProps<{ offer: Offer; removed?: boolean }>()
const { data: session } = useNuxtData<{ admin: boolean }>('admin-session')
const editing = ref(false)
const deleting = ref(false)
const {
  busy,
  error: operationError,
  remove,
  restore,
} = useOfferMutations({
  onSuccess: () => {
    deleting.value = false
  },
  onUnauthorized: handleExpiredSession,
})
watch(
  () => session.value?.admin,
  (admin) => {
    if (admin) return
    editing.value = false
    deleting.value = false
  },
)
function confirmRemoval() {
  operationError.value = ''
  deleting.value = true
}
async function handleExpiredSession() {
  editing.value = false
  deleting.value = false
  operationError.value = 'Sessione scaduta. Accedi nuovamente dalla pagina Gestione.'
  await refreshNuxtData('admin-session')
}
</script>

<template>
  <div
    v-if="session?.admin"
    class="flex flex-wrap justify-end gap-2 border-t border-panel-divider py-3"
  >
    <template v-if="!removed">
      <button
        type="button"
        class="px-3 py-2 border border-action-border inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-action-text hover:bg-action-hover"
        :aria-label="`Modifica ${offer.event}`"
        @click="editing = true"
      >
        <AppIcon name="edit" :size="15" />Modifica
      </button>
      <button
        type="button"
        class="px-3 py-2 border border-action-border inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-negative hover:bg-action-hover"
        :aria-label="`Elimina ${offer.event}`"
        @click="confirmRemoval"
      >
        <AppIcon name="trash" :size="15" />Elimina
      </button>
    </template>
    <button
      v-else
      type="button"
      class="px-3 py-2 border border-action-border inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-action-text hover:bg-action-hover disabled:opacity-55"
      :aria-label="`Ripristina ${offer.event}`"
      :disabled="busy"
      @click="restore(offer)"
    >
      <AppIcon name="restore" :size="15" />{{ busy ? 'Ripristino…' : 'Ripristina' }}
    </button>
  </div>
  <p v-if="operationError && !deleting" role="alert" class="text-sm text-negative pb-3">
    {{ operationError }}
  </p>
  <OfferEditor
    v-if="editing && session?.admin"
    :offer="offer"
    @saved="editing = false"
    @cancel="editing = false"
    @session-expired="handleExpiredSession"
  />
  <ConfirmRemoval
    v-if="deleting && session?.admin"
    :offer="offer"
    :busy="busy"
    :error="operationError"
    @cancel="deleting = false"
    @confirm="remove(offer)"
  />
</template>
