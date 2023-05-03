import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Grąžinti {originalią kalbą}',
    close: 'Uždaryti',
    cancel: 'Atšaukti'
  },
  labels: {
    developedBy: 'Sukūrė {0}',
    original: 'Originalas',
    machineTranslatedText: 'Mašininis vertimas',
    machineTranslation: 'Mašininis vertimas',
    translationNotice: 'Pasirinktas tekstas automatiškai išverstas naudojant {0} paslaugą',
    pageIsTranslated: 'Puslapį išvertė {0} mašininis vertimas',
    pageIsTranslating: 'Puslapio turinio vertimas yra mašininis',
    noSegmentsFound: 'Segmentų nerasta'
  },
  alerts: {
    errors: {
      default: 'Klaida',
      connection: 'Ryšio klaida',
      systems: 'Šiuo metu nėra pasiekiamų sistemų',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Klaida verčiant puslapį, dalis teksto gali likti neišversta',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
      }
    }
  },
  languages: {
    ar: 'Arabų',
    bg: 'Bulgarų',
    cs: 'Čekų',
    da: 'Danų',
    de: 'Vokiečių',
    el: 'Graikų',
    en: 'Anglų',
    es: 'Ispanų',
    et: 'Estų',
    fi: 'Suomių',
    fr: 'Prancūzų',
    ga: 'Airių',
    hr: 'Kroatų',
    hu: 'Vengrų',
    is: 'Islandų',
    it: 'Italų',
    ja: 'Japonų',
    lt: 'Lietuvių',
    lv: 'Latvių',
    mt: 'Maltiečių',
    nb: 'Norvegų bukmolas',
    nl: 'Olandų',
    nn: 'Naujoji norvegų',
    pl: 'Lenkų',
    pt: 'Portugalų',
    ro: 'Rumunų',
    ru: 'Rusų',
    sk: 'Slovakų',
    sl: 'Slovėnų',
    sv: 'Švedų',
    uk: 'Ukrainiečių',
    zh: 'Kinų, mandarinų'
  }

}
export default lang
