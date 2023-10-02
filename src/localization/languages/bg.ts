import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Възстановяване на {оригинален език}',
    close: 'Затвори',
    cancel: 'Отказ'
  },
  labels: {
    developedBy: 'Разработено от {0}',
    original: 'Оригинален',
    machineTranslatedText: 'Машинно преведен текст',
    machineTranslation: 'Машинен превод',
    translationNotice: 'Избраният текст е преведен автоматично от услугата {0}',
    pageIsTranslated: 'Съдържанието на страницата е преведено машинно от {0}',
    pageIsTranslatedWithoutBranding: 'Съдържанието на страницата е преведено машинно.',
    pageIsTranslating: 'Машинният превод на съдържанието на страницата е в ход',
    noSegmentsFound: 'Не са намерени сегменти',
    selectLanguage: 'Избери език'
  },
  alerts: {
    errors: {
      default: 'Грешка',
      connection: 'Грешка при свързване',
      systems: 'В момента няма налични системи',
      forbidden: 'Преводът на уебсайтове е забранен. Моля, проверете дали разрешените домейни съдържат текущия домейн',
      translation: 'Грешка при превода на страницата, част от текста може да остане непреведен',
      translationSubStatus: {
        resourceNotFound: 'Ресурсът не е намерен'
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
