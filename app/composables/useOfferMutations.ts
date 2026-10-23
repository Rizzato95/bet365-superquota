import type { Offer, OfferInput } from '#shared/types/offer'

type OfferAction = 'save' | 'remove' | 'restore'
type MutationOptions = {
  onSuccess?: (action: OfferAction) => void
  onUnauthorized?: () => void | Promise<void>
}

export function useOfferMutations(options: MutationOptions = {}) {
  const busy = ref(false)
  const error = ref('')

  async function run(action: OfferAction, request: () => Promise<unknown>) {
    if (busy.value) return false
    busy.value = true
    error.value = ''
    try {
      await request()
      options.onSuccess?.(action)
      await refreshOfferData()
      return true
    } catch (cause: unknown) {
      if (isUnauthorizedError(cause) && options.onUnauthorized) {
        await options.onUnauthorized()
      } else {
        error.value = httpErrorMessage(
          cause,
          action === 'save'
            ? 'Salvataggio non riuscito. Riprova.'
            : 'Operazione non riuscita. Riprova.',
        )
      }
      return false
    } finally {
      busy.value = false
    }
  }

  function save(offer: Offer | null, input: OfferInput) {
    return run('save', () =>
      $fetch<void>(offer ? `/api/admin/offers/${offer.id}` : '/api/admin/offers', {
        method: offer ? 'PATCH' : 'POST',
        body: input,
      }),
    )
  }

  function remove(offer: Offer) {
    return run('remove', () => $fetch<void>(`/api/admin/offers/${offer.id}`, { method: 'DELETE' }))
  }

  function restore(offer: Offer) {
    return run('restore', () =>
      $fetch<void>(`/api/admin/offers/${offer.id}/restore`, { method: 'POST' }),
    )
  }

  return { busy, error, save, remove, restore }
}
