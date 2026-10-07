import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { TranslationMode } from '../enums/TranslationMode'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { TranslationTextRange } from '../models/TranslationTextRange'
import { pluginOptions } from '../models/PluginOptions'
import { DOMTranslation } from './DOMTranslation'

const DEFAULT_DISCOVERY_DELAY_MS = 5000

function createOptions (mode: TranslationMode, discoveryDelay?: number): IPluginOptions {
  const options: IPluginOptions = {
    ...pluginOptions,
    translation: {
      ...pluginOptions.translation,
      mode,
      dynamicContentDiscoveryDelayMs: discoveryDelay
    }
  }

  if (discoveryDelay === undefined) {
    delete options.translation.dynamicContentDiscoveryDelayMs
  }

  return options
}

function startDiscovery (mode: TranslationMode, discoveryDelay?: number) {
  const onCompleted = jest.fn()
  const translator = new DOMTranslation(
    createOptions(mode, discoveryDelay),
    jest.fn(),
    jest.fn(),
    null
  )

  translator.prepareDOM('lv', jest.fn(), onCompleted)

  return {
    onCompleted,
    translator
  }
}

describe('DOMTranslation dynamic content discovery timing', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    document.body.innerHTML = '<p>Content</p>'
  })

  afterEach(() => {
    jest.useRealTimers()
    document.body.innerHTML = ''
  })

  it.each([TranslationMode.SINGLE_BATCH, TranslationMode.WORD_COUNT])(
    'uses the configured delay in %s mode',
    mode => {
      const { onCompleted, translator } = startDiscovery(mode, 25)

      jest.advanceTimersByTime(24)
      expect(onCompleted).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(onCompleted).toHaveBeenCalledTimes(1)

      translator.restoreDOM()
    }
  )

  it('preserves the existing delay when the option is omitted', () => {
    const { onCompleted, translator } = startDiscovery(TranslationMode.SINGLE_BATCH)

    jest.advanceTimersByTime(DEFAULT_DISCOVERY_DELAY_MS - 1)
    expect(onCompleted).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(onCompleted).toHaveBeenCalledTimes(1)

    translator.restoreDOM()
  })

  it('allows discovery to complete immediately', () => {
    const { onCompleted, translator } = startDiscovery(TranslationMode.SINGLE_BATCH, 0)

    expect(onCompleted).not.toHaveBeenCalled()
    jest.advanceTimersByTime(0)
    expect(onCompleted).toHaveBeenCalledTimes(1)

    translator.restoreDOM()
  })

  it('uses the default delay for a negative value', () => {
    const { onCompleted, translator } = startDiscovery(TranslationMode.WORD_COUNT, -1)

    jest.advanceTimersByTime(DEFAULT_DISCOVERY_DELAY_MS - 1)
    expect(onCompleted).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(onCompleted).toHaveBeenCalledTimes(1)

    translator.restoreDOM()
  })

  it('ignores delayed discovery completion after the execution becomes stale', () => {
    let executionIsCurrent = true
    const onCompleted = jest.fn()
    const translator = new DOMTranslation(
      createOptions(TranslationMode.SINGLE_BATCH, 25),
      jest.fn(),
      jest.fn(),
      null
    )

    translator.prepareDOM('lv', jest.fn(), onCompleted, () => executionIsCurrent)
    executionIsCurrent = false
    jest.advanceTimersByTime(25)

    expect(onCompleted).not.toHaveBeenCalled()
    translator.restoreDOM()
  })

  it('ignores scheduled animation-frame scans after the execution becomes stale', () => {
    let executionIsCurrent = true
    const onDiscovered = jest.fn()
    const translator = new DOMTranslation(
      createOptions(TranslationMode.SINGLE_BATCH, 25),
      jest.fn(),
      jest.fn(),
      null
    )

    translator.prepareDOM('lv', onDiscovered, jest.fn(), () => executionIsCurrent)
    const initialDiscoveryCount = onDiscovered.mock.calls.length

    window.dispatchEvent(new Event('scroll'))
    executionIsCurrent = false
    jest.advanceTimersByTime(20)

    expect(onDiscovered).toHaveBeenCalledTimes(initialDiscoveryCount)
    translator.restoreDOM()
  })

  it('removes detached translation state during discovery', () => {
    const translator = new DOMTranslation(
      createOptions(TranslationMode.CHUNKED),
      jest.fn(),
      jest.fn(),
      null
    )
    translator.prepareDOM('lv', jest.fn())
    const container = document.createElement('section')
    const connectedElement = document.querySelector('p')
    const textRange = new TranslationTextRange()
    const connectedRange = new TranslationTextRange()
    textRange.startMarker = document.createElement('tmt-wtw-txt-s')
    textRange.endMarker = document.createElement('tmt-wtw-txt-e')
    connectedRange.startMarker = document.createElement('tmt-wtw-txt-s')
    connectedRange.endMarker = document.createElement('tmt-wtw-txt-e')
    container.append(textRange.startMarker, document.createTextNode('Translated'), textRange.endMarker)
    connectedElement.append(connectedRange.startMarker, connectedRange.endMarker)
    document.body.appendChild(container)

    const state = translator as any
    state.translatableElementRanges.push(textRange, connectedRange)
    state.translatableParentElements.add(container)
    state.translatableParentElements.add(connectedElement)
    state.translatableElements.add(container)
    state.translatableElements.add(connectedElement)
    state.markedNodesWithId.add(container)
    state.markedNodesWithId.add(connectedElement)
    state.translatableAttributeElements.push({
      attributes: [],
      element: container
    }, {
      attributes: [],
      element: connectedElement
    })
    state.translatedSegments.set(textRange.startMarker, {
      segmentId: 1,
      source: 'Original',
      translation: 'Translated'
    })
    state.translatedSegments.set(connectedRange.startMarker, {
      segmentId: 2,
      source: 'Connected',
      translation: 'Connected translation'
    })

    container.remove()
    window.dispatchEvent(new Event('scroll'))
    jest.advanceTimersByTime(20)

    expect(state.translatableElementRanges.every(range => range.startMarker.isConnected && range.endMarker.isConnected)).toBe(true)
    expect([...state.translatedSegments.keys()].every(marker => marker.isConnected)).toBe(true)
    expect(state.translatableElementRanges).toContain(connectedRange)
    expect(state.translatedSegments.has(connectedRange.startMarker)).toBe(true)
    expect([...state.translatableParentElements].every(node => node.isConnected)).toBe(true)
    expect([...state.translatableElements].every(element => element.isConnected)).toBe(true)
    expect([...state.markedNodesWithId].every(element => element.isConnected)).toBe(true)
    expect(state.translatableAttributeElements.every(range => range.element.isConnected)).toBe(true)

    translator.restoreDOM()
  })

  it('refreshes active SEO state during later discovery passes', () => {
    const seoTool = {
      applyLinkedPages: jest.fn(),
      localizeUrls: jest.fn(),
      restoreUrlLocalization: jest.fn()
    }
    const translator = new DOMTranslation(
      createOptions(TranslationMode.CHUNKED),
      jest.fn(),
      jest.fn(),
      seoTool as any
    )

    translator.applySeo('lv', ['en', 'lv'])
    translator.prepareDOM('lv', jest.fn())
    seoTool.applyLinkedPages.mockClear()
    seoTool.localizeUrls.mockClear()

    window.dispatchEvent(new Event('scroll'))
    jest.advanceTimersByTime(20)

    expect(seoTool.applyLinkedPages).toHaveBeenCalledWith('lv', ['en', 'lv'])
    expect(seoTool.localizeUrls).toHaveBeenCalled()
    translator.restoreDOM()
  })
})
