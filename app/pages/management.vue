<script setup lang="ts">
import type { Offer, OfferPage } from '#shared/types/offer'
useHead({ title: 'Management', meta: [{ name: 'robots', content: 'noindex,nofollow' }] })
const { data: session, refresh: refreshSession, error: sessionError } = await useAdmin()
const email = ref(''),
  password = ref(''),
  loginError = ref(''),
  loggingIn = ref(false)
const page = ref(1),
  search = ref(''),
  outcome = ref(''),
  removed = ref(false)
const editorOpen = ref(false),
  editing = ref<Offer | null>(null),
  deleting = ref<Offer | null>(null),
  busy = ref(false),
  notice = ref(''),
  operationError = ref('')
const { filters } = usePeriod()
const adminQuery = computed(() => ({
  ...filters.value,
  page: page.value,
  search: search.value,
  outcome: outcome.value,
  deleted: String(removed.value),
}))
const { data, status, error, execute } = await useFetch<OfferPage>('/api/admin/offers', {
  query: adminQuery,
  immediate: false,
  watch: false,
})
if (session.value?.admin) await execute()
watch(
  [filters, search, outcome, removed],
  () => {
    page.value = 1
  },
  { flush: 'sync' },
)
watch(adminQuery, () => {
  if (session.value?.admin) execute()
})
async function login() {
  loggingIn.value = true
  loginError.value = ''
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    password.value = ''
    await refreshSession()
    if (session.value?.admin) await execute()
  } catch (error: any) {
    loginError.value = error.data?.statusMessage || 'Accesso non riuscito. Riprova.'
  } finally {
    loggingIn.value = false
  }
}
async function logout() {
  operationError.value = ''
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    data.value = undefined
    await refreshSession()
  } catch {
    operationError.value = 'Disconnessione non riuscita. Riprova.'
  }
}
function edit(offer: Offer | null = null) {
  editing.value = offer
  editorOpen.value = true
  notice.value = ''
}
async function saved() {
  editorOpen.value = false
  notice.value = 'Superquota salvata. Statistiche aggiornate.'
  await execute()
}
async function mutate(offer: Offer, restore = false) {
  busy.value = true
  operationError.value = ''
  notice.value = ''
  try {
    if (restore) await $fetch(`/api/admin/offers/${offer.id}/restore`, { method: 'POST' })
    else await $fetch(`/api/admin/offers/${offer.id}`, { method: 'DELETE' })
    deleting.value = null
    notice.value = restore
      ? 'Superquota ripristinata.'
      : 'Superquota rimossa. Puoi recuperarla da “Rimosse”.'
    if (data.value?.offers.length === 1 && page.value > 1) page.value--
    await refreshNuxtData()
    await execute()
  } catch (error: any) {
    operationError.value = error.data?.statusMessage || 'Operazione non riuscita. Riprova.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <div class="flex items-center justify-between mb-6 gap-2.5 md:mb-6.5 md:gap-5">
    <h1 class="text-3xl font-semibold tracking-tight leading-tight md:text-4xl">Management</h1>
    <div
      v-if="session?.admin"
      class="flex gap-2 flex-wrap justify-end md:gap-2.5 md:flex-nowrap md:justify-normal"
    >
      <button
        class="p-2.5 border border-action-border inline-flex items-center justify-center min-h-9.5 rounded-lg font-medium transition-colors duration-150 bg-action text-action-text md:px-4 md:py-2.5 md:gap-2 md:min-h-11 hover:bg-action-hover"
        @click="logout"
      >
        <AppIcon name="logout" :size="16" /><span class="hidden md:inline">Esci</span></button
      ><button
        class="px-2.5 py-2 border border-transparent inline-flex items-center justify-center gap-2 min-h-9.5 rounded-lg text-xs font-medium transition-colors duration-150 bg-lime-action text-canvas md:px-4 md:py-2.5 md:min-h-11 md:text-sm hover:bg-lime-hover"
        @click="edit()"
      >
        <AppIcon name="plus" :size="18" />Nuova superquota
      </button>
    </div>
  </div>
  <div
    v-if="session?.mode === 'snapshot'"
    class="px-5.5 py-7 mx-auto border border-panel-border bg-[#19251d] rounded-lg max-w-117.5 mt-9 mb-15 text-center bg-modal-gradient md:p-9 md:mt-14 md:mb-22.5"
  >
    <span
      class="mx-auto border border-[#506d47] w-[65px] h-[65px] bg-[#2c4430] rounded-lg grid place-items-center text-lime mt-0 mb-5.5"
      ><AppIcon name="lock" :size="28"
    /></span>
    <h2 class="text-xl tracking-tight font-semibold mb-3 md:text-xl">
      Gestione pronta per Supabase
    </h2>
    <p class="text-description leading-loose text-sm md:text-sm">
      Questa anteprima mostra lo storico reale in sola lettura. L’accesso e il salvataggio degli
      eventi saranno disponibili dopo il collegamento del progetto dedicato.
    </p>
    <NuxtLink
      to="/archive"
      class="px-4 py-2.5 border border-action-border inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-sm font-medium transition-colors duration-150 bg-action text-action-text mt-6 hover:bg-action-hover"
      >View archive<AppIcon name="arrow" :size="16"
    /></NuxtLink>
  </div>
  <DataState v-else-if="sessionError" error @retry="refreshSession()" />
  <form
    v-else-if="!session?.admin"
    class="px-5.5 py-7 mx-auto border border-panel-border bg-[#19251d] rounded-lg max-w-117.5 mt-9 mb-15 text-center bg-modal-gradient md:p-9 md:mt-14 md:mb-22.5"
    @submit.prevent="login"
  >
    <span
      class="mx-auto border border-[#506d47] w-[65px] h-[65px] bg-[#2c4430] rounded-lg grid place-items-center text-lime mt-0 mb-5.5"
      ><AppIcon name="lock" :size="27"
    /></span>
    <h2 class="text-xl tracking-tight font-semibold mb-3 md:text-xl">Accedi alla gestione</h2>
    <p class="text-description leading-loose text-sm md:text-sm">
      Accesso riservato all’amministratore.
    </p>
    <label class="flex flex-col gap-2 text-left text-sm text-foreground mt-5"
      >Email<input
        class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 md:text-sm"
        v-model="email"
        type="email"
        autocomplete="username"
        required
        placeholder="nome@esempio.it" /></label
    ><label class="flex flex-col gap-2 text-left text-sm text-foreground mt-5"
      >Password<input
        class="p-3 border border-input-border w-full bg-input rounded-md text-base text-input-text min-h-11 md:text-sm"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
    /></label>
    <p
      v-if="loginError"
      class="px-3.5 py-3 mx-0 my-3.5 border border-alert-border text-description leading-loose text-sm rounded-lg bg-alert md:text-sm"
      role="alert"
    >
      {{ loginError }}
    </p>
    <button
      class="px-4 py-2.5 border border-transparent inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-sm font-medium transition-colors duration-150 bg-lime-action text-canvas w-full mt-6.5 hover:bg-lime-hover"
      :disabled="loggingIn"
    >
      <AppIcon v-if="loggingIn" name="loading" class="animate-spin" :size="17" />{{
        loggingIn ? 'Accesso…' : 'Accedi'
      }}<AppIcon name="arrow" :size="17" />
    </button>
  </form>
  <template v-else
    ><PeriodFilters />
    <div class="flex gap-2.5 mb-6">
      <button
        class="px-3.5 py-2 border border-[#3b5140] flex gap-1.5 items-center rounded-md bg-[#203027] text-sm text-mint min-h-10.5 aria-pressed:border-[#7c8e4d] aria-pressed:text-lime aria-pressed:bg-[#35442a]"
        :aria-pressed="!removed"
        @click="removed = false"
      >
        Scommesse attive</button
      ><button
        class="px-3.5 py-2 border border-[#3b5140] flex gap-1.5 items-center rounded-md bg-[#203027] text-sm text-mint min-h-10.5 aria-pressed:border-[#7c8e4d] aria-pressed:text-lime aria-pressed:bg-[#35442a]"
        :aria-pressed="removed"
        @click="removed = true"
      >
        <AppIcon name="trash" :size="15" />Rimosse
      </button>
    </div>
    <p
      v-if="notice"
      class="px-4 py-3.5 border border-[#427653] flex items-center gap-2 bg-[#214d3470] text-mint rounded-lg mb-4.5 text-sm"
      role="status"
    >
      <AppIcon name="check" :size="17" />{{ notice }}
    </p>
    <p
      v-if="operationError"
      class="px-3.5 py-3 mx-0 my-3.5 border border-alert-border text-error text-xs leading-relaxed rounded-lg bg-alert"
      role="alert"
    >
      {{ operationError }}
    </p>
    <ArchiveControls
      v-model:search="search"
      v-model:outcome="outcome"
      :total="data?.total" /><DataState
      v-if="error || !data || !data.offers.length"
      :error="!!error"
      :loading="status === 'pending'"
      :empty="data?.offers.length === 0"
      @retry="execute()" /><OffersTable
      v-else
      :offers="data.offers"
      admin
      :removed="removed"
      @edit="edit"
      @remove="deleting = $event"
      @restore="mutate($event, true)" /><PaginationBar
      v-if="data && data.total > 0"
      v-model="page"
      :total="data.total"
      :page-size="data.pageSize"
      :loading="status === 'pending'" /><OfferEditor
      v-if="editorOpen"
      :offer="editing"
      @saved="saved"
      @cancel="editorOpen = false" /><ConfirmRemoval
      v-if="deleting"
      :offer="deleting"
      :busy="busy"
      :error="operationError"
      @confirm="mutate(deleting!)"
      @cancel="deleting = null"
  /></template>
</template>
