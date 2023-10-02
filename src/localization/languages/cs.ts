import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Obnovit {původní jazyk}',
    close: 'Zavřít',
    cancel: 'Zrušit'
  },
  labels: {
    developedBy: 'Vyvinuto {0}',
    original: 'Original',
    machineTranslatedText: 'Strojově přeložený text',
    machineTranslation: 'Strojový překlad',
    translationNotice: 'Vybraný text je automaticky přeložen službou {0}',
    pageIsTranslated: 'Obsah stránky je strojově přeložen službou {0}',
    pageIsTranslatedWithoutBranding: 'Obsah stránky strojově přeložen.',
    pageIsTranslating: 'Probíhá strojový překlad obsahu stránky',
    noSegmentsFound: 'Nenalezeny žádné segmenty',
    selectLanguage: 'Zvolte jazyk'
  },
  alerts: {
    errors: {
      default: 'Error',
      connection: 'Chyba spojení',
      systems: 'Žádné systémy nejsou momentálně k dispozici',
      forbidden: 'Překlad webových stránek zakázán. Zkontrolujte, zda povolené domény obsahují aktuální doménu',
      translation: 'Chyba při překladu stránky, některé texty mohou zůstat nepřeložené',
      translationSubStatus: {
        resourceNotFound: 'Zdroj nenalezen'
      }
    }
  },
  languages: {
    ar: 'Arabština',
    bg: 'Bulharština',
    cs: 'Čeština',
    da: 'Dánština',
    de: 'Němčina',
    el: 'Řečtina',
    en: 'Angličtina',
    es: 'Španělština',
    et: 'Estonština',
    fi: 'Finština',
    fr: 'Francouzština',
    ga: 'Irština',
    hr: 'Chorvatština',
    hu: 'Maďarština',
    is: 'Islandština',
    it: 'Italština',
    ja: 'Japonština',
    lt: 'Litevština',
    lv: 'Lotyština',
    mt: 'Maltština',
    nb: 'Norština (bokmål)',
    nl: 'Nizozemština',
    nn: 'Norština (nynorsk)',
    pl: 'Polština',
    pt: 'Portugalština',
    ro: 'Rumunština',
    ru: 'Ruština',
    sk: 'Slovenština',
    sl: 'Slovinština',
    sv: 'Švédština',
    uk: 'Ukrajinština',
    zh: 'Standardní čínština'
  }
}
export default lang
