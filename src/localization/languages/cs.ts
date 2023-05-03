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
    ar: 'Arabština',
    bg: 'Bulharština',
    cs: 'Čeština',
    da: 'Dánština',
    de: 'Němčina',
    el: 'Řečtina',
    en: 'Angličtina',
    es: 'Španělština',
    et: 'Estonština',
    fi: 'Finština',
    fr: 'Francouzština',
    ga: 'Irština',
    hr: 'Chorvatština',
    hu: 'Maďarština',
    is: 'Islandština',
    it: 'Italština',
    ja: 'Japonština',
    lt: 'Litevština',
    lv: 'Lotyština',
    mt: 'Maltština',
    nb: 'Norština (bokmål)',
    nl: 'Nizozemština',
    nn: 'Norština (nynorsk)',
    pl: 'Polština',
    pt: 'Portugalština',
    ro: 'Rumunština',
    ru: 'Ruština',
    sk: 'Slovenština',
    sl: 'Slovinština',
    sv: 'Švédština',
    uk: 'Ukrajinština',
    zh: 'Standardní čínština'
  }
}
export default lang
