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
    ar: 'Arapski',
    bg: 'Bugarski',
    cs: 'Češki',
    da: 'Danski',
    de: 'Njemački',
    el: 'Grčki',
    en: 'Engleski',
    es: 'Španjolski',
    et: 'Estonski',
    fi: 'Finski',
    fr: 'Francuski',
    ga: 'Irski',
    hr: 'Hrvatski',
    hu: 'Mađarski',
    is: 'Islandski',
    it: 'Talijanski',
    ja: 'Japanski',
    lt: 'Litavski',
    lv: 'Latvijski',
    mt: 'Malteški',
    nb: 'Norveški bokmål',
    nl: 'Nizozemski',
    nn: 'Norveški nynorsk',
    pl: 'Poljski',
    pt: 'Portugalski',
    ro: 'Rumunjski',
    ru: 'Ruski',
    sk: 'Slovački',
    sl: 'Slovenski',
    sv: 'Švedski',
    uk: 'Ukrajinski',
    zh: 'Kineski, mandarinski'
  }

}
export default lang
