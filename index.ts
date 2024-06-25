// Polyfill imports
import 'core-js'
import './src/polyfills/custom'

// Rest of code
import { BehaviorSubject } from 'rxjs'
import FadeOut from './src/js/animations/FadeOut'
import Alert from './src/js/Alert'
import SentenceHighlight from './src/js/SentenceHighlight'
import AsyncTranslator from './src/js/lib/AsyncTranslator'
import LanguageSelect from './src/js/ui/LanguageSelect'
import {
  mouseRelativeToIframe,
  getLanguageName,
  normalizeLanguageCode
} from './src/js/Common'

import './src/style/widget.scss'

import { ILanguageSelect } from './src/js/interfaces/ILanguageSelect'
import { LanguageSelectDummy } from './src/js/ui/LanguageSelectDummy'
import { DOMTranslation } from './src/js/lib/DOMTranslation'
import { Logger } from './src/js/Logger'
import { DataStorage } from './src/js/DataStorage'
import { PluginUILanguageType } from './src/js/enums/PluginUILanguageType'
import { PluginToolbarPositionType } from './src/js/enums/ToolbarPositionType'
import { IInternalUiOptions } from './src/js/interfaces/IInternalUiOptions'
import { ILanguageInfo } from './src/js/interfaces/ILanguageInfo'
import { ILocalizedLanguage } from './src/js/interfaces/ILocalizedLanguage'
import { ISegmentInfo } from './src/js/interfaces/ISegmentInfo'
import { IDomTranslation } from './src/js/interfaces/ITranslation'
import { SearchEngineOptimization } from './src/js/lib/SearchEngineOptimization'
import { pluginOptions } from './src/js/models/PluginOptions'
import { ProgressBar } from './src/js/ProgressBar'
import { TextLocalization } from './src/js/scripts/TextLocalization'
import localization from './src/localization/localization'
import languageCodes from './src/localization/langCodes'
import WebsiteService from './src/js/services/WebsiteService'
import TranslationCache from './src/js/lib/TranslationCache'
import { ITranslationError } from './src/js/interfaces/ITranslationError'
import IWebsiteConfiguration from './src/js/interfaces/services/websiteService/IWebsiteConfiguration'
const pluginVersion = require('./src/js/PluginVersion')

const STORAGE_KEY_AUTOTRANSLATE = 'website-translator-autotranslate-system'
const STORAGE_KEY_TRANSLATE_ONCE_NEXT = 'website-translator-translate-once-system'

const internalUiOptions:IInternalUiOptions = {
  ui: {
    branding: {
      icon: require('./src/assets/logo.svg').default
    },
    translationProvider: null,
    icons: {
      menuIcon: require('./src/assets/menu-icon.svg').default
    }
  }
}

/**
 * Public exposed api
 */
const publicAPI = {
  Options: pluginOptions,
  Localization: localization,
  Initialize,
  Translate,
  CancelAndRestore,
  GetTargetLanguages,
  Version: pluginVersion,
  CurrentLanguage: null,
  /// #if DEBUG
  TextLocalization: new TextLocalization()
  /// #endif
}

internalUiOptions.ui.translationProvider = 'NLTP'
pluginOptions.ui.showPopupTranslationProvider = false
pluginOptions.ui.branding.name = 'NLTP'
pluginOptions.ui.branding.url = ''

// Current target language
let targetLanguage:BehaviorSubject<string> = null

let uiLocalization:BehaviorSubject<ILocalizedLanguage> = null

/**
 * Plugin initialization is complete and you can stat translation
 */
let pluginInitializationComplete:boolean = false
/**
 * Plugin initialization is called. No further init calls should be allowed. Initialized can be only once
 */
let pluginInitializationHappened:boolean = false

let languageSelect:ILanguageSelect = new LanguageSelectDummy()
let toolbar = null

let translationEnterHold: any = null
const translationAnimation = new FadeOut()
let selectedSentenceInfo: ISegmentInfo = null

let domTranslator: DOMTranslation
let translationHelper:AsyncTranslator
let logger: Logger = null

