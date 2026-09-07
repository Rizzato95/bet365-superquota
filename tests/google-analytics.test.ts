import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

async function initialize(id: string) {
  const head = vi.fn()
  vi.stubGlobal('defineNuxtPlugin', (setup: () => void) => setup)
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { googleAnalyticsId: id } }))
  vi.stubGlobal('useHead', head)
  const { default: setup } = await import('../app/plugins/google-analytics')
  ;(setup as unknown as () => void)()
  return { head }
}

describe('Google Analytics integration', () => {
  it.each(['', 'invalid-id'])(
    'does not load Google without a valid measurement ID: %s',
    async (id) => {
      const { head } = await initialize(id)
      expect(head).not.toHaveBeenCalled()
    },
  )

  it('renders the Analytics snippet in the document head', async () => {
    const { head } = await initialize(' G-TEST123456 ')
    expect(head).toHaveBeenCalledExactlyOnceWith({
      script: [
        {
          key: 'google-analytics-library',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST123456',
          async: true,
        },
        {
          key: 'google-analytics-config',
          innerHTML:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-TEST123456',{'allow_google_signals':false,'allow_ad_personalization_signals':false});",
        },
      ],
    })
  })
})
