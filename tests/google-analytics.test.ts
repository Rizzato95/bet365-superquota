import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

async function initialize(id: string) {
  const browser: { dataLayer?: IArguments[]; gtag?: (...args: unknown[]) => void } = {}
  const head = vi.fn()
  vi.stubGlobal('window', browser)
  vi.stubGlobal('defineNuxtPlugin', (setup: () => void) => setup)
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { googleAnalyticsId: id } }))
  vi.stubGlobal('useHead', head)
  const { default: setup } = await import('../app/plugins/google-analytics.client')
  ;(setup as unknown as () => void)()
  return { browser, head }
}

describe('Google Analytics integration', () => {
  it.each(['', 'invalid-id'])(
    'does not load Google without a valid measurement ID: %s',
    async (id) => {
      const { browser, head } = await initialize(id)
      expect(browser.dataLayer).toBeUndefined()
      expect(head).not.toHaveBeenCalled()
    },
  )

  it('queues one configuration and loads the asynchronous tag without a duplicate page_view', async () => {
    const { browser, head } = await initialize(' G-TEST123456 ')
    const commands = browser.dataLayer!.map((command) => Array.from(command))
    expect(commands).toEqual([
      ['js', expect.any(Date)],
      [
        'config',
        'G-TEST123456',
        { allow_google_signals: false, allow_ad_personalization_signals: false },
      ],
    ])
    expect(head).toHaveBeenCalledExactlyOnceWith({
      script: [
        {
          key: 'google-analytics',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST123456',
          async: true,
        },
      ],
    })
  })
})
