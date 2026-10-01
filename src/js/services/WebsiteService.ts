import axios, { CancelToken } from 'axios'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'
import { ITranslation } from '../interfaces/services/websiteService/ITranslation'
import IConfiguration from '../interfaces/services/websiteService/v2/IConfiguration'
import IConfiguration3 from '../interfaces/services/websiteService/v3/IConfiguration'
import ICachedWidgetToken from '../interfaces/services/websiteService/ICachedWidgetToken'
import IWebsiteConfiguration from '../interfaces/services/websiteService/IWebsiteConfiguration'
import IWebsite from '../interfaces/services/websiteService/v1/IWebsite'
import IWidgetTokenResponse from '../interfaces/services/websiteService/IWidgetTokenResponse'
import IWordCountPageReportRequest from '../interfaces/services/websiteService/IWordCountPageReportRequest'
import { normalizeLanguageCode } from '../Common'

class WebsiteService {
    private pluginOptions:IPluginOptions
    private readonly widgetTokens = new Map<string, ICachedWidgetToken>()
    private readonly widgetTokenRequests = new Map<string, Promise<ICachedWidgetToken>>()

    constructor (
      pluginOptions:IPluginOptions
    ) {
      this.pluginOptions = pluginOptions
    }

    private static readonly GROUP_TAG_REGEX = /<g(\d+)\b([^>]*)>([\s\S]*?)<\/g\1>/g
    private static readonly GROUP_TAG_SID_REGEX = /\bsid\s*=\s*["']?([^"'\s>]+)["']?/i
    private static readonly TRANSLATE_BATCH_SCOPE = 'translate:batch'
    private static readonly WORD_COUNT_SCOPE = 'word-count:ingest'
    private static readonly TOKEN_REFRESH_SKEW_MS = 30000

    async getWebsite () {
      const website:IWebsiteConfiguration = {
        srcLang: '',
        languages: []
      }
      if (this.pluginOptions.api.version === 1) {
        const response = await axios.get<IWebsite>(`${this.pluginOptions.api.url}/api/translate/website/${this.pluginOptions.api.clientId}`)
        website.srcLang = response.data.sourceLanguage
        website.languages = response.data.targetLanguages
      }
      else if (this.pluginOptions.api.version === 2) {
        const response = await axios.get<IConfiguration>(`${this.pluginOptions.api.url}/api/configurationservice/configuration/${this.pluginOptions.api.clientId}`)

        website.srcLang = response.data.srcLang
        website.languages = response.data.languages.map(item => normalizeLanguageCode(item.trgLang))
      }
      else if (this.pluginOptions.api.version === 3) {
        const response = await axios.get<IConfiguration3>(`${this.pluginOptions.api.url}/api/configurationservice/configuration/${this.pluginOptions.api.clientId}`)

        website.srcLang = response.data.languageDirections[0]?.srcLang
        website.languages = response.data.languageDirections.map(item => normalizeLanguageCode(item.trgLang))
      }
      else {
        throw Error(`API version '${this.pluginOptions.api.version}' not recognized`)
      }

      return website
    }

    async translate (batch: Array<ITranslatableItem>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      return await this.translateUsingGroupedDocument(batch, targetLanguage, pageUrl, cancelToken)
    }

    async reportWordCountPage (segments: Array<string>, pageUrl:string, cancelToken: CancelToken) {
      const data:IWordCountPageReportRequest = {
        Uri: pageUrl,
        Segments: segments
      }

      const url = `${this.pluginOptions.api.url}/api/websitetranslationservice/word-count/${this.pluginOptions.api.clientId}/pages`

      await this.postProtected(
        url,
        data,
        WebsiteService.WORD_COUNT_SCOPE,
        cancelToken
      )
    }

    private getWidgetTokenCacheKey (scope:string) {
      return `${this.pluginOptions.api.clientId}:${scope}`
    }

    private async requestWidgetToken (scope:string) {
      const url = `${this.pluginOptions.api.url}/api/websitetranslationservice/translate/website/${this.pluginOptions.api.clientId}/translate/widget-token?scope=${encodeURIComponent(scope)}`
      const response = await axios.post<IWidgetTokenResponse>(
        url,
        undefined,
        {
          headers: {
            'X-Origin': window.location.origin
          }
        }
      )

      const refreshSkew = Math.min(WebsiteService.TOKEN_REFRESH_SKEW_MS, response.data.expires_in * 100)
      return {
        accessToken: response.data.access_token,
        expiresAt: Date.now() + response.data.expires_in * 1000 - refreshSkew
      }
    }

    private async getWidgetToken (scope:string, forceRefresh = false) {
      const cacheKey = this.getWidgetTokenCacheKey(scope)
      const cachedToken = this.widgetTokens.get(cacheKey)
      if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) {
        return cachedToken
      }

      const pendingRequest = this.widgetTokenRequests.get(cacheKey)
      if (pendingRequest) {
        return await pendingRequest
      }

      const tokenRequest = this.requestWidgetToken(scope)
      this.widgetTokenRequests.set(cacheKey, tokenRequest)

