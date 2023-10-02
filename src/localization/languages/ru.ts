import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Восстановить {оригинальный язык}',
    close: 'Закрыть',
    cancel: 'Отменить'
  },
  labels: {
    developedBy: 'Разработано {0}',
    original: 'Оригинал',
    machineTranslatedText: 'Машинный перевод',
    machineTranslation: 'Машинный перевод',
    translationNotice: 'Выбранный текст переводится службой {0} автоматически',
    pageIsTranslated: 'Машинный перевод содержимого страницы выполнен {0}',
    pageIsTranslatedWithoutBranding: 'Машинный перевод содержимого страницы.',
    pageIsTranslating: 'Содержимое страницы переводится машинным способом',
    noSegmentsFound: 'Сегменты не найдены',
    selectLanguage: 'Выберите язык'
  },
  alerts: {
    errors: {
      default: 'Ошибка',
      connection: 'Ошибка подключения',
      systems: 'В настоящее время нет доступных систем',
      forbidden: 'Перевод сайта запрещен. Пожалуйста, проверьте, содержит ли разрешенный домен текущий домен',
      translation: 'Ошибка при переводе страницы, некоторый части текста может остаться непереведенными',
      translationSubStatus: {
        resourceNotFound: 'Ресурс не найден'
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