const allTranslations = new Map<string, IDomTranslation>()

let availableLocales: Array<string>

let sentenceHightlight: SentenceHighlight
let seoTool:SearchEngineOptimization

let websiteService: WebsiteService

let uiLanguage: string

let translationCache: TranslationCache = null
/**
 * Save language attribute, so when page is restored, we know how to restore
 */
let originalPageLanguageAttribute = null
/**
 * Allow to save lang attribute only once
 */
let originalPageLanguageAttributeSaved = false

function translationEnter (e:MouseEvent) {
  const tooltip = document.querySelector('.website-translator-tooltip') as HTMLElement

  const element = e.target as HTMLElement

  if (translationEnterHold) {
    clearTimeout(translationEnterHold)
  }

  translationEnterHold = setTimeout(function () {
    translationAnimation.reset()

    function tooltipEnter () {
      translationAnimation.reset()
    }
    function tooltipLeave () {
      this.removeEventListener('mouseenter', tooltipEnter)
      this.removeEventListener('mouseleave', tooltipLeave)
      this.classList.remove('active')

      sentenceHightlight.removeSentenceHighlight()
    }

    if (pluginOptions.ui.showPopup) {
      translationEnterHold = null
      tooltip.classList.add('active')

      tooltip.addEventListener('mouseenter', tooltipEnter)
      // Removes translation highlighting when mouse leaves tooltip and enters a not translatable element
      tooltip.addEventListener('mouseleave', tooltipLeave)

      selectedSentenceInfo = domTranslator.selectSegmentInformation(element)

      sentenceHightlight.removeSentenceHighlight()
      sentenceHightlight.applySentenceHighlight(element, selectedSentenceInfo.translatedRange)

      tooltip.dataset.originalHtml = selectedSentenceInfo.originalHTML
      tooltip.dataset.translatedHtml = selectedSentenceInfo.translatedHTML
      tooltip.dataset.segmentId = `${selectedSentenceInfo.segmentId}`

      tooltip.querySelector('.original').childNodes.forEach(item => item.remove())

      const suggestion = document.createElement('div')
      suggestion.innerHTML = selectedSentenceInfo.originalHTML
      tooltip.querySelector('.original').appendChild(suggestion)

      tooltip.classList.toggle('footer-visible', pluginOptions.ui.showPopupTranslationProvider)
      tooltip.classList.toggle('original-text-visible', pluginOptions.ui.showPopup)

      const mouseInIframe = mouseRelativeToIframe(e)
      const toolbar = document.querySelector('.website-translator-toolbar')
      const elementRectangle = selectedSentenceInfo.translatedRange.getBoundingClientRect()
      const tooltipRectangle = tooltip.getBoundingClientRect()

      const tooltipPosition = {
        top: mouseInIframe.top,
        left: mouseInIframe.left + elementRectangle.left
      }

      const freeVerticalSpaceBelow = window.innerHeight - (
        mouseInIframe.top +
        elementRectangle.top +
        elementRectangle.height +
        toolbar.getBoundingClientRect().height
      )

      // For displaying tooltip not right after or before text
      const marginToText = 8

      // If there is not enough space for tooltip below the translation element, display it above
      if (freeVerticalSpaceBelow < tooltipRectangle.height) {
        tooltipPosition.top += elementRectangle.top - tooltipRectangle.height - marginToText
      }
      else {
        tooltipPosition.top += elementRectangle.top + elementRectangle.height + marginToText
      }

      const horizontalTooltipMargin = 5
      if (tooltipPosition.left + tooltipRectangle.width + horizontalTooltipMargin > window.innerWidth) {
        tooltipPosition.left += window.innerWidth - tooltipPosition.left - tooltipRectangle.width - horizontalTooltipMargin
      }
      tooltipPosition.left = Math.max(tooltipPosition.left, horizontalTooltipMargin)

      tooltip.style.top = `${tooltipPosition.top}px`
      tooltip.style.left = `${tooltipPosition.left}px`
    }
  }, pluginOptions.ui.tooltipShowDelay)
}

