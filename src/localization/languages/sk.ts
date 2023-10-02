import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Obnoviť {pôvodný jazyk}',
    close: 'Zavrieť',
    cancel: 'Zrušiť'
  },
  labels: {
    developedBy: 'Vyvinutý spoločnosťou {0}',
    original: 'Pôvodný',
    machineTranslatedText: 'Strojovo preložený text',
    machineTranslation: 'Strojový preklad',
    translationNotice: 'Vybraný text je automaticky preložený službou {0}',
    pageIsTranslated: 'Obsah stránky strojovo preložený službou {0}',
    pageIsTranslatedWithoutBranding: 'Obsah stránky strojovo preložený.',
    pageIsTranslating: 'Prebieha strojový preklad obsahu stránky',
    noSegmentsFound: 'Nenašli sa žiadne segmenty',
    selectLanguage: 'Zvoľ jazyk'
  },
  alerts: {
    errors: {
      default: 'Error',
      connection: 'Chyba spojenia',
      systems: 'V súčasnosti nie sú k dispozícii žiadne systémy',
      forbidden: 'Preklad webovej stránky zakázaný. Skontrolujte, či povolené domény obsahujú aktuálnu doménu',
      translation: 'Chyba pri preklade stránky, niektoré texty môžu zostať nepreložené',
      translationSubStatus: {
        resourceNotFound: 'Zdroj nebol nájdený'
      }
    }
  },
  languages: {
    ar: 'Arabčina',
    bg: 'Bulharčina',
    cs: 'Čeština',
    da: 'Dánčina',
    de: 'Nemčina',
    el: 'Gréčtina',
    en: 'Angličtina',
    es: 'Španielčina',
    et: 'Estónčina',
    fi: 'Fínčina',
    fr: 'Francúzština',
    ga: 'Írčina',
    hr: 'Chorvátčina',
    hu: 'Maďarčina',
    is: 'Islandčina',
    it: 'Taliančina',
    ja: 'Japončina',
    lt: 'Litovčina',
    lv: 'Lotyština',
    mt: 'Maltčina',
    nb: 'Nórčina (bokmal)',
    nl: 'Holandčina',
    nn: 'Nórčina (nynorsk)',
    pl: 'Poľština',
    pt: 'Portugalčina',
    ro: 'Rumunčina',
    ru: 'Ruština',
    sk: 'Slovenčina',
    sl: 'Slovinčina',
    sv: 'Švédčina',
    uk: 'Ukrajinčina',
    zh: 'Čínština (mandarínska)'
  }

}
export default lang
