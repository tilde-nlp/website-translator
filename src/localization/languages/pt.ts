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
    ar: 'Árabe',
    bg: 'Búlgaro',
    cs: 'Tcheco',
    da: 'Dinamarquês',
    de: 'Alemão',
    el: 'Grego',
    en: 'Inglês',
    es: 'Espanhol',
    et: 'Estoniano',
    fi: 'Finlandês',
    fr: 'Francês',
    ga: 'Irlandês',
    hr: 'Croata',
    hu: 'Húngaro',
    is: 'Islandês',
    it: 'Italiano',
    ja: 'Japonês',
    lt: 'Lituano',
    lv: 'Letão',
    mt: 'Maltês',
    nb: 'Bokmål norueguês',
    nl: 'Holandês',
    nn: 'Nynorsk norueguês',
    pl: 'Polonês',
    pt: 'Português',
    ro: 'Romeno',
    ru: 'Russo',
    sk: 'Eslovaco',
    sl: 'Esloveno',
    sv: 'Sueco',
    uk: 'Ucraniano',
    zh: 'Chinês, mandarim'
  }

}
export default lang
