import axios, { CancelToken } from 'axios'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'
import { ITranslation } from '../interfaces/services/websiteService/ITranslation'
import IConfiguration from '../interfaces/services/websiteService/v2/IConfiguration'
import IWebsiteConfiguration from '../interfaces/services/websiteService/IWebsiteConfiguration'
import IWebsite from '../interfaces/services/websiteService/v1/IWebsite'

class WebsiteService {
    private pluginOptions:IPluginOptions

    constructor (
      pluginOptions:IPluginOptions
    ) {
      this.pluginOptions = pluginOptions
    }

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
        website.languages = response.data.languages.map(item => item.trgLang)
      }
      else {
        throw Error(`API version '${this.pluginOptions.api.version}' not recognized`)
      }

      return website
    }

    async translate (batch: Array<ITranslatableItem>, targetLanguage:string, pageUrl:string, cancelToken: CancelToken) {
      const data = {
        lang: targetLanguage,
        URL: pageUrl,
        texts: batch.map(item => {
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
      }
      let url:string
      if (this.pluginOptions.api.version === 1) {
        url = `${this.pluginOptions.api.url}/api/translate/website/${this.pluginOptions.api.clientId}/translate`
      }
      else if (this.pluginOptions.api.version === 2) {
        url = `${this.pluginOptions.api.url}/api/websitetranslationservice/translate/website/${this.pluginOptions.api.clientId}/translate`
      }
      else {
        throw Error(`API version '${this.pluginOptions.api.version}' not recognized`)
      }

      const result = await axios.post<Array<ITranslation>>(
        url,
        data,
        {
          cancelToken: cancelToken
        }
      )

      return result.data
    }
}

export default WebsiteService
