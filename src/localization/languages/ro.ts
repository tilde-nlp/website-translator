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
    ar: 'Arabă',
    bg: 'Bulgară',
    cs: 'Cehă',
    da: 'Daneză',
    de: 'Germană',
    el: 'Greacă',
    en: 'Engleză',
    es: 'Spaniolă',
    et: 'Estonă',
    fi: 'Finlandeză',
    fr: 'Franceză',
    ga: 'Irlandeză',
    hr: 'Croată',
    hu: 'Maghiară',
    is: 'Islandeză',
    it: 'Italiană',
    ja: 'Japoneză',
    lt: 'Lituaniană',
    lv: 'Letonă',
    mt: 'Malteză',
    nb: 'Norvegiană bokmål',
    nl: 'Neerlandeză',
    nn: 'Norvegiană nynorsk',
    pl: 'Poloneză',
    pt: 'Portugheză',
    ro: 'Română',
    ru: 'Rusă',
    sk: 'Slovacă',
    sl: 'Slovenă',
    sv: 'Suedeză',
    uk: 'Ucraineană',
    zh: 'Chineză, mandarină'
  }

}
export default lang
