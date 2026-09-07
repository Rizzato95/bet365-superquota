<script setup lang="ts">
import type { Offer } from '#shared/types/offer'
defineProps<{ offer: Offer; busy: boolean; error?: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
onMounted(() => dialog.value?.showModal())
onBeforeUnmount(() => dialog.value?.close())
</script>
<template>
  <dialog
    ref="dialog"
    class="p-[27px] m-auto border border-[#4a6349] fixed top-0 right-0 bottom-0 left-0 rounded-[13px] bg-[#1a291f] text-[#e4eee5] w-150 max-w-[calc(100%_-_20px)] max-h-[calc(100dvh_-_20px)] overflow-auto shadow-[0_30px_100px_#0008] md:max-w-115 md:max-h-[calc(100dvh_-_40px)] backdrop:bg-[#06140cba] backdrop:backdrop-blur-[4px]"
    aria-labelledby="remove-title"
    @cancel.prevent="!busy && emit('cancel')"
  >
    <h2 class="text-xl leading-[1.4] mb-[15px]" id="remove-title">Rimuovere questa superquota?</h2>
    <p class="text-sm leading-[1.8] text-[#b0c6b7]">
      <strong>{{ offer.event }}</strong> verrà nascosta dall’archivio e dalle statistiche. Potrai
      ripristinarla dalla sezione Rimosse.
    </p>
    <p
      v-if="error"
      class="px-3.5 py-3 mx-0 my-[15px] border border-[#7c4b4380] text-[#b0c6b7] text-sm leading-[1.8] rounded-[7px] bg-[#56312c70]"
      role="alert"
    >
      {{ error }}
    </p>
    <div
      class="px-0 border-0 flex gap-2.5 justify-end pt-5.5 pb-0 border-t-[#3c513e] bg-transparent"
    >
      <button
        class="px-4 py-[11px] border border-[#3a4c3e] inline-flex items-center justify-center gap-[9px] min-h-11 rounded-[7px] text-[13px] font-[550] transition-colors duration-150 bg-[#24332a] text-[#c4d3c9] hover:bg-[#304334]"
        :disabled="busy"
        @click="emit('cancel')"
      >
        Annulla</button
      ><button
        class="px-4 py-[11px] border border-[#8b504a] inline-flex items-center justify-center gap-[9px] min-h-11 rounded-[7px] text-[13px] font-[550] transition-colors duration-150 bg-[#703e3a] text-[#ffd8d2]"
        :disabled="busy"
        @click="emit('confirm')"
      >
        {{ busy ? 'Rimozione…' : 'Rimuovi' }}
      </button>
    </div>
  </dialog>
</template>
