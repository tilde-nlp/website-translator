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
    pageIsTranslating: 'Machine translation of page content in progress',
    noSegmentsFound: 'No segments found'
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
    ar: 'Arabisch',
    bg: 'Bulgaars',
    cs: 'Tsjechisch',
    da: 'Deens',
    de: 'Duits',
    el: 'Grieks',
    en: 'Engels',
    es: 'Spaans',
    et: 'Estisch',
    fi: 'Fins',
    fr: 'Frans',
    ga: 'Iers',
    hr: 'Kroatisch',
    hu: 'Hongaars',
    is: 'IJslands',
    it: 'Italiaans',
    ja: 'Japans',
    lt: 'Litouws',
    lv: 'Lets',
    mt: 'Maltees',
    nb: 'Noors - Bokmål',
    nl: 'Nederlands',
    nn: 'Noors - Nynorsk',
    pl: 'Pools',
    pt: 'Portugees',
    ro: 'Roemeens',
    ru: 'Russisch',
    sk: 'Slowaaks',
    sl: 'Sloveens',
    sv: 'Zweeds',
    uk: 'Oekraïens',
    zh: 'Mandarijn'
  }

}
export default lang
