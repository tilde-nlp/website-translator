import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Atgriezties pie satura {oriģinālvalodā}',
    close: 'Aizvērt',
    cancel: 'Atcelt'
  },
  labels: {
    developedBy: 'Developed by {0}',
    original: 'Oriģināls',
    machineTranslatedText: 'Mašīntulkots teksts',
    machineTranslation: 'Machine translation',
    translationNotice: 'Iezīmētais teksts ir automātiski pārtulkots izmantojot {0} servisu',
    pageIsTranslated: 'Lapas satura mašīntulkojumu nodrošina {0}',
    pageIsTranslating: 'Lapas saturs tiek mašīntulkots',
    noSegmentsFound: 'No segments found'
  },
  alerts: {
    errors: {
      default: 'Kļūda',
      connection: 'Savienojuma kļūda',
      systems: 'Nav pieejamu sistēmu',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Kļūda tulkojot mājaslapu. Daļa teksta var nebūt iztulkota.',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
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
