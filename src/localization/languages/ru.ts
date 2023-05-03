import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Restore {original language}',
    close: 'Закрыть',
    cancel: 'Отменить'
  },
  labels: {
    developedBy: 'Developed by {0}',
    original: 'Оригинал',
    machineTranslatedText: 'Машинный перевод',
    machineTranslation: 'Machine translation',
    translationNotice: 'Выбранный текст переводится службой {0} автоматически',
    pageIsTranslated: 'Page content machine translated by {0}',
    pageIsTranslating: 'Содержимое страницы переводится машинным способом',
    noSegmentsFound: 'No segments found'
  },
  alerts: {
    errors: {
      default: 'Ошибка',
      connection: 'Ошибка подключения',
      systems: 'В настоящее время нет доступных систем',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Ошибка при переводе страницы, некоторый части текста может остаться непереведенными',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
      }
    }
  },
  languages: {
    ar: 'Арабский',
    bg: 'Болгарский',
    cs: 'Чешский',
    da: 'Датский',
    de: 'Немецкий',
    el: 'Греческий',
    en: 'Английский',
    es: 'Испанский',
    et: 'Эстонский',
    fi: 'Финский',
    fr: 'Французский',
    ga: 'Ирландский',
    hr: 'Хорватский',
    hu: 'Венгерский',
    is: 'Исландский',
    it: 'Итальянский',
    ja: 'Японский',
    lt: 'Литовский',
    lv: 'Латышский',
    mt: 'Мальтийский',
    nb: 'Норвежский букмол',
    nl: 'Нидерландский',
    nn: 'Нюнорск',
    pl: 'Польский',
    pt: 'Португальский',
    ro: 'Румынский',
    ru: 'Русский',
    sk: 'Словацкий',
    sl: 'Словенский',
    sv: 'Шведский',
    uk: 'Украинский',
    zh: 'Севернокитайский'
  }

}
export default lang
