import axios, { CancelToken } from 'axios'
import { TranslatableItemType } from '../Enums/TranslatableItemType'
import { IPluginOptions } from '../Interfaces/IPluginOptions'
import { ITranslatableItem } from '../Interfaces/ITranslatableItem'
import { ITranslation } from '../interfaces/Services/WebsiteService/ITranslation'
import IWebsite from '../interfaces/Services/WebsiteService/IWebsite'

class WebsiteService {
    private pluginOptions:IPluginOptions

    constructor (
      pluginOptions:IPluginOptions
    ) {
      this.pluginOptions = pluginOptions
    }

    async getWebsite () {
      const result = await axios.get<IWebsite>(`${this.pluginOptions.api.services.Translation}/${this.pluginOptions.api.clientId}`)

      return result.data
    }

    async translate (batch: Array<ITranslatableItem>, targetLanguage:string, url:string, cancelToken: CancelToken) {
      const data = {
        lang: targetLanguage,
        URL: url,
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
      const result = await axios.post<Array<ITranslation>>(
        `${this.pluginOptions.api.services.Translation}/${this.pluginOptions.api.clientId}/translate`,
        data,
        {
          cancelToken: cancelToken
        }
      )

      return result.data
    }

    async addTranslation (segmentId:number, text:string, url:string) {
      const data = {
        text: text,
        URL: url
      }
      const result = await axios.post(
        `${this.pluginOptions.api.services.Translation}/${this.pluginOptions.api.clientId}/segments/${segmentId}/${this.pluginOptions.currentLanguage}`,
        data
      )

      return result.data
    }

    async deleteTranslation () {
      const result = await axios.get(`${this.pluginOptions.api.services.Translation}/${this.pluginOptions.api.clientId}/translate`)

      return result.data
    }
}

export default WebsiteService
