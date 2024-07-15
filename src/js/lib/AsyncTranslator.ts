import { DOMTranslation } from './DOMTranslation'
import axios, { CancelTokenSource } from 'axios'
import { Logger } from '../Logger'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'
import { TranslationTextRange } from '../models/TranslationTextRange'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { TranslationQueue } from './TranslationQueue'
import WebsiteService from '../services/WebsiteService'
import { IDomTranslation } from '../interfaces/ITranslation'
import { BehaviorSubject } from 'rxjs'
import { ILocalizedLanguage } from '../interfaces/ILocalizedLanguage'
import TranslationCache from './TranslationCache'
import { TranslationPriority } from '../enums/TranslationPriority'
import { ITranslationError } from '../interfaces/ITranslationError'

class AsyncTranslator {
  private maxCharactersInBatch: number;
  private batchSize: number;
  private concurrency: number;
  private queue: TranslationQueue;
  private cancelToken: CancelTokenSource;
  private logger: Logger;
  private translationRetries: number;
  private itemsTranslated: number;
  private itemsTotal:number;
  private retryTimeout = 1000;
  private batchesCount: number;
  private translationFinishedEvent = new Event("translation-finished");

  constructor (
    private readonly websiteService:WebsiteService,
    private readonly pluginOptions:IPluginOptions,
    private readonly domTranslator:DOMTranslation,
    private readonly onProgress:(percent: number) =>void,
    private readonly onError:(err:ITranslationError) => void,
    private readonly translationCache:TranslationCache,
    private readonly uiLocalization: BehaviorSubject<ILocalizedLanguage>
  ) {
    this.maxCharactersInBatch = 1000
    this.batchSize = 20
    this.concurrency = 1
    this.translationRetries = 3
    this.queue = null
    this.cancelToken = null

    this.logger = new Logger(pluginOptions.debug, 'AsyncTranslator')
  }

  /**
     * Translate elements and their attributes replacing content in web page with new translations
     */
  public async translate (
    targetLanguage:string,
    processedTranslations: Map<string, IDomTranslation>,
    availableLocales: string[]
  ) {
    const translationStart = new Date().getTime()
    this.logger.debug('Scheduling translation')

    // Make sure there is no previous translation going on
    this.cancel()

    this.domTranslator.applySeo(targetLanguage, availableLocales)
    this.translationCache.clear()

    this.itemsTranslated = 0
    this.itemsTotal = 0

    const localCancelToken = (this.cancelToken = axios.CancelToken.source())

    this.domTranslator.applyUrlLocalization(targetLanguage)

    this.queue = new TranslationQueue(
      this.pluginOptions,
      async (queue: TranslationQueue, batchNumber:number, batch:ITranslatableItem[], priority:TranslationPriority) => {
        await this.onQueueBatchScheduled(
          queue,
          batch,
          processedTranslations,
          localCancelToken,
          targetLanguage,
          priority
        )
      },
      this.concurrency
    )

    this.domTranslator.prepareDOM(
      targetLanguage,
      this.onTranslationItemDiscovered.bind(this)
    )

    await this.queue.drain()

    const translationTime = new Date().getTime() - translationStart
    this.logger.debug(`Translation finished in ${translationTime / 1000}s`)
  }

  /**
     * Cancel Translation
     */
  public cancel () {
    this.logger.debug('Canceling previous translations')
    if (this.queue !== null) {
      this.queue.kill()
    }
    if (this.cancelToken !== null) {
      this.cancelToken.cancel()
    }

    this.domTranslator.restoreDOM()
    this.domTranslator.applyUrlLocalization()
  }

  /**
     * Callback when translation batch is scheduled for translation
     */
  private async onQueueBatchScheduled (
    queue: TranslationQueue,
    batch:ITranslatableItem[],
    processedTranslations:Map<string, IDomTranslation>,
    localCancelToken:CancelTokenSource,
    targetLanguage:string,
    priority: TranslationPriority
  ) {
    for (let retry = 0; retry < this.translationRetries; retry++) {
      try {
        // TODO: what about iframe urls?
        const url = document.location.pathname

        const translations = await this.websiteService.translate(batch, targetLanguage, url, localCancelToken.token)

        this.processTranslation(batch, translations, targetLanguage, processedTranslations)

        this.itemsTranslated++
        this.onProgress(this.getProgress())

        break
      }
      catch (err) {
        if (axios.isCancel(err)) {
          return
        }

        if (err.response && err.response.status === 404) {
          const err: ITranslationError = {
            ErrorCode: '',
            ErrorMessage: this.uiLocalization.value.alerts.errors.translationSubStatus.resourceNotFound
          }
          this.onError(err)
          break
        }
        else {
          if (retry + 1 >= this.translationRetries) {
            if (err.response && err.response.status === 504) {
              // skip this segment and continue translation
              this.onProgress(this.getProgress())

              this.logger.warn('Translation timed out')

              queue.addItemAsync(batch, priority, this.retryTimeout)
            }
            else {
              this.logger.error('Failed to translate, no retries left')
              this.cancel()

              if (err.response) {
                const error : ITranslationError = {
                  ErrorCode: err.response.status,
                  ErrorMessage: err.response.data
                }
                // API error
                this.onError(error)
              }
              else {
                // WTW error
                this.onError(err)
              }

              throw err
            }
          }
          else {
            this.logger.warn(`Failed to translate, retries left: ${this.translationRetries - retry - 1}`)
          }
        }
      }
    }

    this.queue.onItemProcessed()
  }

