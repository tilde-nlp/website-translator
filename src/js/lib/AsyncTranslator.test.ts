import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { BehaviorSubject } from 'rxjs'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { TranslationMode } from '../enums/TranslationMode'
import { TranslationPriority } from '../enums/TranslationPriority'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ILocalizedLanguage } from '../interfaces/ILocalizedLanguage'
import { TranslationTextRange } from '../models/TranslationTextRange'
import { pluginOptions } from '../models/PluginOptions'
import localization from '../../localization/localization'
import WebsiteService from '../services/WebsiteService'
import AsyncTranslator from './AsyncTranslator'
import { DOMTranslation } from './DOMTranslation'
import TranslationCache from './TranslationCache'

const CRAWLER_COMPLETE_EVENT = 'wt-crawler-discovery-complete'
const TRANSLATION_FINISHED_EVENT = 'translation-finished'

function deferred<T> () {
  let resolveDeferred: (value: T) => void
  let rejectDeferred: (reason?: any) => void
  const promise = new Promise<T>((resolve, reject) => {
    resolveDeferred = resolve
    rejectDeferred = reject
  })

  return {
    promise,
    reject: rejectDeferred,
    resolve: resolveDeferred
  }
}

function createRange (text: string) {
  const element = document.createElement('p')
  element.textContent = text
  document.body.appendChild(element)

  const range = new TranslationTextRange()
  range.element = element
  range.html = text
  range.type = TranslatableItemType.ELEMENT
  range.attributes = []

  return range
}

function createHarness (mode: TranslationMode) {
  let onDiscovered: (items: TranslationTextRange[], priority: TranslationPriority) => void
  let onDiscoveryCompleted: () => void
  const options: IPluginOptions = {
    ...pluginOptions,
    translation: {
      ...pluginOptions.translation,
      mode
    }
  }
  const service: any = {
    reportWordCountPage: jest.fn(),
    translate: jest.fn()
  }
  const domTranslator = {
    applySeo: jest.fn(),
    applyTranslationToElement: jest.fn((range: TranslationTextRange, source: string, translated: string) => {
      range.element.textContent = translated
    }),
    applyUrlLocalization: jest.fn(),
    prepareDOM: jest.fn((
      language: string,
      discovered: (items: TranslationTextRange[], priority: TranslationPriority) => void,
      completed: () => void
    ) => {
      onDiscovered = discovered
      onDiscoveryCompleted = completed
    }),
    restoreDOM: jest.fn(),
    setLanguage: jest.fn()
  }
  const processedTranslations = new Map()
  const translator = new AsyncTranslator(
    service as unknown as WebsiteService,
    options,
    domTranslator as unknown as DOMTranslation,
    jest.fn(),
    jest.fn(),
    new TranslationCache(),
    new BehaviorSubject<ILocalizedLanguage>(localization.en)
  )

  translator.translate('lv', processedTranslations, [])

  return {
    cancel: () => translator.cancel(),
    completeDiscovery: () => onDiscoveryCompleted(),
    discover: (ranges: TranslationTextRange[]) => onDiscovered(ranges, TranslationPriority.Text),
    navigate: () => translator.onNavigation(),
    processedTranslations,
    service
  }
}