function translationLeave (event) {
  if (translationEnterHold) {
    clearTimeout(translationEnterHold)
    sentenceHightlight.removeSentenceHighlight()
  }
  else {
    const tooltip = document.querySelector('.website-translator-tooltip')

    translationAnimation.animate(tooltip, () => {
      if (
        tooltip &&
            !(
              event.relatedTarget === tooltip ||
              tooltip.contains(event.relatedTarget)
            )
      ) {
        tooltip.classList.remove('active')
      }

      sentenceHightlight.removeSentenceHighlight()
    })
  }
}

async function checkAutoTranslate () {
  const systemSave = sessionStorage.getItem(STORAGE_KEY_TRANSLATE_ONCE_NEXT)
  if (systemSave !== null) {
    sessionStorage.removeItem(STORAGE_KEY_TRANSLATE_ONCE_NEXT)

    logger.debug('Found scheduled translation from third party websites')
    const savedSystem = JSON.parse(systemSave)

    await translate(savedSystem.language)
  }
  else if (pluginOptions.translation.autoTranslate) {
    const urlParams = new URLSearchParams(window.location.search)
    const urlParamLanguage = urlParams.get('lang')

    // Take language from url if this is not source language,
    // because this may be redirect instead of language request.
    if (urlParamLanguage === pluginOptions.sourceLanguage) {
      logger.debug('language is set to source language, ignoring auto translate')
      cancel()
    }
    else if (urlParamLanguage !== null) {
      logger.debug('Found initializing language in URL query parameters')
      await translate(urlParamLanguage)
    }
    else {
      const systemSave = DataStorage.get(STORAGE_KEY_AUTOTRANSLATE)
      if (systemSave !== null) {
        logger.debug('Found saved language information')
        const savedSystem = JSON.parse(systemSave)

        await translate(savedSystem.language)
      }
    }
  }
}

function setTranslationProgress (progress: number) {
  const showBranding = pluginOptions.ui.branding.visible || (
    pluginOptions.ui.branding.visible === null && pluginOptions.api.version === 1)
  if (toolbar) {
    const progressBar:ProgressBar = toolbar.progressBar

    if (progressBar) {
      if (progress === 0) {
        // toolbar.translationNotice.textContent = `${uiLocalization.value.labels.pageIsTranslating}.`
        const vendor = createVendorButton()

        if (showBranding) {
          toolbar.translationNotice.innerHTML = `${uiLocalization.value.labels.pageIsTranslated.replace('{0}', vendor.outerHTML)}.`
        }
        else {
          toolbar.translationNotice.innerHTML = uiLocalization.value.labels.pageIsTranslatedWithoutBranding
        }
        progressBar.unsetProgress()
      }
      else if (progress < 1) {
        progressBar.setProgress(progress)
      }
      else {
        const vendor = createVendorButton()

        if (showBranding) {
          toolbar.translationNotice.innerHTML = `${uiLocalization.value.labels.pageIsTranslated.replace('{0}', vendor.outerHTML)}.`
        }
        else {
          toolbar.translationNotice.innerHTML = uiLocalization.value.labels.pageIsTranslatedWithoutBranding
        }

        progressBar.setProgress(progress)
      }
    }
  }
}

function cancel () {
  const widgetContainer = document.querySelector('.website-translator')
  if (widgetContainer) {
    const restoreControl = widgetContainer.querySelector('.restore-button')

    if (restoreControl) {
      restoreControl.parentNode.removeChild(restoreControl)
    }
  }
  translationHelper.cancel()
  domTranslator.restoreSeo()

  restore()
  setTranslationProgress(0)

  targetLanguage.next(pluginOptions.sourceLanguage)

  changeLanguage(pluginOptions.sourceLanguage);

  (pluginOptions.ui.mainContentElement || document.body).classList.toggle('website-translator-hide', false)
  logger.debug('translation canceled')
}

