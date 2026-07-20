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
      // const website:IWebsiteConfiguration = {
      //   srcLang: null,
      //   languages: []
      // }
      // if (this.pluginOptions.api.version === 1) {
      //   const response = await axios.get<IWebsite>(`${this.pluginOptions.api.url}/api/translate/website/${this.pluginOptions.api.clientId}`)
      //   website.srcLang = response.data.sourceLanguage
      //   website.languages = response.data.targetLanguages
      // }
      // else if (this.pluginOptions.api.version === 2) {
      //   const response = await axios.get<IConfiguration>(`${this.pluginOptions.api.url}/api/configurationservice/configuration/${this.pluginOptions.api.clientId}`)

      //   website.srcLang = response.data.srcLang
      //   website.languages = response.data.languages.map(item => normalizeLanguageCode(item.trgLang))
      // }
      // else if (this.pluginOptions.api.version === 3) {
      //   const response = await axios.get<IConfiguration3>(`${this.pluginOptions.api.url}/api/configurationservice/configuration/${this.pluginOptions.api.clientId}`)

      //   website.srcLang = response.data.languageDirections[0]?.srcLang
      //   website.languages = response.data.languageDirections.map(item => normalizeLanguageCode(item.trgLang))
      // }
      // else {
      //   throw Error(`API version '${this.pluginOptions.api.version}' not recognized`)
      // }

      return {
        srcLang: 'en',
        languages: ['lv']
      } as IWebsiteConfiguration
    }

    async translate (batch: Array<ITranslatableItem>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      return await this.translateUsingGroupedDocument(batch, targetLanguage, pageUrl, cancelToken)
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

      const url = `${this.pluginOptions.api.url}/translate/website/${this.pluginOptions.api.clientId}/translate/batch`

      return { url, data }
    }

    private async postTranslations (texts: Array<{text: string, meta: any}>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      const request = this.buildUrlAndPayload(texts, targetLanguage, pageUrl)

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
      if (batch.length === 0) {
        return []
      }

      const isSeoBatch = batch.every(item => this.isSeoType(item))
      const document = this.buildDocumentFromRepresentatives(batch)
      const translated = await this.postTranslations([
        {
          text: document,
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
        throw new Error('alignment-broken')
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
