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
    ar: 'Arabščina',
    bg: 'Bolgarščina',
    cs: 'Češčina',
    da: 'Danščina',
    de: 'Nemščina',
    el: 'Grščina',
    en: 'Angleščina',
    es: 'Španščina',
    et: 'Estonščina',
    fi: 'Finščina',
    fr: 'Francoščina',
    ga: 'Irščina',
    hr: 'Hrvaščina',
    hu: 'Madžarščina',
    is: 'Islandščina',
    it: 'Italijanščina',
    ja: 'Japonščina',
    lt: 'Litovščina',
    lv: 'Latvijščina',
    mt: 'Malteščina',
    nb: 'Knjižna norveščina',
    nl: 'Nizozemščina',
    nn: 'Novonorveščina',
    pl: 'Poljščina',
    pt: 'Portugalščina',
    ro: 'Romunščina',
    ru: 'Ruščina',
    sk: 'Slovaščina',
    sl: 'Slovenščina',
    sv: 'Švedščina',
    uk: 'Ukrajinščina',
    zh: 'Kitajščina (mandarinščina)'
  }

}
export default lang
