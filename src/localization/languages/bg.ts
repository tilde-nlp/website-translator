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
    ar: 'Арабски',
    bg: 'Български',
    cs: 'Чешки',
    da: 'Датски',
    de: 'Немски',
    el: 'Гръцки',
    en: 'Английски',
    es: 'Испански',
    et: 'Естонски',
    fi: 'Фински',
    fr: 'Френски',
    ga: 'Ирландски',
    hr: 'Хърватски',
    hu: 'Унгарски',
    is: 'Исландски',
    it: 'Италиански',
    ja: 'Японски',
    lt: 'Литовски',
    lv: 'Латвийски',
    mt: 'Малтийски',
    nb: 'Норвежки (букмол)',
    nl: 'Нидерландски',
    nn: 'Норвежки (нюношк)',
    pl: 'Полски',
    pt: 'Португалски',
    ro: 'Румънски',
    ru: 'Руски',
    sk: 'Словашки',
    sl: 'Словенски',
    sv: 'Шведски',
    uk: 'Украински',
    zh: 'Китайски, мандарин'
  }
}
export default lang
