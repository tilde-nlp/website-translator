// SEO for WTW.
// Please note that this is not fully compatible version for all search engines and probably will work with issues even with google.
// To make Website translation SEO friendly we need to implement WTW functionality in backend.
// This will be better option to store translation cache on client servers too probably?
//
// References:
// https://developers.google.com/search/docs/advanced/crawling/localized-versions?hl=en&ref_topic=2370587&visit_id=637414821910235813-3065476810&rd=1
// https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites?hl=en&ref_topic=2370587&visit_id=637414822196199164-1055925763&rd=1
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { Logger } from '../Logger'
import { DOMExtensions } from './DOMExtensions'

const ORIGINAL_URL_ATTR = 'wt-attr-original-url'

export class SearchEngineOptimization {
  private logger:Logger;
  private cachedLinkTargets:Map<Element, string>

  constructor (pluginOptions:IPluginOptions) {
    this.logger = new Logger(pluginOptions.debug, 'SearchEngineOptimization')
    this.cachedLinkTargets = new Map<Element, string>()
  }

  /**
   * Set SEO support for specific HTML document.
   * @param currentLocale
   * @param availableLocales
   */
  public applyLinkedPages (currentLocale: string, availableLocales: Array<string>):void {
    this.logger.debug('Applying SEO...')

    DOMExtensions.selectAllDocuments().forEach(doc => {
      this.markCanonicalUrl(doc, currentLocale)
      this.markAlternativePages(doc, availableLocales)
    })

    this.logger.debug('SEO done')
  }

  public restoreUrlLocalization (links: Array<HTMLElement>) {
    this.logger.info('Restore SEO')
    this.localizeUrls(links, null)

    DOMExtensions.selectAllDocuments().forEach(doc => {
      this.markCanonicalUrl(doc, null, true)
    })
  }

  public localizeUrls (links: Array<Element>, currentLocale: string = null):void {
    // https://developers.google.com/search/docs/advanced/guidelines/links-crawlable

    const docRoots = new Set<Document>()
    links.forEach(element => {
      docRoots.add(element.ownerDocument)
    })

    docRoots.forEach(doc => {
      const link = doc.querySelector('head link[rel="canonical"]')
      if (link !== null) {
        links.push(link)
      }
    })

    links.forEach(link => {
      const linkUrl = link.getAttribute('href')
      const parsedUrl = this.parseUrl(link.ownerDocument, linkUrl)
      let linkTarget:string
      if (parsedUrl) {
        if (currentLocale === null) {
          linkTarget = this.cachedLinkTargets.get(link)
        }
        else {
          linkTarget = this.localizeUrl(parsedUrl, currentLocale)
          this.cachedLinkTargets.set(link, link.getAttribute('href'))
        }
        if (linkTarget) {
          link.setAttribute('href', linkTarget)
        }
      }
    })
  }

  private markCanonicalUrl (doc: Document, currentLocale: string, restore = false) {
    let link = doc.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!link && doc.head !== null) {
      link = document.createElement('link')
      doc.head.appendChild(link)
      link.rel = 'canonical'
    }
    if (link !== null) {
      if (restore) {
        if (link.hasAttribute(ORIGINAL_URL_ATTR)) {
          link.href = link.getAttribute(ORIGINAL_URL_ATTR)
        }
      }
      else {
        const localizedUrl = this.localizeUrl(new URL(doc.URL), currentLocale)
  
        if (!link.hasAttribute(ORIGINAL_URL_ATTR)) {
          link.setAttribute(ORIGINAL_URL_ATTR, link.href || doc.location.href)
        }
        link.href = localizedUrl
      }
    }
  }

  private markAlternativePages (doc:Document, availableLocales: Array<string>):void {
    // https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls?hl=en
    let link:HTMLLinkElement

    for (const locale of availableLocales) {
      const localizedUrl = this.localizeUrl(new URL(doc.URL), locale)
      if (doc.head !== null) {
        const existingLink = doc.head.querySelector(`link[rel="alternate"][hreflang="${locale}"]`)

        if (!existingLink) {
          link = document.createElement('link')
          link.rel = 'alternate'
          link.hreflang = locale
          link.href = localizedUrl
  
          doc.head.appendChild(link)
        }
      }
    }
  }

  /**
   * Return local url to specified document
   * @param doc
   * @param url
   */
  private parseUrl (doc:Document, url:string):URL {
    try {
      if (url.length > 0 && url[0] === '/') {
        // Relative url
        return new URL(url, doc.location.href)
      }
      else {
        // Absoute url
        const newUrl = new URL(url)
        if (newUrl.host === new URL(doc.URL).host) {
          return newUrl
        }
      }
    }
    catch (err) {
      // this.logger.warn(`Failed to parse url:${url} err: ${err}`)
    }
    return null
  }

  /**
   * Localize link to include language code for WTW
   * @param url
   * @param locale
   */
  private localizeUrl (url:URL, locale: string):string {
    if (locale) {
      url.searchParams.set('lang', locale)
    }
    return url.href
  }
}