async function translate (language:string): Promise<any> {
  const isDefaultLanguage = language === pluginOptions.sourceLanguage || language === pluginOptions.currentLanguage
  const nextLanguageIsThirdParty = pluginOptions.translation.thirdPartyTranslationLanguages.includes(language)
  const currLanguageIsThirdParty = pluginOptions.translation.thirdPartyTranslationLanguages.includes(pluginOptions.currentLanguage)
  const languageIsSupported = pluginOptions.translation.targetLanguages.includes(language)
  const currLanguageIsDifferent = language !== pluginOptions.currentLanguage
  const currLangNotSourceLang = pluginOptions.sourceLanguage !== pluginOptions.currentLanguage

  if (!languageIsSupported && !isDefaultLanguage && !nextLanguageIsThirdParty) {
    // pluginOptions.currentLanguage = pluginOptions.sourceLanguage
    logger.error(`Given language code could not be resolved: ${language}. Translation canceled.`)
    cancel()
    return [Promise.reject(new Error(`Given language code could not be resolved: ${language}. Translation canceled.`))]
  }

  targetLanguage.next(language)
  languageSelect.silentSelect(language)
  switchWindowLanguage(language) // If language comes after source language redirect, it will have this source language so change it.

  if (pluginOptions.currentLanguage === language) {
    return [Promise.resolve()]
  }

  if (nextLanguageIsThirdParty) {
    logger.debug(`schedule next translation to lang: ${language}`)
    await pluginOptions.translation.onLanguageSelected(language)
  }
  else if (currLanguageIsThirdParty && currLanguageIsDifferent && currLangNotSourceLang) {
    sessionStorage.setItem(STORAGE_KEY_TRANSLATE_ONCE_NEXT,
      JSON.stringify({
        language: language
      })
    )

    logger.info(`schedule language switching to intermediate language: ${pluginOptions.sourceLanguage}`)
    const translationHandled = await pluginOptions.translation.onLanguageSelected(pluginOptions.sourceLanguage)

    if (!translationHandled) {
    // eslint-disable-next-line no-console
      console.error(`Third party translation to lang "${language}" not handled`)
      return [
        Promise.reject(new Error(`Third party translation to lang "${language}" not handled`))
      ]
    }
  }

  if (!nextLanguageIsThirdParty) {
    cancel()
  }

  if (pluginOptions.translation.autoTranslate) {
    DataStorage.set(STORAGE_KEY_AUTOTRANSLATE,
      JSON.stringify({
        language: language
      })
    )
  }

  targetLanguage.next(language)
  languageSelect.silentSelect(language)
  changeLanguage(language)

  if (language === pluginOptions.sourceLanguage) {
    return [Promise.resolve()]
  }

  toolbar = new Toolbar()
  if (!toolbar.toolbar()) {
    toolbar.display()
  }
  toolbar.dashboard()

  setTranslationProgress(0)

  enableTooltips()

  return [
    new Promise<void>((resolve, reject) => {
      translationHelper.translate(
        language,
        allTranslations,
        availableLocales
      ).then(() => {
        logger.debug(`Translated items: ${allTranslations.size}`)
        resolve()
      }).catch((err: ITranslationError) => {
        logger.debug(`translation failed ${err}`)

        const progressBar = toolbar.progressBar as ProgressBar
        progressBar.remove()

        Alert.display(
          pluginOptions,
          uiLocalization.value.alerts.errors.default,
          'danger',
          uiLocalization
        )
        reject(err)
      })
    })
  ]
}

function enableTooltips () {
  const tooltip = document.createElement('div')
  tooltip.classList.add('website-translator-tooltip')

  const tooltipBody = document.createElement('div')
  tooltipBody.classList.add('body')

  const original = document.createElement('div')
  original.classList.add('original')

  const originalLabel = document.createElement('div')
  originalLabel.textContent = uiLocalization.value.labels.original
  originalLabel.classList.add('original-label')

  tooltipBody.appendChild(originalLabel)
  tooltipBody.appendChild(original)

  const footer = document.createElement('div')
  footer.classList.add('footer')
  const footerText = document.createElement('div')
  footerText.classList.add('text')

  const footerImage = document.createElement('div')
  footerImage.classList.add('icon')

  footerText.textContent = uiLocalization.value.labels.translationNotice.replace('{0}', internalUiOptions.ui.translationProvider)

  const img = document.createElement('img')
  img.src = internalUiOptions.ui.branding.icon
  footerImage.appendChild(img)

  footer.appendChild(footerText)
  footer.appendChild(footerImage)

  tooltip.appendChild(tooltipBody)
  tooltip.appendChild(footer)

  document.body.appendChild(tooltip)
}

