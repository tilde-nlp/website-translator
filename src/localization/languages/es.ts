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
    cs: 'Checo',
    da: 'Danés',
    de: 'Alemán',
    el: 'Griego',
    en: 'Inglés',
    es: 'Español',
    et: 'Estonio',
    fi: 'Finés',
    fr: 'Francés',
    ga: 'Irlandés',
    hr: 'Croata',
    hu: 'Húngaro',
    is: 'Islandés',
    it: 'Italiano',
    ja: 'Japonés',
    lt: 'Lituano',
    lv: 'Letón',
    mt: 'Maltés',
    nb: 'Noruego bokmal',
    nl: 'Neerlandés',
    nn: 'Noruego nynorsk',
    pl: 'Polaco',
    pt: 'Portugués',
    ro: 'Rumano',
    ru: 'Ruso',
    sk: 'Eslovaco',
    sl: 'Esloveno',
    sv: 'Sueco',
    uk: 'Ucraniano',
    zh: 'Chino mandarín'
  }

}
export default lang
