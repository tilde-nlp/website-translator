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
    ar: 'Arab',
    bg: 'Bolgár',
    cs: 'Cseh',
    da: 'Dán',
    de: 'Német',
    el: 'Görög',
    en: 'Angol',
    es: 'Spanyol',
    et: 'Észt',
    fi: 'Finn',
    fr: 'Francia',
    ga: 'Ír',
    hr: 'Horvát',
    hu: 'Magyar',
    is: 'Izlandi',
    it: 'Olasz',
    ja: 'Japán',
    lt: 'Litván',
    lv: 'Lett',
    mt: 'Máltai',
    nb: 'Norvég (bokmål)',
    nl: 'Holland',
    nn: 'Norvég (nynorsk)',
    pl: 'Lengyel',
    pt: 'Portugál',
    ro: 'Román',
    ru: 'Orosz',
    sk: 'Szlovák',
    sl: 'Szlovén',
    sv: 'Svéd',
    uk: 'Ukrán',
    zh: 'Mandarin'
  }

}
export default lang
