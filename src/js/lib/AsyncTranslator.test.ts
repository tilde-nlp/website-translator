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
  const translator = new AsyncTranslator(
    service as unknown as WebsiteService,
    options,
    domTranslator as unknown as DOMTranslation,
    jest.fn(),
    jest.fn(),
    new TranslationCache(),
    new BehaviorSubject<ILocalizedLanguage>(localization.en)
  )

  translator.translate('lv', new Map(), [])

  return {
    cancel: () => translator.cancel(),
    completeDiscovery: () => onDiscoveryCompleted(),
    discover: (ranges: TranslationTextRange[]) => onDiscovered(ranges, TranslationPriority.Text),
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

  it('does not fire when execution is cancelled', async () => {
    const response = deferred<any[]>()
    const harness = createHarness(TranslationMode.SINGLE_BATCH)
    harness.service.translate.mockReturnValue(response.promise)

    harness.discover([createRange('Cancelled')])
    harness.completeDiscovery()
    harness.cancel()
    response.resolve([{
      translation: 'Atcelts',
      segmentId: 1
    }])
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(onCrawlerComplete).not.toHaveBeenCalled()
  })
})
