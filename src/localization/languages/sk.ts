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
    ar: 'Arabčina',
    bg: 'Bulharčina',
    cs: 'Čeština',
    da: 'Dánčina',
    de: 'Nemčina',
    el: 'Gréčtina',
    en: 'Angličtina',
    es: 'Španielčina',
    et: 'Estónčina',
    fi: 'Fínčina',
    fr: 'Francúzština',
    ga: 'Írčina',
    hr: 'Chorvátčina',
    hu: 'Maďarčina',
    is: 'Islandčina',
    it: 'Taliančina',
    ja: 'Japončina',
    lt: 'Litovčina',
    lv: 'Lotyština',
    mt: 'Maltčina',
    nb: 'Nórčina (bokmal)',
    nl: 'Holandčina',
    nn: 'Nórčina (nynorsk)',
    pl: 'Poľština',
    pt: 'Portugalčina',
    ro: 'Rumunčina',
    ru: 'Ruština',
    sk: 'Slovenčina',
    sl: 'Slovinčina',
    sv: 'Švédčina',
    uk: 'Ukrajinčina',
    zh: 'Čínština (mandarínska)'
  }

}
export default lang
