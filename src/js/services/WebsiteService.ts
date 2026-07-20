import axios, { CancelToken } from 'axios'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'
import { ITranslation } from '../interfaces/services/websiteService/ITranslation'
import IConfiguration from '../interfaces/services/websiteService/v2/IConfiguration'
import IConfiguration3 from '../interfaces/services/websiteService/v3/IConfiguration'
import IWebsiteConfiguration from '../interfaces/services/websiteService/IWebsiteConfiguration'
import IWebsite from '../interfaces/services/websiteService/v1/IWebsite'
import { normalizeLanguageCode } from '../Common'

class WebsiteService {
    private pluginOptions:IPluginOptions

    constructor (
      pluginOptions:IPluginOptions
    ) {
      this.pluginOptions = pluginOptions
    }

    private static readonly GROUP_TAG_REGEX = /<g(\d+)\b([^>]*)>([\s\S]*?)<\/g\1>/g
    private static readonly GROUP_TAG_SID_REGEX = /\bsid\s*=\s*["']?([^"'\s>]+)["']?/i

    async getWebsite () {
      const website:IWebsiteConfiguration = {
        srcLang: null,
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
      try {
        return await this.translateUsingGroupedDocument(batch, targetLanguage, pageUrl, cancelToken)
      }
      catch (err) {
        if (axios.isCancel(err)) {
          throw err
        }

        return await this.translateLegacy(batch, targetLanguage, pageUrl, cancelToken)
      }
    }

    private isTextType (item: ITranslatableItem) {
      return item.type === TranslatableItemType.ELEMENT || item.type === TranslatableItemType.ELEMENT_SEO
    }

    private isAttributeType (item: ITranslatableItem) {
      return item.type === TranslatableItemType.ATTRIBUTE || item.type === TranslatableItemType.ATTRIBUTE_SEO
    }

    private stripHtmlToPlainText (html:string) {
      const tmpElement = document.createElement('div')
      tmpElement.innerHTML = html
      return (tmpElement.textContent || '').trim()
    }

    private buildUrlAndPayload (texts: Array<{text: string, meta: any}>, targetLanguage:string, pageUrl:string, useBatchEndpoint:boolean = false) {
      const data = {
        lang: targetLanguage,
        URL: pageUrl,
        texts: texts
      }

      let url:string
      if (useBatchEndpoint) {
        url = `${this.pluginOptions.api.url}/translate/website/${this.pluginOptions.api.clientId}/translate/batch`
      }
      else if (this.pluginOptions.api.version === 1) {
        url = `${this.pluginOptions.api.url}/api/translate/website/${this.pluginOptions.api.clientId}/translate`
      }
      else if (this.pluginOptions.api.version <= 3 ) {
        data.lang = data.lang.toUpperCase()
        url = `${this.pluginOptions.api.url}/api/websitetranslationservice/translate/website/${this.pluginOptions.api.clientId}/translate`
      }
      else {
        throw Error(`API version '${this.pluginOptions.api.version}' not recognized`)
      }

      return { url, data }
    }

    private async postTranslations (texts: Array<{text: string, meta: any}>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken, useBatchEndpoint:boolean = false) {
      const request = this.buildUrlAndPayload(texts, targetLanguage, pageUrl, useBatchEndpoint)

      const result = await axios.post<Array<ITranslation>>(
        request.url,
        request.data,
        {
          cancelToken: cancelToken,
          headers: {
            "X-Origin": window.location.href,
          }
        },
      )

      return result.data
    }

    private buildRepresentativeList (batch: Array<ITranslatableItem>) {
      const representativeByText = new Map<string, ITranslatableItem>()
      const representativeOrder: string[] = []

      batch.forEach(item => {
        const existing = representativeByText.get(item.text)

        if (!existing) {
          representativeByText.set(item.text, item)
          representativeOrder.push(item.text)
          return
        }

        if (!this.isTextType(existing) && this.isTextType(item)) {
          representativeByText.set(item.text, item)
        }
      })

      return representativeOrder
        .map(text => representativeByText.get(text))
        .filter(item => item !== undefined)
    }

    private buildDocumentFromRepresentatives (representatives: Array<ITranslatableItem>) {
      return representatives
        .map((item, index) => `<g${index + 1}>${item.text}</g${index + 1}>`)
        .join('\n')
    }

    private parseGroupedDocument (translatedDocument:string, expectedCount:number) {
      const idToTranslation = new Map<number, {translation: string, segmentId: number}>()
      const regex = new RegExp(WebsiteService.GROUP_TAG_REGEX.source, 'g')
      const matches: RegExpExecArray[] = []
      let match: RegExpExecArray

      while ((match = regex.exec(translatedDocument)) !== null) {
        matches.push(match)
      }

      if (matches.length !== expectedCount) {
        throw new Error('alignment-broken')
      }

      for (const match of matches) {
        const id = Number(match[1])
        const attributes = match[2] || ''
        const sidMatch = attributes.match(WebsiteService.GROUP_TAG_SID_REGEX)
        const sid = Number(sidMatch?.[1])

        if (!sidMatch || Number.isNaN(sid)) {
          throw new Error('alignment-broken')
        }

        idToTranslation.set(id, {
          translation: (match[3] || '').trim(),
          segmentId: sid
        })
      }

      for (let index = 1; index <= expectedCount; index++) {
        if (!idToTranslation.has(index)) {
          throw new Error('alignment-broken')
        }
      }

      return idToTranslation
    }

    private async translateUsingGroupedDocument (batch: Array<ITranslatableItem>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      const representatives = this.buildRepresentativeList(batch)
      if (representatives.length === 0) {
        return []
      }

      const document = this.buildDocumentFromRepresentatives(representatives)
      const translated = await this.postTranslations([
        {
          text: document,
          meta: {
            seo: false,
            tag: 'BATCH',
            attr: null,
            refAttr: null
          }
        }
      ], targetLanguage, pageUrl, cancelToken, true)

      const translatedDocument = translated?.[0]?.translation
      if (typeof translatedDocument !== 'string') {
        throw new Error('alignment-broken')
      }

      const idToTranslation = this.parseGroupedDocument(translatedDocument, representatives.length)
      const translationByText = new Map<string, {translation: string, segmentId: number}>()

      representatives.forEach((item, index) => {
        const translatedItem = idToTranslation.get(index + 1)
        if (!translatedItem) {
          throw new Error('alignment-broken')
        }

        translationByText.set(item.text, translatedItem)
      })

      return batch.map(item => {
        const translatedItem = translationByText.get(item.text)
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

    private async translateLegacy (batch: Array<ITranslatableItem>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      const texts = batch.map(item => {
        // This is temporary solution
        let isSEO = false
        if (item.type === TranslatableItemType.ELEMENT_SEO || item.type === TranslatableItemType.ATTRIBUTE_SEO) {
          isSEO = true
        }

        return {
          text: item.text,
          meta: {
            seo: isSEO,
            tag: item.tagName,
            attr: item.attributeName,
            refAttr: item.description
          }
        }
      })

      return await this.postTranslations(texts, targetLanguage, pageUrl, cancelToken)
    }
}

export default WebsiteService
