<script setup lang="ts">
const page = defineModel<number>({ required: true })
import type { RouteLocationRaw } from 'vue-router'
const props = defineProps<{
  total: number
  pageSize: number
  loading?: boolean
  pageTo?: (page: number) => RouteLocationRaw
}>()
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
async function changePage(nextPage: number) {
  page.value = nextPage
  await nextTick()
  document.querySelector('#archive-controls')?.scrollIntoView({ block: 'start' })
}
</script>
<template>
  <div
    class="flex items-center justify-between gap-3.5 mt-6 text-xs text-mint flex-wrap md:text-xs md:flex-nowrap"
  >
    <span
      >Pagina <strong class="text-foreground">{{ page }}</strong> di {{ pages
      }}<span class="hidden md:inline"> · {{ total }} scommesse</span></span
    >
    <div class="flex gap-1.5 md:gap-2">
      <template v-if="pageTo">
        <NuxtLink
          v-if="page > 1"
          :to="pageTo(page - 1)"
          rel="prev"
          aria-label="Pagina precedente"
          class="px-3 py-2 border border-action-border rounded-md text-action-text hover:bg-action-hover"
          >Precedente</NuxtLink
        >
        <span v-else aria-disabled="true" class="px-3 py-2 text-muted">Precedente</span>
        <NuxtLink
          v-if="page < pages"
          :to="pageTo(page + 1)"
          rel="next"
          aria-label="Pagina successiva"
          class="px-3 py-2 border border-action-border rounded-md text-action-text hover:bg-action-hover"
          >Successiva</NuxtLink
        >
        <span v-else aria-disabled="true" class="px-3 py-2 text-muted">Successiva</span>
      </template>
      <template v-else>
        <button
          class="px-2.5 py-2 border border-action-border inline-flex items-center justify-center gap-0.5 min-h-9.5 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-action-text md:px-3 md:gap-2 md:text-xs hover:bg-action-hover"
          :disabled="page <= 1 || loading"
          aria-label="Pagina precedente"
          @click="changePage(page - 1)"
        >
          <AppIcon name="left" :size="17" /><span>Precedente</span></button
        ><button
          class="px-2.5 py-2 border border-action-border inline-flex items-center justify-center gap-0.5 min-h-9.5 rounded-lg text-xs font-medium transition-colors duration-150 bg-action text-action-text md:px-3 md:gap-2 md:text-xs hover:bg-action-hover"
          :disabled="page >= pages || loading"
          aria-label="Pagina successiva"
          @click="changePage(page + 1)"
        >
          <span>Successiva</span><AppIcon name="right" :size="17" />
        </button>
      </template>
    </div>
  </div>
</template>