      try {
        const token = await tokenRequest
        this.widgetTokens.set(cacheKey, token)
        return token
      }
      finally {
        if (this.widgetTokenRequests.get(cacheKey) === tokenRequest) {
          this.widgetTokenRequests.delete(cacheKey)
        }
      }
    }

    private invalidateWidgetToken (scope:string, accessToken:string) {
      const cacheKey = this.getWidgetTokenCacheKey(scope)
      if (this.widgetTokens.get(cacheKey)?.accessToken === accessToken) {
        this.widgetTokens.delete(cacheKey)
      }
    }

    private async postProtected<T> (url:string, data:any, scope:string, cancelToken:CancelToken) {
      const token = await this.getWidgetToken(scope)

      try {
        return await this.postWithWidgetToken<T>(url, data, token, cancelToken)
      }
      catch (error) {
        if ((error as any)?.response?.status !== 401) {
          throw error
        }

        this.invalidateWidgetToken(scope, token.accessToken)
        const refreshedToken = await this.getWidgetToken(scope)
        return await this.postWithWidgetToken<T>(url, data, refreshedToken, cancelToken)
      }
    }

    private async postWithWidgetToken<T> (
      url:string,
      data:any,
      token:ICachedWidgetToken,
      cancelToken:CancelToken
    ) {
      return await axios.post<T>(
        url,
        data,
        {
          cancelToken: cancelToken,
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'X-Origin': window.location.origin
          }
        }
      )
    }

    private isAttributeType (item: ITranslatableItem) {
      return item.type === TranslatableItemType.ATTRIBUTE || item.type === TranslatableItemType.ATTRIBUTE_SEO
    }

    private isSeoType (item: ITranslatableItem) {
      return item.type === TranslatableItemType.ELEMENT_SEO || item.type === TranslatableItemType.ATTRIBUTE_SEO
    }

    private stripHtmlToPlainText (html:string) {
      const tmpElement = document.createElement('div')
      tmpElement.innerHTML = html
      return (tmpElement.textContent || '').trim()
    }

    private buildUrlAndPayload (texts: Array<{text: string, meta: any}>, targetLanguage:string, pageUrl:string) {
      const data = {
        lang: targetLanguage,
        URL: pageUrl,
        texts: texts
      }

      const url = `${this.pluginOptions.api.url}/api/websitetranslationservice/translate/website/${this.pluginOptions.api.clientId}/translate/batch`

      return {
        url,
        data
      }
    }

    private async postTranslations (texts: Array<{text: string, meta: any}>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      const request = this.buildUrlAndPayload(texts, targetLanguage, pageUrl)

      const result = await this.postProtected<Array<ITranslation>>(
        request.url,
        request.data,
        WebsiteService.TRANSLATE_BATCH_SCOPE,
        cancelToken
      )

      return result.data
    }

    private buildDocumentFromTranslationItems (translationItems: Array<ITranslatableItem>) {
      return translationItems
        .map((item, index) => `<g${index + 1}>${item.text}</g${index + 1}>`)
        .join('\n')
    }

    private createAlignmentError (reason:string) {
      return new Error(`alignment-broken:${reason}`)
    }

    private parseGroupedDocument (translatedDocument:string, expectedCount:number) {
      const idToTranslation = new Map<number, {translation: string, segmentId: number}>()
      const regex = new RegExp(WebsiteService.GROUP_TAG_REGEX.source, 'g')
      const matches: RegExpExecArray[] = []
      let match: RegExpExecArray | null

      while ((match = regex.exec(translatedDocument)) !== null) {
        matches.push(match)
      }

      if (matches.length !== expectedCount) {
        throw this.createAlignmentError(`group-count-mismatch:expected-${expectedCount}:actual-${matches.length}`)
      }

      for (const match of matches) {
        const id = Number(match[1])
        const attributes = match[2] || ''
        const sidMatch = attributes.match(WebsiteService.GROUP_TAG_SID_REGEX)
        const sid = Number(sidMatch?.[1])

        if (!sidMatch || Number.isNaN(sid)) {
          throw this.createAlignmentError(`invalid-sid:group-${id}`)
        }

        idToTranslation.set(id, {
          translation: (match[3] || '').trim(),
          segmentId: sid
        })
      }

      for (let index = 1; index <= expectedCount; index++) {
        if (!idToTranslation.has(index)) {
          throw this.createAlignmentError(`missing-group:${index}`)
        }
      }

      return idToTranslation
    }

    private async translateUsingGroupedDocument (batch: Array<ITranslatableItem>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      if (batch.length === 0) {
        return []
      }

      const isSeoBatch = batch.every(item => this.isSeoType(item))
      const groupedDocument = this.buildDocumentFromTranslationItems(batch)
      const translated = await this.postTranslations([
        {
          text: groupedDocument,
          meta: {
            seo: isSeoBatch,
            tag: 'BATCH',
            attr: null,
            refAttr: null
          }
        }
      ], targetLanguage, pageUrl, cancelToken)

      const translatedDocument = translated?.[0]?.translation
      if (typeof translatedDocument !== 'string') {
        throw this.createAlignmentError('missing-translation-document')
      }

      const idToTranslation = this.parseGroupedDocument(translatedDocument, batch.length)

      return batch.map((item, index) => {
        const translatedItem = idToTranslation.get(index + 1)
        let translatedText = translatedItem?.translation
        if (this.isAttributeType(item)) {
          translatedText = this.stripHtmlToPlainText(translatedText || '')
        }

        return {
          segmentId: translatedItem?.segmentId || 0,
          translation: translatedText || ''
        }
      })
    }
}
export default WebsiteService