function createRestoreButton () {
  const container = document.createElement('div')
  const button = document.createElement('a')
  button.href = 'javascript:;'
  button.classList.add('restore-button', 'website-translator-button')
  button.textContent = uiLocalization.value.controls.restore.match(/{([^}]*)}/)[1]

  container.innerHTML = uiLocalization.value.controls.restore.replace(/{[^}]*}/, button.outerHTML)
  const realButton:HTMLButtonElement = container.querySelector('.restore-button')
  realButton.onclick = () => {
    CancelAndRestore()
  }
  return container
}

function Toolbar () {
  const toolbarClassname = 'website-translator-toolbar'
  let toolbarSpacerElement = null
  let toolbarElement:HTMLElement = null
  const mainScrollableContainer = pluginOptions.ui.mainContentElement || document.body
  this.progressBar = null

  this.toolbar = function () {
    return document.querySelector(`.${toolbarClassname}`)
  }

  this.display = function () {
    toolbarSpacerElement = document.createElement('div')
    toolbarSpacerElement.classList.add('website-translator-toolbar-spacer')

    toolbarElement = document.createElement('div')
    toolbarElement.classList.add(toolbarClassname)

    toolbarElement.setAttribute('lang', uiLanguage)

    if (pluginOptions.ui.headless) {
      toolbarElement.classList.add('headless')
      toolbarSpacerElement.classList.add('headless')
    }

    if (pluginOptions.ui.toolbarPosition === PluginToolbarPositionType.TOP) {
      toolbarElement.classList.add(PluginToolbarPositionType.TOP)
      mainScrollableContainer.prepend(toolbarSpacerElement)
      mainScrollableContainer.prepend(toolbarElement)
    }
    else if (pluginOptions.ui.toolbarPosition === PluginToolbarPositionType.BOTTOM) {
      toolbarElement.classList.add(PluginToolbarPositionType.BOTTOM)
      mainScrollableContainer.appendChild(toolbarSpacerElement)
      mainScrollableContainer.appendChild(toolbarElement)
    }
  }

  this.refresh = function () {
    const dashboardInfo = toolbarElement.querySelector('.dashboard').getBoundingClientRect()
    const progressBarInfo = toolbarElement.querySelector('.progress-bar')?.getBoundingClientRect()

    if (progressBarInfo) {
      const toolbarHeight = dashboardInfo.height + progressBarInfo.height

      toolbarSpacerElement.style.height = `${toolbarHeight}px`
      toolbarSpacerElement.style.minHeight = `${toolbarHeight}px`
    }
  }

  this.dashboard = function () {
    const dashboard = document.createElement('div')
    dashboard.classList.add('dashboard')

    const info = document.createElement('div')
    info.classList.add('info')

    if (pluginOptions.ui.branding.name) {
      const brand = document.createElement('div')
      brand.classList.add('website-translator-branding')

      // TODO: Perhaps figure out a way to not create an element if it is not required
      const link = document.createElement('a')
      link.classList.add('website-translator-branding-link')
      link.href = pluginOptions.ui.branding.url

      if (internalUiOptions.ui.branding.icon) {
        const visual = document.createElement('img')
        visual.src = internalUiOptions.ui.branding.icon
        visual.classList.add('website-translator-branding-visual')
        visual.alt = pluginOptions.ui.branding.name

        pluginOptions.ui.branding.url
          ? link.appendChild(visual)
          : brand.appendChild(visual)
      }
      else {
        pluginOptions.ui.branding.url
          ? (link.textContent = pluginOptions.ui.branding.name)
          : (brand.textContent = pluginOptions.ui.branding.name)
      }

      if (pluginOptions.ui.branding.url) {
        brand.appendChild(link)
      }

      info.appendChild(brand)
    }

    // TODO: Rename variable and related classname
    this.translationNotice = document.createElement('div')
    this.translationNotice.classList.add('translation-notice')

    const controls = document.createElement('div')
    controls.classList.add('controls')

    info.appendChild(this.translationNotice)

    if (pluginOptions.ui.showTranslationControls) {
      const restoreButton = createRestoreButton()
      controls.appendChild(restoreButton)
    }

    const auth = document.createElement('div')
    auth.classList.add('auth')

    const brandingNotice = document.createElement('div')
    brandingNotice.classList.add('textual-branding')
    const textualBrandLink = document.createElement('a')
    textualBrandLink.href = pluginOptions.ui.branding.url
    textualBrandLink.textContent = uiLocalization.value.labels.developedBy.replace('{0}', pluginOptions.ui.branding.name)
    brandingNotice.appendChild(textualBrandLink)

    dashboard.appendChild(info)
    dashboard.appendChild(controls)
    dashboard.appendChild(auth)

    this.progressBar = new ProgressBar()

    const toolbar:HTMLElement = this.toolbar()

    const contents = [dashboard, this.progressBar.getProgressContainer()]
    if (pluginOptions.ui.toolbarPosition === PluginToolbarPositionType.TOP) {
      toolbar.append(...contents)
    }
    else {
      toolbar.append(...contents.reverse())
    }

    this.refresh()

    window.addEventListener('resize', this.refresh)
  }

  this.close = function () {
    window.removeEventListener('resize', this.refresh)
    toolbarElement.parentNode.removeChild(toolbarElement)
    toolbarSpacerElement.parentNode.removeChild(toolbarSpacerElement)
  }
}

