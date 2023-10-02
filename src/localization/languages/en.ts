import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Restore {original language}',
    close: 'Close',
    cancel: 'Cancel'
  },
  labels: {
    developedBy: 'Developed by {0}',
    original: 'Original',
    machineTranslatedText: 'Machine translated text',
    machineTranslation: 'Machine translation',
    translationNotice: 'Selected text is translated automatically by {0} service',
    pageIsTranslated: 'Page content machine translated by {0}',
    pageIsTranslatedWithoutBranding: 'Page content machine translated.',
    pageIsTranslating: 'Machine translation of page content in progress',
    noSegmentsFound: 'No segments found',
    selectLanguage: 'Select language'
  },
  alerts: {
    errors: {
      default: 'Error',
      connection: 'Connection error',
      systems: 'No systems are currently available',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Error while translating page, some text may be left untranslated',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
      }
    }
  },
  languages: {
    ar: 'Arabic',
    bg: 'Bulgarian',
    cs: 'Czech',
    da: 'Danish',
    de: 'German',
    el: 'Greek',
    en: 'English',
    es: 'Spanish',
    et: 'Estonian',
    fi: 'Finnish',
    fr: 'French',
    ga: 'Irish',
    hr: 'Croatian',
    hu: 'Hungarian',
    is: 'Icelandic',
    it: 'Italian',
    ja: 'Japanese',
    lt: 'Lithuanian',
    lv: 'Latvian',
    mt: 'Maltese',
    nb: 'Norwegian Bokmål',
    nl: 'Dutch',
    nn: 'Norwegian Nynorsk',
    pl: 'Polish',
    pt: 'Portuguese',
    ro: 'Romanian',
    ru: 'Russian',
    sk: 'Slovak',
    sl: 'Slovenian',
    sv: 'Swedish',
    uk: 'Ukrainian',
    zh: 'Chinese, Mandarin'
  }

}
export default lang
