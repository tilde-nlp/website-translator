import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Taasta {originaalkeel}',
    close: 'Sulge',
    cancel: 'T\u00fchista'
  },
  labels: {
    developedBy: 'V\u00e4lja t\u00f6\u00f6tatud {0}',
    original: 'Originaal',
    machineTranslatedText: 'Masint\u00f5lgitud tekst',
    machineTranslation: 'Masint\u00f5lge',
    translationNotice: 'Valitud teksti t\u00f5lgib automaatselt teenus {0}',
    pageIsTranslated: 'Lehek\u00fclje sisumasin t\u00f5lkinud {0}',
    pageIsTranslatedWithoutBranding: 'Lehekülje sisu masintõlkes.',
    pageIsTranslating: 'Poolelioleva lehek\u00fclje sisu masint\u00f5lge',
    noSegmentsFound: 'Segmente ei leitud',
    selectLanguage: 'Vali keel'
  },
  alerts: {
    errors: {
      default: 'Viga',
      connection: '\u00dchenduse viga',
      systems: 'Hetkel ei ole saadaval \u00fchtegi s\u00fcsteemi',
      forbidden: 'Veebilehe t\u00f5lge keelatud. Palun kontrollige, kas lubatud domeenid sisaldavad praegust domeeni',
      translation: 'Viga lehek\u00fclje t\u00f5lkimisel, m\u00f5ni tekst v\u00f5ib j\u00e4\u00e4da t\u00f5lkimata',
      translationSubStatus: {
        resourceNotFound: 'Ressurssi ei leitud'
      }
    }
  },
  languages: {
    ar: 'Araabia',
    bg: 'Bulgaaria',
    cs: 'Tšehhi',
    da: 'Taani',
    de: 'Saksa',
    el: 'Kreeka',
    en: 'Inglise',
    es: 'Hispaania',
    et: 'Eesti',
    fi: 'Soome',
    fr: 'Prantsuse',
    ga: 'Iiri',
    hr: 'Horvaadi',
    hu: 'Ungari',
    is: 'Islandi',
    it: 'Itaalia',
    ja: 'Jaapani',
    lt: 'Leedu',
    lv: 'Läti',
    mt: 'Malta',
    nb: 'Norra bokmål',
    nl: 'Hollandi',
    nn: 'Uusnorra',
    pl: 'Poola',
    pt: 'Portugali',
    ro: 'Rumeenia',
    ru: 'Vene',
    sk: 'Slovaki',
    sl: 'Sloveeni',
    sv: 'Rootsi',
    uk: 'Ukraina',
    zh: 'Hiina (mandariinihiina)'
  }

}
export default lang
