import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Atgriezties pie satura {oriģinālvalodā}',
    close: 'Aizvērt',
    cancel: 'Atcelt'
  },
  labels: {
    developedBy: 'Izstrādājis {0}',
    original: 'Oriģināls',
    machineTranslatedText: 'Mašīntulkots teksts',
    machineTranslation: 'Mašīntulkojums',
    translationNotice: 'Iezīmētais teksts ir automātiski pārtulkots izmantojot {0} servisu',
    pageIsTranslated: 'Lapas satura mašīntulkojumu nodrošina {0}',
    pageIsTranslatedWithoutBranding: 'Lapas saturs ir mašīntulkots.',
    pageIsTranslating: 'Lapas saturs tiek mašīntulkots',
    noSegmentsFound: 'Segmenti nav atrasti',
    selectLanguage: 'Izvēlēties valodu'
  },
  alerts: {
    errors: {
      default: 'Kļūda',
      connection: 'Savienojuma kļūda',
      systems: 'Nav pieejamu sistēmu',
      forbidden: 'Tīmekļa vietnes tulkošana ir aizliegta. Lūdzu, pārbaudiet, vai atļautajos domēnos ir pašreizējais domēns',
      translation: 'Kļūda tulkojot mājaslapu. Daļa teksta var nebūt iztulkota.',
      translationSubStatus: {
        resourceNotFound: 'Resurss nav atrasts'
      }
    }
  },
  languages: {
    ar: 'Arābu',
    bg: 'Bulgāru',
    cs: 'Čehu',
    da: 'Dāņu',
    de: 'Vācu',
    el: 'Grieķu',
    en: 'Angļu',
    es: 'Spāņu',
    et: 'Igauņu',
    fi: 'Somu',
    fr: 'Franču',
    ga: 'Īru',
    hr: 'Horvātu',
    hu: 'Ungāru',
    is: 'Islandiešu',
    it: 'Itāļu',
    ja: 'Japāņu',
    lt: 'Lietuviešu',
    lv: 'Latviešu',
    mt: 'Maltiešu',
    nb: 'Norvēģu bukmols',
    nl: 'Holandiešu',
    nn: 'Jaunnorvēģu',
    pl: 'Poļu',
    pt: 'Portugāļu',
    ro: 'Rumāņu',
    ru: 'Krievu',
    sk: 'Slovāku',
    sl: 'Slovēņu',
    sv: 'Zviedru',
    uk: 'Ukraiņu',
    zh: 'Ķīniešu (mandarīnu)'
  }

}
export default lang
