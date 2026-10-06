import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { TranslationMode } from '../enums/TranslationMode'
import { IPluginOptions } from '../interfaces/IPluginOptions'
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
})
