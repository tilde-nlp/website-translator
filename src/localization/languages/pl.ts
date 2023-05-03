import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Przywróć {oryginalny język}',
    close: 'Zamknij',
    cancel: 'Anuluj'
  },
  labels: {
    developedBy: 'Opracowano przez {0}',
    original: 'Oryginał',
    machineTranslatedText: 'Tekst przetłumaczony automatycznie',
    machineTranslation: 'Tłumaczenie maszynowe',
    translationNotice: 'Wybrany tekst jest tłumaczony automatycznie przez serwis {0}',
    pageIsTranslated: 'Strona została przetłumaczona maszynowo przez {0}',
    pageIsTranslating: 'Treść strony jest tłumaczona automatycznie',
    noSegmentsFound: 'Nie znaleziono segmentów'
  },
  alerts: {
    errors: {
      default: 'Błąd',
      connection: 'Błąd połączenia',
      systems: 'Obecnie brak dostępnych systemów',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Błąd podczas tłumaczenia strony, część tekstu może pozostać nieprzetłumaczona',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
      }
    }
  },
  languages: {
    ar: 'Arabski',
    bg: 'Bułgarski',
    cs: 'Czeski',
    da: 'Duński',
    de: 'Niemiecki',
    el: 'Grecki',
    en: 'Angielski',
    es: 'Hiszpański',
    et: 'Estoński',
    fi: 'Fiński',
    fr: 'Francuski',
    ga: 'Irlandzki',
    hr: 'Chorwacki',
    hu: 'Węgierski',
    is: 'Islandzki',
    it: 'Włoski',
    ja: 'Japoński',
    lt: 'Litewski',
    lv: 'Łotewski',
    mt: 'Maltański',
    nb: 'Norweski (bokmål)',
    nl: 'Niderlandzki',
    nn: 'Norweski (nynorsk)',
    pl: 'Polski',
    pt: 'Portugalski',
    ro: 'Rumuński',
    ru: 'Rosyjski',
    sk: 'Słowacki',
    sl: 'Słoweński',
    sv: 'Szwedzki',
    uk: 'Ukraiński',
    zh: 'Chiński mandaryński'
  }

}
export default lang