  private getProgress () {
    if (this.itemsTotal === 0) {
      return 1
    }
    if (this.batchesCount === 0 && (this.itemsTranslated / this.itemsTotal) === 1) {
      document.dispatchEvent(this.translationFinishedEvent);
    }
    
    return this.itemsTranslated / this.itemsTotal
  }

  private onTranslationItemDiscovered (items: Array<TranslationTextRange>, priority: TranslationPriority) {
    const batches = this.getBatches(items)
    this.batchesCount = batches.length;

    if (batches.length > 0) {
      const queueBatches = this.queue.getItems()

      for (const batch of queueBatches) {
        this.cancelBatch(batch)
      }

      if (this.queue.size() > 0) {
        const itemsRemoved = this.queue.clear(TranslationPriority.Text)

        this.itemsTotal -= itemsRemoved
      }

      for (const batch of batches) {
        this.queue.addItem(batch, priority)
      }
      this.itemsTotal += batches.length

      this.onProgress(this.getProgress())
    }
    else {
      this.batchesCount = 0;
      this.onProgress(this.getProgress())
    }
  }

  private cancelBatch (batch: Array<ITranslatableItem>) {
    for (const item of batch) {
      if (item.translatableItem.startMarker) {
        this.domTranslator.restorePartialDocument(item.translatableItem.startMarker)
      }
    }
  }

  private minimizeText (text:string) {
    let htmlString = text.replace(/\s+/g, ' ')
    htmlString = htmlString.replace(/&nbsp;/g, ' ')

    return htmlString
  }

  /**
   * Split all translatable texts into batches with max fixed size text in it
   */
  private getBatches (translationItems:Array<TranslationTextRange>) {
    const translatableItems: Array<ITranslatableItem> = []
    let translatableItem:ITranslatableItem

    translationItems.forEach(element => {
      if (element.type === TranslatableItemType.ELEMENT || element.type === TranslatableItemType.ELEMENT_SEO) {
        translatableItem = {
          translatableItem: element,
          type: element.type,
          attributeName: null,
          description: null,
          text: this.minimizeText(element.html),
          tagName: element.startMarker.parentElement.tagName
        }
        if (translatableItem.text.trim().length > 0) {
          translatableItems.push(translatableItem)
        }
      }
      else {
        element.attributes.forEach(attribute => {
          translatableItem = {
            translatableItem: element,
            type: attribute.type,
            attributeName: attribute.translationAtttibuteName,
            description: attribute.descriptionAttributeValue,
            text: this.minimizeText(attribute.translationAtttibuteValue),
            tagName: element.element.tagName
          }
          if (translatableItem.text.trim().length > 0) {
            translatableItems.push(translatableItem)
          }
        })
      }
    })

    const batches:Array<Array<ITranslatableItem>> = []
    let batch:Array<ITranslatableItem> = []
    let batchSize:number = 0
    let charactersInBatch:number = 0

    translatableItems.forEach(translatableItem => {
      if (batchSize < this.batchSize) {
        batch.push(translatableItem)
        batchSize++
        charactersInBatch += translatableItem.text.length
      }

      if (
        batchSize === this.batchSize ||
        charactersInBatch >= this.maxCharactersInBatch
      ) {
        batches.push(batch)
        batch = []
        batchSize = 0
        charactersInBatch = 0
      }
    })

    if (batchSize > 0) {
      batches.push(batch)
    }
    return batches
  }

  /**
   * Replace DOM with translated texts
   * @param sourceBatch
   * @param translations
   * @param targetLanguage
   * @param translations
   */

  private processTranslation (
    sourceBatch: Array<ITranslatableItem>,
    translatedBatch:Array<any>,
    targetLanguage: string,
    translations:Map<string, IDomTranslation>
  ) {
    this.logger.debug('Processing translations')
    sourceBatch.forEach((element, index) => {
      if (element.translatableItem.element) {
        this.domTranslator.setLanguage(element.translatableItem.element, targetLanguage)
      }
      else {
        this.domTranslator.setLanguage(element.translatableItem.startMarker, targetLanguage)
      }
      if (element.type === TranslatableItemType.ELEMENT || element.type === TranslatableItemType.ELEMENT_SEO) {
        this.domTranslator.applyTranslationToElement(
          element.translatableItem,
          element.text,
          translatedBatch[index].translation,
          translatedBatch[index].segmentId
        )

        const translation: IDomTranslation = {
          type: element.type,
          sourceHTML: element.text,
          translatedHTML: translatedBatch[index].translation,
          description: '',
          element: element.translatableItem.startMarker,
          tagNames: element.translatableItem.tagNames
        }
        translations.set(element.text, translation)
      }
      else if (element.type === TranslatableItemType.ATTRIBUTE || element.type === TranslatableItemType.ATTRIBUTE_SEO) {
        this.domTranslator.applyAttributeTranslationToElement(
          element.translatableItem.element,
          element.attributeName,
          translatedBatch[index].translation
        )
        const translation: IDomTranslation = {
          type: element.type,
          sourceHTML: element.text,
          translatedHTML: translatedBatch[index].translation,
          description: element.description,
          element: element.translatableItem.element,
          tagNames: element.translatableItem.tagNames
        }
        translations.set(element.text, translation)
      }
      else {
        this.logger.error(`Translation item type: '${element.type}' not recognized`)
      }
    })
  }
}

export default AsyncTranslator
