// TODO: convert some of the types to enums

import { PluginUILanguageType } from '../enums/PluginUILanguageType'
import { PluginToolbarPositionType } from '../enums/ToolbarPositionType'

export interface IPluginOptions{
    /**
   * Source language for machine translation
   * @recomended  "en"
   * @required
   */
  sourceLanguage: string,
  /**
   * Current web page language (if the web page is already pre-translated).
   * The language in which the website has been translated.
   * When {currentLanguage} is not equal to {sourceLanguage}, selecting language to translate, plugin will try to get page in {sourceLanguage} by calling {translation.onLanguageSelected({sourceLanguage})}
   * @optional
   * @default null
   */
  currentLanguage: string,
  /**
   * Where is the plugin api and how it connects to it
   */
  api: {
    /**
     * Authorization key which allows plugin to access translation api
     * @required
     */
    clientId: string,
    /**
     * Translation service Uri.
     * @required
     */
    url: string,
    /**
     * API version
     * 1 - older version
     * 2 - version with seperate API endpoint for configuration
     */
    version: number
  },
  /**
   * How plugin translates
   */
  translation: {
    /**
     * Save last translation {target language} and on next page load, automatically translate to it.
     */
    autoTranslate: boolean,

    /**
     * Translate whole page immediately, without waiting while content is in screen view
     */
    translateWholePage: boolean,

    targetLanguages:Array<string>
    /**
     * Translate only tags and their children which have [translate="yes"] attribute
     */
    translateOnlyAllowedTags: boolean,
    /**
     * Translate HTML attributes
     */
    translateAttributes: boolean,
    /**
     * Custom actions on selecting languages.
     * If webpage is pre-translated by third-party, then you should handle {sourceLanguage} here too
     * @returns {boolean} Language should be Translated with this Translation plugin
     * Please dont use this, this was requirement, but it is not desired way. Please use your own language menu.
     */
    onLanguageSelected: any,
    /**
     * Define languages which are supposed to be translated with third party
     */
    thirdPartyTranslationLanguages: Array<string>
  },
  /**
   * How plugin looks
   */
  ui: {
    /**
     * Hide MT toolbar with translation progress.
     */
    headless: boolean
    /**
     * Show sign in link for WTW
     */
    showSignInLink: boolean
    /**
     * Translate plugin ui, values can be:
     *    source - Show plugin ui in source language
     *    target - Show plugin ui in target language
     */
    translate: PluginUILanguageType
    /**
     * Show or hide "restore" and "cancel" translation buttons on Translation Plugin UI
     */
    showTranslationControls: boolean
    /**
     * Change display mode of the language selection in UI, values can be:
     *    "menu" - Show available languages in select
     *    "list" - Show available languages as list items
     *    null - Hide language menu
     * If you wish to add more functionality, please consider use your own language menu?
     */
    layout: string,
    /**
     * How much time to wait after user is started to hover translation to show suggestion popup (in ms)
     */
    tooltipShowDelay: number,
    /**
     * Where toolbar is positioned.
     */
    toolbarPosition: PluginToolbarPositionType,
    /**
     * Main container [HTMLElement] for web page that contains all scrollable content
     */
    mainContentElement: HTMLElement,
    /**
     * Show original text even if public suggestions are set to false
     */
    alwaysShowOriginalTextInPopup: boolean,
    /**
     * Show notification about what service is providing translation.
     */
    showPopupTranslationProvider: boolean,
    /**
     * Show or hide translation popup.
     */
    showPopup: boolean
    /**
     * Show languages in native language for example in Language Menu
     */
    showLanguagesInNativeLanguage: boolean,
    branding:{
      /**
       * Name of provider that provides MT
       */
      name:string,
      /**
       * URL which is used for links to MT
       */
      url:string,
      /**
       * Is branding visible
       */
      visible:boolean|null
    }
  },
  /**
   * Enable verbose logging in console
   */
  debug: boolean,
  /**
   * App id, this is usefull to make seperate statistics
   */
  appID: string
}
