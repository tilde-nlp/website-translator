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
    ar: 'Arabais',
    bg: 'Bulgarais',
    cs: 'Seicis',
    da: 'Danmhairgis',
    de: 'Gearmailtis',
    el: 'Greugais',
    en: 'Beurla',
    es: 'Spàinntis',
    et: 'Eastoinis',
    fi: 'Fionnlannais',
    fr: 'Fraingis',
    ga: 'Gaeilge',
    hr: 'Cròthaisis',
    hu: 'Ungairis',
    is: 'Innis Tìlis',
    it: 'Eadailtis',
    ja: 'Seapanais',
    lt: 'Liotuainis',
    lv: 'Laitbheis',
    mt: 'Maltais',
    nb: 'Bokmål na Nirribhidh',
    nl: 'Duitsis',
    nn: 'Nynorsk na Nirribhidh',
    pl: 'Pòlainnis',
    pt: 'Portagailis',
    ro: 'Romàinis',
    ru: 'Ruisis',
    sk: 'Slòbhacais',
    sl: 'Slòbhainis',
    sv: 'Suainis',
    uk: 'Ucràinis',
    zh: 'Sìnis, Mandairinis'
  }

}
export default lang
