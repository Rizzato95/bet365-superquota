type PageSeo = {
  title: MaybeRefOrGetter<string>
  description: string
  path: MaybeRefOrGetter<string>
  noindex?: MaybeRefOrGetter<boolean>
}

function siteOrigin(siteUrl: string) {
  return siteUrl.replace(/\/+$/, '')
}

export function usePageSeo({ title, description, path, noindex = false }: PageSeo) {
  const runtimeConfig = useRuntimeConfig()
  const appConfig = useAppConfig()
  const origin = siteOrigin(runtimeConfig.public.siteUrl)
  const url = computed(() => `${origin}${toValue(path)}`)
  const socialImage = `${origin}/social-card.webp`
  const robots = computed(() =>
    toValue(noindex) ? 'noindex, follow' : 'index, follow, max-image-preview:large',
  )

  useSeoMeta({
    title: () => toValue(title),
    description,
    robots,
    ogTitle: () => `${toValue(title)} | ${appConfig.brand.name}`,
    ogDescription: description,
    ogType: 'website',
    ogUrl: url,
    ogSiteName: appConfig.brand.name,
    ogLocale: 'it_IT',
    ogImage: socialImage,
    ogImageAlt: () => `${appConfig.brand.name} · ${toValue(title)}`,
    ogImageWidth: '1731',
    ogImageHeight: '909',
    twitterCard: 'summary_large_image',
    twitterTitle: () => `${toValue(title)} | ${appConfig.brand.name}`,
    twitterDescription: description,
    twitterImage: socialImage,
    twitterImageAlt: () => `${appConfig.brand.name} · ${toValue(title)}`,
  })

  useHead(() => ({ link: [{ key: 'canonical', rel: 'canonical', href: url.value }] }))
}
