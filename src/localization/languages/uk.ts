import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Відновити {мову оригіналу}',
    close: 'Закрити',
    cancel: 'Скасувати'
  },
  labels: {
    developedBy: 'Розроблено {0}',
    original: 'Оригінал',
    machineTranslatedText: 'Машинний переклад',
    machineTranslation: 'Машинний переклад',
    translationNotice: 'Виділений текст перекладено автоматично сервісом {0}',
    pageIsTranslated: 'Вміст сторінки перекладено машинним перекладом {0}',
    pageIsTranslatedWithoutBranding: 'Вміст сторінки перекладено автоматично.',
    pageIsTranslating: 'Триває машинний переклад вмісту сторінки',
    noSegmentsFound: 'Сегментів не знайдено',
    selectLanguage: 'Оберіть мову'
  },
  alerts: {
    errors: {
      default: 'Помилка',
      connection: 'Помилка з\'єднання',
      systems: 'Наразі немає доступних систем',
      forbidden: 'Переклад сайту заборонено. Будь ласка, перевірте, чи є в списку дозволених доменів ваш поточний домен',
      translation: 'Помилка під час перекладу сторінки, частина тексту може залишитися неперекладеною',
      translationSubStatus: {
        resourceNotFound: 'Ресурс не знайдено'
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
