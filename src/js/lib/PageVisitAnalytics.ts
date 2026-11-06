import { normalizeLanguageCode } from '../Common'
import WebsiteService from '../services/WebsiteService'

interface AnalyticsLogger {
  debug(message:string):void
}

export class PageVisitAnalytics {
  private readonly nativeLanguage:string
  private readonly recordedPageLanguages = new Set<string>()

  constructor (
    nativeLanguage:string,
    private readonly websiteService:WebsiteService,
    private readonly logger:AnalyticsLogger,
    private readonly enabled = true
  ) {
    this.nativeLanguage = normalizeLanguageCode(nativeLanguage)
  }

  public record (language:string) {
    if (!this.enabled) {
      return
    }

    const normalizedLanguage = normalizeLanguageCode(language)
    if (normalizedLanguage === this.nativeLanguage) {
      return
    }

    const key = `${window.location.pathname}\0${normalizedLanguage}`
    if (this.recordedPageLanguages.has(key)) {
      return
    }

    this.recordedPageLanguages.add(key)
    this.websiteService.reportPageVisit(window.location.href, normalizedLanguage).catch(error => {
      const status = (error as any)?.response?.status
      const statusMessage = status ? ` with status ${status}` : ''
      this.logger.debug(`Page visit analytics request failed${statusMessage}`)
    })
  }
}
