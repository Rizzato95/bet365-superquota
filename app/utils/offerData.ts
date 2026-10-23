export const offerDataKeys = {
  statistics: 'statistics',
  management: 'admin-offers',
  archivePrefix: 'archive-offers:',
} as const

export function refreshOfferData() {
  const keys = Object.keys(useNuxtApp().payload.data).filter(
    (key) =>
      key === offerDataKeys.statistics ||
      key === offerDataKeys.management ||
      key.startsWith(offerDataKeys.archivePrefix),
  )
  return refreshNuxtData(keys)
}
