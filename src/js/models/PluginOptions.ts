import { IPluginOptions } from '../Interfaces/IPluginOptions'
import { PluginUILanguageType } from '../Enums/PluginUILanguageType'
import { PluginToolbarPositionType } from '../Enums/ToolbarPositionType'

export const pluginOptions: IPluginOptions = {
  sourceLanguage: 'en',
  currentLanguage: null,
  api: {
    clientId: null,
    services: {
      Translation: 'https://example-test-domain.com/api/translate/website'
    }
  },
  translation: {
    autoTranslate: true,
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
    showLanguagesInNativeLanguage: false,
    branding: {
      name: 'Tilde',
      url: ''
    }
  },
  debug: false,
  appID: 'WebsiteTranslator'
}
