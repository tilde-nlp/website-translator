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
import { TranslationMode } from '../enums/TranslationMode'

interface IChunkSettings {
  maxWordsPerChunk: number
  maxSegmentsPerChunk: number
}

class AsyncTranslator {
  private static readonly MAX_WORDS_PER_CHUNK = 2000
  private static readonly MAX_SEGMENTS_PER_CHUNK = 40
  private static readonly MIN_SEGMENTS_BEFORE_FLUSH = 10
  private static readonly MIN_SEGMENTS_FLUSH_INTERVAL_MS = 5000
  private concurrency: number;
  private queue: TranslationQueue;
  private cancelToken: CancelTokenSource;
  private logger: Logger;
  private translationRetries: number;
  private itemsTranslated: number;
  private itemsTotal:number;
  private retryTimeout = 1000;
  private batchesCount: number;
  private static readonly TRANSLATION_FINISHED_EVENT = 'translation-finished'
  private translationFinishedDispatched: boolean
  private pendingTextRanges: Array<TranslationTextRange>
  private pendingTextFlushTimer: ReturnType<typeof setTimeout> | null
  private pendingWholeSiteRanges: Array<TranslationTextRange>
  private singleBatchQueued: boolean
  private singleBatchDiscoveryCompleted: boolean

  constructor (
    private readonly websiteService:WebsiteService,
    private readonly pluginOptions:IPluginOptions,
    private readonly domTranslator:DOMTranslation,
    private readonly onProgress:(percent: number) =>void,
    private readonly onError:(err:ITranslationError) => void,
    private readonly translationCache:TranslationCache,
    private readonly uiLocalization: BehaviorSubject<ILocalizedLanguage>
  ) {
    this.concurrency = 1
    this.translationRetries = 3
    this.queue = null
    this.cancelToken = null
    this.pendingTextRanges = []
    this.pendingTextFlushTimer = null
    this.pendingWholeSiteRanges = []
    this.singleBatchQueued = false
    this.singleBatchDiscoveryCompleted = false
    this.translationFinishedDispatched = false

    this.logger = new Logger(pluginOptions.debug, 'AsyncTranslator')
  }

  private getChunkSettings (): IChunkSettings {
    return {
      maxWordsPerChunk: AsyncTranslator.MAX_WORDS_PER_CHUNK,
      maxSegmentsPerChunk: AsyncTranslator.MAX_SEGMENTS_PER_CHUNK
    }
  }

  private getSeoChunkSettings (): IChunkSettings {
    return {
      maxWordsPerChunk: Number.MAX_SAFE_INTEGER,
      maxSegmentsPerChunk: Number.MAX_SAFE_INTEGER
    }
  }

  private countWords (text:string) {
    const normalized = text.trim()
    if (normalized.length === 0) {
      return 0
    }

    return normalized.split(/\s+/).length
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
    this.pendingTextRanges = []
    this.pendingWholeSiteRanges = []
    this.singleBatchQueued = false
    this.singleBatchDiscoveryCompleted = false
    this.translationFinishedDispatched = false
    if (this.pendingTextFlushTimer) {
      clearTimeout(this.pendingTextFlushTimer)
      this.pendingTextFlushTimer = null
    }

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
      this.onTranslationItemDiscovered.bind(this),
      this.onSingleBatchDiscoveryCompleted.bind(this)
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
    if (this.pendingTextFlushTimer) {
      clearTimeout(this.pendingTextFlushTimer)
      this.pendingTextFlushTimer = null
    }
    this.pendingTextRanges = []
    this.pendingWholeSiteRanges = []
    this.singleBatchQueued = false
    this.singleBatchDiscoveryCompleted = false
    this.translationFinishedDispatched = false

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

    const progress = this.itemsTranslated / this.itemsTotal
    const isSingleBatchMode = this.pluginOptions.translation.mode === TranslationMode.SINGLE_BATCH
    const canEmitFinished = isSingleBatchMode || this.batchesCount === 0

    if (!this.translationFinishedDispatched && canEmitFinished && progress === 1) {
      document.dispatchEvent(new Event(AsyncTranslator.TRANSLATION_FINISHED_EVENT));
      this.translationFinishedDispatched = true
    }

    return progress
  }

  private onTranslationItemDiscovered (items: Array<TranslationTextRange>, priority: TranslationPriority) {
    if (this.pluginOptions.translation.mode === TranslationMode.SINGLE_BATCH) {
      this.enqueueWholeSiteSingleBatch(items)
      return
    }

    if (priority === TranslationPriority.Text) {
      this.enqueueTextItemsWithMinimumBatch(items)
      return
    }

    this.enqueueDiscoveredItems(items, priority)
  }

  private onSingleBatchDiscoveryCompleted () {
    this.singleBatchDiscoveryCompleted = true
    this.flushWholeSiteSingleBatch()
  }

  private enqueueWholeSiteSingleBatch (items: Array<TranslationTextRange>) {
    if (this.singleBatchQueued || !items || items.length === 0) {
      return
    }

    for (const item of items) {
      this.pendingWholeSiteRanges.push(item)
    }

    if (this.pendingWholeSiteRanges.length === 0) {
      return
    }

    if (this.singleBatchDiscoveryCompleted) {
      this.flushWholeSiteSingleBatch()
    }
  }

