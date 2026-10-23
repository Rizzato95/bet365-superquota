let scrollLocks = 0
let previousOverflow = ''

export function useDialog({ autoOpen = false } = {}) {
  const dialog = ref<HTMLDialogElement | null>(null)
  let locked = false

  function restoreScroll() {
    if (!locked) return
    locked = false
    scrollLocks--
    if (scrollLocks === 0) document.documentElement.style.overflow = previousOverflow
  }

  function open() {
    if (!dialog.value || dialog.value.open) return
    dialog.value.showModal()
    if (scrollLocks === 0) {
      previousOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
    }
    scrollLocks++
    locked = true
  }

  function close() {
    dialog.value?.close()
    restoreScroll()
  }

  function closeOnBackdrop(event: MouseEvent) {
    if (!dialog.value || event.target !== dialog.value) return
    const rect = dialog.value.getBoundingClientRect()
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      close()
  }

  onMounted(() => {
    dialog.value?.addEventListener('close', restoreScroll)
    if (autoOpen) open()
  })
  onBeforeUnmount(() => {
    close()
    dialog.value?.removeEventListener('close', restoreScroll)
  })

  return { dialog, open, close, closeOnBackdrop }
}