function createVendorButton () {
  const button = document.createElement('a')
  button.classList.add('vendor', 'website-translator-button')
  button.href = pluginOptions.ui.branding.url

  const vendorName = pluginOptions.ui.branding.name

  button.textContent = `${vendorName}`

  return button
}

/**
 * Set language of the document
 * @param currentLocale
 */
function setCurrentWindowLanguage () {
  // Make sure that when plugin is still initializing, don't erease url provided language
  const url = new URL(window.location.href)
  if (!pluginInitializationComplete) {
    if (!originalPageLanguageAttributeSaved) {
      originalPageLanguageAttribute = url.searchParams.get('lang')
      originalPageLanguageAttributeSaved = true
    }
  }
  else {
    if (targetLanguage.value !== pluginOptions.sourceLanguage || originalPageLanguageAttribute !== null) {
      switchWindowLanguage(targetLanguage.value)
    }
    else {
      switchWindowLanguage(null)
    }
  }
}

function switchWindowLanguage (language:string) {
  const url = new URL(window.location.href)
  if (language) {
    url.searchParams.set('lang', language)
  }
  else {
    url.searchParams.delete('lang')
  }
  window.history.pushState({}, '', url.href)
}

function restore () {
  setTranslationProgress(0)

  if (toolbar !== null) {
    toolbar.close()
    toolbar = null
  }

  // TODO: Perhaps move to a separate function
  const tooltip = document.querySelector('.website-translator-tooltip')
  if (tooltip) {
    tooltip.parentNode.removeChild(tooltip)
  }

  DataStorage.remove(STORAGE_KEY_AUTOTRANSLATE)

  languageSelect.reset()
}