  private flushWholeSiteSingleBatch () {
    if (this.singleBatchQueued || this.pendingWholeSiteRanges.length === 0) {
      return
    }

    const allItems = [...this.pendingWholeSiteRanges]
    this.pendingWholeSiteRanges = []

    const chunkSettings = this.getSeoChunkSettings()
    const batches = this.getBatches(allItems, chunkSettings)
    if (batches.length === 0) {
      return
    }

    const mergedBatch = batches.reduce((acc, batch) => acc.concat(batch), [] as ITranslatableItem[])
    this.queue.addItem(mergedBatch, TranslationPriority.SEO)
    this.itemsTotal += 1
    this.batchesCount = 1
    this.singleBatchQueued = true

    this.onProgress(this.getProgress())
  }

  private enqueueTextItemsWithMinimumBatch (items: Array<TranslationTextRange>) {
    for (const item of items) {
      this.pendingTextRanges.push(item)
    }

    const pendingItems = [...this.pendingTextRanges]
    const pendingSegmentCount = this.countTranslatableItems(pendingItems)

    if (pendingSegmentCount >= AsyncTranslator.MIN_SEGMENTS_BEFORE_FLUSH) {
      if (this.pendingTextFlushTimer) {
        clearTimeout(this.pendingTextFlushTimer)
        this.pendingTextFlushTimer = null
      }
      this.flushPendingTextItems()
      return
    }

    // Under threshold: flush only after inactivity window.
    if (this.pendingTextFlushTimer) {
      clearTimeout(this.pendingTextFlushTimer)
    }

    this.pendingTextFlushTimer = setTimeout(() => {
      this.pendingTextFlushTimer = null
      this.flushPendingTextItems()
    }, AsyncTranslator.MIN_SEGMENTS_FLUSH_INTERVAL_MS)
  }

  private flushPendingTextItems () {
    if (this.pendingTextRanges.length === 0) {
      return
    }

    const pendingItems = [...this.pendingTextRanges]
    this.pendingTextRanges = []

    this.enqueueDiscoveredItems(pendingItems, TranslationPriority.Text)
  }

  private enqueueDiscoveredItems (items: Array<TranslationTextRange>, priority: TranslationPriority) {
    const chunkSettings = priority === TranslationPriority.SEO
      ? this.getSeoChunkSettings()
      : this.getChunkSettings()
    const batches = this.getBatches(items, chunkSettings)
    this.batchesCount = batches.length;

    if (batches.length > 0) {
      if (priority === TranslationPriority.Text) {
        const queueBatches = this.queue.getItems()

        for (const batch of queueBatches) {
          this.cancelBatch(batch)
        }

        if (this.queue.size() > 0) {
          const itemsRemoved = this.queue.clear(TranslationPriority.Text)

          this.itemsTotal -= itemsRemoved
        }
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

  private countTranslatableItems (translationItems:Array<TranslationTextRange>) {
    let count = 0

    translationItems.forEach(element => {
      if (element.type === TranslatableItemType.ELEMENT || element.type === TranslatableItemType.ELEMENT_SEO) {
        if (this.minimizeText(element.html).trim().length > 0) {
          count++
        }
      }
      else {
        element.attributes.forEach(attribute => {
          if (this.minimizeText(attribute.translationAtttibuteValue).trim().length > 0) {
            count++
          }
        })
      }
    })

    return count
  }

  /**
    * Split all translatable texts into chunks by max words or max segments.
   */
  private buildTranslatableItems (translationItems:Array<TranslationTextRange>) {
    const translatableItems: Array<ITranslatableItem> = []
    let translatableItem:ITranslatableItem

    translationItems.forEach(element => {
      const resolvedTagName = element.startMarker?.parentElement?.tagName || element.element?.tagName || ''

      if (element.type === TranslatableItemType.ELEMENT || element.type === TranslatableItemType.ELEMENT_SEO) {
        translatableItem = {
          translatableItem: element,
          type: element.type,
          attributeName: null,
          description: element.type === TranslatableItemType.ELEMENT ? null : resolvedTagName,
          text: this.minimizeText(element.html),
          tagName: resolvedTagName
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
            tagName: resolvedTagName
          }
          if (translatableItem.text.trim().length > 0) {
            translatableItems.push(translatableItem)
          }
        })
      }
    })

    return translatableItems
  }

  private getBatches (translationItems:Array<TranslationTextRange>, chunkSettings:IChunkSettings) {
    const translatableItems = this.buildTranslatableItems(translationItems)

    const batches:Array<Array<ITranslatableItem>> = []
    let batch:Array<ITranslatableItem> = []
    let wordsInBatch:number = 0
    let segmentsInBatch:number = 0

    translatableItems.forEach(translatableItem => {
      const itemWordCount = this.countWords(translatableItem.text)
      const nextSegmentCount = segmentsInBatch + 1
      const nextWordCount = wordsInBatch + itemWordCount

      const reachedSegmentLimit = segmentsInBatch > 0 && nextSegmentCount > chunkSettings.maxSegmentsPerChunk
      const reachedWordLimit = wordsInBatch > 0 && nextWordCount > chunkSettings.maxWordsPerChunk

      if (reachedSegmentLimit || reachedWordLimit) {
        batches.push(batch)
        batch = []
        wordsInBatch = 0
        segmentsInBatch = 0
      }

      batch.push(translatableItem)
      segmentsInBatch++
      wordsInBatch += itemWordCount

      if (
        segmentsInBatch >= chunkSettings.maxSegmentsPerChunk ||
        wordsInBatch >= chunkSettings.maxWordsPerChunk
      ) {
        batches.push(batch)
        batch = []
        wordsInBatch = 0
        segmentsInBatch = 0
      }
    })

    if (batch.length > 0) {
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
