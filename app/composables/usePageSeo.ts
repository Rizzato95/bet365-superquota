type PageSeo = {
  title: string
  description: string
  path: '/' | '/archive' | '/simulator' | '/management'
  noindex?: boolean
}

function siteOrigin(siteUrl: string) {
  return siteUrl.replace(/\/+$/, '')
}

export function usePageSeo({ title, description, path, noindex = false }: PageSeo) {
  const runtimeConfig = useRuntimeConfig()
  const appConfig = useAppConfig()
  const origin = siteOrigin(runtimeConfig.public.siteUrl)
  const url = `${origin}${path}`
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  useSeoMeta({
    title,
    description,
    robots,
    ogTitle: `${title} | ${appConfig.brand.name}`,
    ogDescription: description,
    ogType: 'website',
    ogUrl: url,
    ogSiteName: appConfig.brand.name,
    ogLocale: 'it_IT',
    twitterCard: 'summary',
    twitterTitle: `${title} | ${appConfig.brand.name}`,
    twitterDescription: description,
  })

  useHead({ link: [{ key: 'canonical', rel: 'canonical', href: url }] })
}