function getLanguageSelectItems () {
  let items = []

  const langs = {

  }
  let defaultLanguage = null
  const sourceLanguage = {
    id: pluginOptions.sourceLanguage,
    langCode: pluginOptions.sourceLanguage,
    text: getLanguageName(pluginOptions.sourceLanguage, pluginOptions, uiLocalization),
    machineTranslated: false
  }

  if (pluginOptions.currentLanguage !== null && pluginOptions.currentLanguage !== pluginOptions.sourceLanguage) {
    defaultLanguage = {
      id: pluginOptions.currentLanguage,
      langCode: pluginOptions.currentLanguage,
      text: getLanguageName(pluginOptions.currentLanguage, pluginOptions, uiLocalization),
      machineTranslated: false
    }
    langs[pluginOptions.currentLanguage] = true
    langs[pluginOptions.sourceLanguage] = true

    items.push(sourceLanguage)
    items.push(defaultLanguage)
  }
  else {
    defaultLanguage = sourceLanguage
    langs[pluginOptions.sourceLanguage] = true
    items.push(defaultLanguage)
  }

  pluginOptions.translation.thirdPartyTranslationLanguages.forEach(langCode => {
    if (!langs[langCode]) {
      langs[langCode] = true
      items.push({
        id: langCode,
        langCode: langCode,
        text: getLanguageName(langCode, pluginOptions, uiLocalization),
        machineTranslated: false
      })
    }
  })

  for (const language of pluginOptions.translation.targetLanguages) {
    if (!langs[language]) {
      langs[language] = true
      items.push({
        id: language,
        langCode: language,
        text: getLanguageName(language, pluginOptions, uiLocalization),
        machineTranslated: true
      })
    }
  }
  items = items.sort(function (a, b) {
    if (a.machineTranslated !== b.machineTranslated) {
      return a.machineTranslated - b.machineTranslated
    }
    else {
      return a.text.localeCompare(b.text)
    }
  })

  return {
    items,
    defaultLanguage
  }
}
function createLanguageMenu () {
  const languageSelectItems = getLanguageSelectItems()
  languageSelect.dispose()
  languageSelect = LanguageSelect.get(
    pluginOptions.ui.layout,
    uiLocalization,
    languageCodes,
    pluginOptions,
    internalUiOptions
  )
  languageSelect.create(
    languageSelectItems.items,
    translate,
    languageSelectItems.defaultLanguage,
    document.querySelector('.website-translator')
  )
  availableLocales = Array.from(new Set(languageSelectItems.items.map(item => item.langCode)))

  const widgetContainer = document.querySelector('.website-translator')

  if (widgetContainer != null) {
    widgetContainer.setAttribute('lang', uiLanguage)
  }
}

/**
 * Call translation of specific language manually.
 * @param languageCode target language code
 */
async function Translate (languageCode: string) {
  if (!pluginInitializationComplete) {
    logger.error('Plugin initialization is not complete')
    return
  }

  if (languageCode === pluginOptions.sourceLanguage) {
    logger.debug('Translating to plugin source language...')
    CancelAndRestore()
    return [Promise.resolve()]
  }

  return await translate(languageCode)
}

/**
 * Cancel translation and restore page to original translation
 */
function CancelAndRestore () {
  if (!pluginInitializationComplete) {
    logger.error('Plugin has not completed its initialization')
    return
  }
  cancel()
}

function ValidatePluginOptions () {
  if (!pluginOptions.api.clientId) {
    logger.error('Client id not defined')
    throw new Error('Client id not defined')
  }
  if (!pluginOptions.sourceLanguage) {
    logger.error('Source language not set')
    throw new Error('Source language not set')
  }
}

function changeLanguage (language:string) {
  publicAPI.CurrentLanguage = language
  pluginOptions.currentLanguage = language
}

/**
 * Initialize plugin
 */
