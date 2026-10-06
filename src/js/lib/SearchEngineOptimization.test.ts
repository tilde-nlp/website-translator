import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'
import { pluginOptions } from '../models/PluginOptions'
import { SearchEngineOptimization } from './SearchEngineOptimization'

describe('SearchEngineOptimization language URL mode', () => {
  let originalLanguageUrlMode: 'push' | 'replace' | 'none'

  beforeEach(() => {
    originalLanguageUrlMode = pluginOptions.translation.languageUrlMode
    document.body.innerHTML = '<a href="/products/2?view=compact#details">Product</a>'
  })

  afterEach(() => {
    pluginOptions.translation.languageUrlMode = originalLanguageUrlMode
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
})
