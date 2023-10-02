export interface ILocalizedLanguage{
  /**
   * UI control buttons
   */
  controls: {
    close: string,
    cancel: string,
    restore: string
  },
  /**
   * Texts that are shown in UI
   */
  labels: {
    developedBy:string,
    original: string,
    machineTranslatedText: string,
    machineTranslation: string,
    translationNotice: string,
    pageIsTranslated: string,
    pageIsTranslatedWithoutBranding: string,
    pageIsTranslating: string,
    noSegmentsFound: string,
    selectLanguage: string,
  },
  /**
   * Alert messages
   */
  alerts: {
    errors: {
      default: string,
      connection: string,
      systems: string,
      forbidden: string,
      translation: string,
      translationSubStatus: {
        resourceNotFound: string
      }
    }
  },
  languages: { [Key: string]: string}
}
