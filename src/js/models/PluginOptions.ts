import { IPluginOptions } from '../interfaces/IPluginOptions'
import { PluginUILanguageType } from '../enums/PluginUILanguageType'
import { PluginToolbarPositionType } from '../enums/ToolbarPositionType'

export const pluginOptions: IPluginOptions = {
  sourceLanguage: 'en',
  currentLanguage: null,
  api: {
    clientId: null,
    url: 'https://example-test-domain.com',
    version: 3
  },
  translation: {
    autoTranslate: true,
    translateWholePage: false,
    // systems: null,
    targetLanguages: null,
    translateOnlyAllowedTags: false,
    translateAttributes: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onLanguageSelected: (selectedLanguage) => {
      return new Promise((resolve) => {
        const translationHandled = false
        resolve(translationHandled)
      })
    },
    thirdPartyTranslationLanguages: [
      // 'lv'
    ]
  },
  ui: {
    headless: false,
    showSignInLink: true,
    translate: PluginUILanguageType.TARGET,
    showTranslationControls: true,
    layout: 'menu',
    tooltipShowDelay: 500,
    toolbarPosition: PluginToolbarPositionType.BOTTOM,
    mainContentElement: null,
    alwaysShowOriginalTextInPopup: false,
    showPopupTranslationProvider: true,
    showPopup: true,
    showLanguagesInNativeLanguage: true,
    branding: {
      name: 'Tilde',
      url: '',
      visible: null
    }
  },
  debug: false,
  appID: 'WebsiteTranslator'
}