async function Initialize () {
  if (!pluginInitializationHappened) {
    logger = new Logger(pluginOptions.debug, 'WebTranslateWidget')

    logger.debug('Initializing plugin')

    ValidatePluginOptions()

    pluginOptions.translation.thirdPartyTranslationLanguages.forEach((item, index) => {
      pluginOptions.translation.thirdPartyTranslationLanguages[index] = normalizeLanguageCode(item)
    })

    seoTool = new SearchEngineOptimization(pluginOptions)
    translationCache = new TranslationCache()

    pluginInitializationHappened = true

    sentenceHightlight = new SentenceHighlight(pluginOptions)

    websiteService = new WebsiteService(pluginOptions)
    let website:IWebsiteConfiguration

    targetLanguage = new BehaviorSubject<string>(
      pluginOptions.currentLanguage || pluginOptions.sourceLanguage
    )
    uiLocalization = new BehaviorSubject<ILocalizedLanguage>(localization[targetLanguage.value])

    try {
      website = await websiteService.getWebsite()
    }
    catch (err) {
      toolbar = new Toolbar()
      if (!toolbar.toolbar()) {
        toolbar.display()
      }

      if (err.response.status === 403) {
        Alert.display(
          pluginOptions,
          uiLocalization.value.alerts.errors.forbidden,
          'danger',
          uiLocalization
        )

        throw new Error(`Failed to get website info. Please check if configured domains for website integration contains current webpage domain '${document.location.host}'`)
      }
      else {
        Alert.display(
          pluginOptions,
          uiLocalization.value.alerts.errors.default,
          'danger',
          uiLocalization
        )

        throw new Error(`Failed to get website info. error code: ${err.response.status} message: '${err.response.statusText}'`)
      }
    }
    pluginOptions.sourceLanguage = normalizeLanguageCode(website.srcLang)
    pluginOptions.translation.targetLanguages = website.languages

    targetLanguage.next(pluginOptions.currentLanguage || pluginOptions.sourceLanguage)
    uiLocalization.next(localization[targetLanguage.value])

    domTranslator = new DOMTranslation(
      pluginOptions,
      translationEnter,
      translationLeave,
      seoTool
    )
    translationHelper = new AsyncTranslator(
      websiteService,
      pluginOptions,
      domTranslator,
      function (percent: number) {
        setTranslationProgress(percent)
        logger.debug(`translation progress: ${Math.round(percent * 100 * 100) / 100}%`)
      },
      function (error: ITranslationError) {
        Alert.display(
          pluginOptions,
          uiLocalization.value.alerts.errors.translation,
          'danger',
          uiLocalization,
          error.ErrorMessage
        )
      },
      translationCache,
      uiLocalization
    )

    targetLanguage.subscribe({
      next: (targetLang) => {
        uiLanguage = GetGuiLanguage(targetLang)
        const nextLocalization = localization[uiLanguage] || localization.en
        logger.debug(`ui Language: ${localization[uiLanguage] ? uiLanguage : 'en'}`)
        uiLocalization.next(nextLocalization)

        setCurrentWindowLanguage()
      }
    })

    const widget = document.querySelector('.website-translator')

    if (!widget && pluginOptions.ui.layout !== null) {
      // Assume that user does not use layout
      pluginOptions.ui.layout = null
      // throw new Error('Widget container not found. If you want to use custom menu, then set WebsiteTranslator.Options.ui.layout to null')
    }

    createLanguageMenu()
    seoTool.applyLinkedPages(null, availableLocales)
    await checkAutoTranslate()

    pluginInitializationComplete = true
  }
  else {
    logger.warn('Plugin is already initialized')
    logger.debug('Reinitialize language menu')
    createLanguageMenu()
  }
  logger.debug('Plugin initialized')
}

function GetGuiLanguage (targetLanguage: string) {
  let uiLanguage

  if (pluginOptions.ui.translate === PluginUILanguageType.SOURCE) {
    uiLanguage = pluginOptions.currentLanguage || pluginOptions.sourceLanguage
  }
  else {
    uiLanguage = targetLanguage
  }

  uiLanguage = uiLanguage.split('-')[0]

  return uiLanguage
}

function GetTargetLanguages ():Array<ILanguageInfo> {
  if (!pluginInitializationComplete) {
    logger.error('Plugin has not completed its initialization')
    return
  }

  const languages = []

  for (const language of pluginOptions.translation.targetLanguages) {
    // TODO: need to have better way to process unsupported language codes
    const resolvedLangCode = language.split('-')[0]

    const languageCode = language
    const lang:ILanguageInfo = {
      code: languageCode,
      localizedName: getLanguageName(languageCode, pluginOptions, uiLocalization),
      machineTranslated: !pluginOptions.translation.thirdPartyTranslationLanguages.includes(languageCode),
      name: languageCodes[resolvedLangCode].name,
      nativeName: languageCodes[resolvedLangCode].nativeName
    }
    languages.push(lang)
  }

  return languages
}

export default publicAPI
