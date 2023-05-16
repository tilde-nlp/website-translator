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
    ar: 'Арабська',
    bg: 'Болгарська',
    cs: 'Чеська',
    da: 'Данська',
    de: 'Німецька',
    el: 'Грецька',
    en: 'Англійська',
    es: 'Іспанська',
    et: 'Естонська',
    fi: 'Фінська',
    fr: 'Французька',
    ga: 'Ірландська',
    hr: 'Хорватська',
    hu: 'Угорська',
    is: 'Ісландська',
    it: 'Італійська',
    ja: 'Японська',
    lt: 'Литовська',
    lv: 'Латиська',
    mt: 'Мальтійська',
    nb: 'Норвезька (букмол)',
    nl: 'Нідерландська',
    nn: 'Норвезька (нюношк)',
    pl: 'Польська',
    pt: 'Португальська',
    ro: 'Румунська',
    ru: 'Російська',
    sk: 'Словацька',
    sl: 'Словенська',
    sv: 'Шведська',
    uk: 'Українська',
    zh: 'Китайська мандаринська'
  }
}

export default lang
