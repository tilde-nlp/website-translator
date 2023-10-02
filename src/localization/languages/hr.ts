import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Vrati {izvorni jezik}',
    close: 'Zatvori',
    cancel: 'Otkaži'
  },
  labels: {
    developedBy: 'Razvio {0}',
    original: 'Izvornik',
    machineTranslatedText: 'Strojno preveden tekst',
    machineTranslation: 'Strojno prevođenje',
    translationNotice: 'Odabrani tekst automatski je preveo servis {0}',
    pageIsTranslated: 'Sadržaj stranice automatski je preveo servis {0}',
    pageIsTranslatedWithoutBranding: 'Sadržaj stranice strojno preveden.',
    pageIsTranslating: 'Strojno prevođenje sadržaja stranice u tijeku',
    noSegmentsFound: 'Nisu pronađeni segmenti',
    selectLanguage: 'Izaberi jezik'
  },
  alerts: {
    errors: {
      default: 'Pogrješka',
      connection: 'Pogrješka pri povezivanju',
      systems: 'Trenutno nema dostupnih sustava',
      forbidden: 'Prijevod mrežnoga sjedišta je zabranjen. Provjerite sadrže li dopuštene mrežne adrese trenutnu adresu.',
      translation: 'Pogrješka tijekom prevođenja stranice, dio teksta možda je ostao nepreveden',
      translationSubStatus: {
        resourceNotFound: 'Resurs nije pronađen'
      }
    }
  },
  languages: {
    ar: 'Arapski',
    bg: 'Bugarski',
    cs: 'Češki',
    da: 'Danski',
    de: 'Njemački',
    el: 'Grčki',
    en: 'Engleski',
    es: 'Španjolski',
    et: 'Estonski',
    fi: 'Finski',
    fr: 'Francuski',
    ga: 'Irski',
    hr: 'Hrvatski',
    hu: 'Mađarski',
    is: 'Islandski',
    it: 'Talijanski',
    ja: 'Japanski',
    lt: 'Litavski',
    lv: 'Latvijski',
    mt: 'Malteški',
    nb: 'Norveški bokmål',
    nl: 'Nizozemski',
    nn: 'Norveški nynorsk',
    pl: 'Poljski',
    pt: 'Portugalski',
    ro: 'Rumunjski',
    ru: 'Ruski',
    sk: 'Slovački',
    sl: 'Slovenski',
    sv: 'Švedski',
    uk: 'Ukrajinski',
    zh: 'Kineski, mandarinski'
  }

}
export default lang
