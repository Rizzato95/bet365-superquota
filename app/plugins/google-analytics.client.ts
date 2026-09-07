type GoogleTag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GoogleTag
  }
}

export default defineNuxtPlugin(() => {
  const id = useRuntimeConfig().public.googleAnalyticsId.trim()
  if (import.meta.dev || !/^G-[A-Z0-9]+$/.test(id)) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  // Enhanced measurement handles subsequent Nuxt navigations through browser history.
  // Do not also send manual page_view events: that would count visits twice.
  window.gtag('config', id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  useHead({
    script: [
      {
        key: 'google-analytics',
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        async: true,
      },
    ],
  })
})
