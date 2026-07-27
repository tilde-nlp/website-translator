import { BehaviorSubject } from 'rxjs'
import AsyncTranslator from './AsyncTranslator'
import { TranslationMode } from '../enums/TranslationMode'

const createTranslator = (mode: TranslationMode) => {
  const domTranslator = {
    restoreDOM: jest.fn(),
    applyUrlLocalization: jest.fn()
  }

  const translator = new AsyncTranslator(
    {} as any,
    {
      debug: false,
      translation: {
        mode
      }
    } as any,
    domTranslator as any,
    () => undefined,
    () => undefined,
    {
      clear: jest.fn()
    } as any,
    new BehaviorSubject<any>({})
  )

  return translator as any
}

describe('AsyncTranslator translation-finished event', () => {
  const eventName = 'translation-finished'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('emits translation-finished in SINGLE_BATCH mode at 100% progress', () => {
    const translator = createTranslator(TranslationMode.SINGLE_BATCH)
    const onFinished = jest.fn()

    document.addEventListener(eventName, onFinished)

    translator.itemsTotal = 1
    translator.itemsTranslated = 1
    translator.batchesCount = 1

    const progress = translator.getProgress()

    document.removeEventListener(eventName, onFinished)

    expect(progress).toBe(1)
    expect(onFinished).toHaveBeenCalledTimes(1)
  })

  test('emits translation-finished only once per translation run', () => {
    const translator = createTranslator(TranslationMode.SINGLE_BATCH)
    const onFinished = jest.fn()

    document.addEventListener(eventName, onFinished)

    translator.itemsTotal = 1
    translator.itemsTranslated = 1
    translator.batchesCount = 1

    translator.getProgress()
    translator.getProgress()

    document.removeEventListener(eventName, onFinished)

    expect(onFinished).toHaveBeenCalledTimes(1)
  })

  test('resets event emission for back-to-back translation runs', () => {
    const translator = createTranslator(TranslationMode.SINGLE_BATCH)
    const onFinished = jest.fn()

    document.addEventListener(eventName, onFinished)

    translator.itemsTotal = 1
    translator.itemsTranslated = 1
    translator.batchesCount = 1

    translator.getProgress()
    expect(onFinished).toHaveBeenCalledTimes(1)

    translator.cancel()

    translator.itemsTotal = 1
    translator.itemsTranslated = 1
    translator.batchesCount = 1

    translator.getProgress()

    document.removeEventListener(eventName, onFinished)

    expect(onFinished).toHaveBeenCalledTimes(2)
  })
})