async function waitFor (condition: () => boolean) {
  for (let attempt = 0; attempt < 20; attempt++) {
    if (condition()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  throw new Error('Condition was not met')
}

describe('AsyncTranslator crawler discovery completion', () => {
  let onCrawlerComplete: ReturnType<typeof jest.fn>
  let onTranslationFinished: ReturnType<typeof jest.fn>

  beforeEach(() => {
    document.body.innerHTML = ''
    onCrawlerComplete = jest.fn()
    onTranslationFinished = jest.fn()
    document.addEventListener(CRAWLER_COMPLETE_EVENT, onCrawlerComplete)
    document.addEventListener(TRANSLATION_FINISHED_EVENT, onTranslationFinished)
  })

  afterEach(() => {
    document.removeEventListener(CRAWLER_COMPLETE_EVENT, onCrawlerComplete)
    document.removeEventListener(TRANSLATION_FINISHED_EVENT, onTranslationFinished)
    document.body.innerHTML = ''
  })

  it('fires after the delayed API response is inserted into the DOM', async () => {
    const response = deferred<any[]>()
    const harness = createHarness(TranslationMode.SINGLE_BATCH)
    const range = createRange('Delayed content')
    let dispatchedEvent: Event
    document.addEventListener(CRAWLER_COMPLETE_EVENT, event => {
      dispatchedEvent = event
    }, {
      once: true
    })
    harness.service.translate.mockReturnValue(response.promise)

    harness.discover([range])
    harness.completeDiscovery()

    expect(onCrawlerComplete).not.toHaveBeenCalled()
    expect(range.element.textContent).toBe('Delayed content')

    response.resolve([{
      translation: 'Aizkavēts saturs',
      segmentId: 1
    }])
    await waitFor(() => onCrawlerComplete.mock.calls.length === 1)

    expect(range.element.textContent).toBe('Aizkavēts saturs')
    expect(dispatchedEvent).toBeInstanceOf(CustomEvent)
    expect(onTranslationFinished).toHaveBeenCalledTimes(1)
  })

  it('fires once despite repeated DOM discovery callbacks', async () => {
    const harness = createHarness(TranslationMode.SINGLE_BATCH)
    harness.service.translate.mockResolvedValue([
      {
        translation: 'Pirmais',
        segmentId: 1
      },
      {
        translation: 'Otrais',
        segmentId: 2
      }
    ])

    harness.discover([createRange('First')])
    harness.discover([createRange('Second')])
    harness.completeDiscovery()

    await waitFor(() => onCrawlerComplete.mock.calls.length === 1)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(onCrawlerComplete).toHaveBeenCalledTimes(1)
  })

  it('fires in word-count mode only after reporting completes', async () => {
    const response = deferred<void>()
    const harness = createHarness(TranslationMode.WORD_COUNT)
    harness.service.reportWordCountPage.mockReturnValue(response.promise)

    harness.discover([createRange('Count these words')])
    harness.completeDiscovery()
    expect(onCrawlerComplete).not.toHaveBeenCalled()

    response.resolve()
    await waitFor(() => onCrawlerComplete.mock.calls.length === 1)
    expect(onCrawlerComplete).toHaveBeenCalledTimes(1)
  })

  it('does not fire when the API request fails', async () => {
    const harness = createHarness(TranslationMode.SINGLE_BATCH)
    harness.service.translate.mockRejectedValue({
      response: {
        status: 404
      }
    })

    harness.discover([createRange('Failure')])
    harness.completeDiscovery()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(onCrawlerComplete).not.toHaveBeenCalled()
  })

  it('does not modify the DOM or fire completion after navigation invalidates the execution', async () => {
    const response = deferred<any[]>()
    const harness = createHarness(TranslationMode.SINGLE_BATCH)
    const range = createRange('Cancelled')
    harness.service.translate.mockReturnValue(response.promise)

    harness.discover([range])
    harness.completeDiscovery()
    harness.navigate()
    response.resolve([{
      translation: 'Atcelts',
      segmentId: 1
    }])
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(range.element.textContent).toBe('Cancelled')
    expect(onCrawlerComplete).not.toHaveBeenCalled()
  })

  it('does not start queued batches after navigation invalidates the execution', async () => {
    const response = deferred<any[]>()
    const harness = createHarness(TranslationMode.CHUNKED)
    const ranges = Array.from({ length: 41 }, (_, index) => createRange(`Item ${index}`))
    harness.service.translate.mockReturnValue(response.promise)

    harness.discover(ranges)
    await waitFor(() => harness.service.translate.mock.calls.length === 1)
    harness.navigate()
    response.resolve(Array.from({ length: 40 }, (_, index) => ({
      translation: `Translated ${index}`,
      segmentId: index
    })))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(harness.service.translate).toHaveBeenCalledTimes(1)
    expect(ranges.every((range, index) => range.element.textContent === `Item ${index}`)).toBe(true)
  })

  it('does not flush delayed text after navigation invalidates the execution', () => {
    jest.useFakeTimers()
    const harness = createHarness(TranslationMode.CHUNKED)
    const range = createRange('Pending text')
    harness.service.translate.mockResolvedValue([{
      translation: 'Gaidošs teksts',
      segmentId: 1
    }])

    harness.discover([range])
    harness.navigate()
    jest.advanceTimersByTime(5000)

    expect(harness.service.translate).not.toHaveBeenCalled()
    expect(range.element.textContent).toBe('Pending text')
    jest.useRealTimers()
  })

  it('removes detached processed translation mappings during discovery', () => {
    const harness = createHarness(TranslationMode.CHUNKED)
    const detachedElement = document.createElement('p')
    const connectedElement = document.createElement('p')
    document.body.appendChild(connectedElement)
    harness.processedTranslations.set('detached', {
      element: detachedElement
    })
    harness.processedTranslations.set('connected', {
      element: connectedElement
    })

    harness.discover([])

    expect([...harness.processedTranslations.keys()]).toEqual(['connected'])
  })
})
