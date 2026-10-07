import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'
import { pluginOptions } from '../models/PluginOptions'
import { SearchEngineOptimization } from './SearchEngineOptimization'

describe('SearchEngineOptimization language URL mode', () => {
  let originalLanguageUrlMode: 'push' | 'replace' | 'none'
  let originalSetCanonicalUrl: boolean

  beforeEach(() => {
    originalLanguageUrlMode = pluginOptions.translation.languageUrlMode
    originalSetCanonicalUrl = pluginOptions.seo.setCanonicalUrl
    document.body.innerHTML = '<a href="/products/2?view=compact#details">Product</a>'
  })

  afterEach(() => {
    pluginOptions.translation.languageUrlMode = originalLanguageUrlMode
    pluginOptions.seo.setCanonicalUrl = originalSetCanonicalUrl
    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach(link => link.remove())
    document.body.innerHTML = ''
  })

  it('leaves application-owned links unchanged when URL management is disabled', () => {
    pluginOptions.translation.languageUrlMode = 'none'
    const link = document.querySelector('a')

    new SearchEngineOptimization(pluginOptions).localizeUrls([link], 'lv')

    expect(link.getAttribute('href')).toBe('https://widget.example/products/2?view=compact#details')
  })

  it('preserves legacy language query localization by default', () => {
    pluginOptions.translation.languageUrlMode = 'push'
    const link = document.querySelector('a')

    new SearchEngineOptimization(pluginOptions).localizeUrls([link], 'lv')

    expect(link.getAttribute('href')).toBe('https://widget.example/products/2?view=compact&lang=lv#details')
  })

  it('refreshes canonical and hreflang metadata for repeated SPA route changes', () => {
    pluginOptions.translation.languageUrlMode = 'push'
    pluginOptions.seo.setCanonicalUrl = true
    const seo = new SearchEngineOptimization(pluginOptions)

    window.history.replaceState(null, '', '/first')
    seo.applyLinkedPages('lv', ['en', 'lv'])

    window.history.replaceState(null, '', '/second?view=compact')
    seo.applyLinkedPages('lv', ['en', 'lv'])
    seo.applyLinkedPages('lv', ['en', 'lv'])

    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href'))
      .toBe('https://widget.example/second?view=compact&lang=lv')
    expect(document.head.querySelectorAll('link[rel="alternate"][hreflang="en"]')).toHaveLength(1)
    expect(document.head.querySelector('link[rel="alternate"][hreflang="en"]').getAttribute('href'))
      .toBe('https://widget.example/second?view=compact&lang=en')
    expect(document.head.querySelectorAll('link[rel="alternate"][hreflang="lv"]')).toHaveLength(1)
  })

  it('recreates translation metadata after the SPA replaces head links', () => {
    pluginOptions.seo.setCanonicalUrl = true
    const seo = new SearchEngineOptimization(pluginOptions)

    seo.applyLinkedPages('lv', ['en', 'lv'])
    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach(link => link.remove())
    seo.applyLinkedPages('lv', ['en', 'lv'])

    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(2)
  })

  it('preserves the original linked-page target across repeated refreshes', () => {
    pluginOptions.translation.languageUrlMode = 'push'
    const seo = new SearchEngineOptimization(pluginOptions)
    const link = document.querySelector('a')

    seo.localizeUrls([link], 'lv')
    seo.localizeUrls([link], 'lv')
    seo.restoreUrlLocalization([link])

    expect(link.getAttribute('href')).toBe('/products/2?view=compact#details')
  })
})
