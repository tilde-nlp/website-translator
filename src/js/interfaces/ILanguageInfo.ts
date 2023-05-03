export interface ILanguageInfo {
    /**
     * language code
     */
    code: string
    /**
     * Language name
     */
    name: string
    /**
     * Language name in native language
     */
    nativeName: string
    /**
     * Localized name which depends on other plugin settings (WebsiteTranslator.Options.ui.translate) and currently selected language
     */
    localizedName: string
    /**
     * Language is supposed to be machine translated
     */
    machineTranslated: boolean
}
