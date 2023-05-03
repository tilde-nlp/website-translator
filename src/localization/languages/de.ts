import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Zurück zur {Originalsprache}',
    close: 'Schließen',
    cancel: 'Abbrechen'
  },
  labels: {
    developedBy: 'Entwickelt von {0}',
    original: 'Original',
    machineTranslatedText: 'Maschinell übersetzter Text',
    machineTranslation: 'Maschinelle Übersetzung:',
    translationNotice: 'Ausgewählte Sätze werden automatisch übersetzt mit {0}',
    pageIsTranslated: 'Seite maschinell übersetzt von {0}',
    pageIsTranslating: 'Seiteninhalte werden maschinell übersetzt',
    noSegmentsFound: 'Keine Segmente gefunden'
  },
  alerts: {
    errors: {
      default: 'Fehler',
      connection: 'Verbindungsproblem',
      systems: 'Derzeit sind keine Systeme verfügbar',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Fehler beim Übersetzen der Seite, Teile des Texts bleiben möglicherweise unübersetzt',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
      }
    }
  },
  languages: {
    ar: 'Arabisch',
    bg: 'Bulgarisch',
    cs: 'Tschechisch',
    da: 'Dänisch',
    de: 'Deutsch',
    el: 'Griechisch',
    en: 'Englisch',
    es: 'Spanisch',
    et: 'Estnisch',
    fi: 'Finnisch',
    fr: 'Französisch',
    ga: 'Irisch',
    hr: 'Kroatisch',
    hu: 'Ungarisch',
    is: 'Isländisch',
    it: 'Italienisch',
    ja: 'Japanisch',
    lt: 'Litauisch',
    lv: 'Lettisch',
    mt: 'Maltesisch',
    nb: 'Norwegisch (Bokmål)',
    nl: 'Niederländisch',
    nn: 'Norwegisch (Nynorsk)',
    pl: 'Polnisch',
    pt: 'Portugiesisch',
    ro: 'Rumänisch',
    ru: 'Russisch',
    sk: 'Slowakisch',
    sl: 'Slowenisch',
    sv: 'Schwedisch',
    uk: 'Ukrainisch',
    zh: 'Chinesisch (Mandarin)'
  }

}
export default lang
