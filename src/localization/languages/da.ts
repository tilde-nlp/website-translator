import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Gå tilbage til det {oprindelige sprog}',
    close: 'Close',
    cancel: 'Cancel'
  },
  labels: {
    developedBy: 'Developed by {0}',
    original: 'Original',
    machineTranslatedText: 'Machine translated text',
    machineTranslation: 'Machine translation',
    translationNotice: 'Selected text is translated automatically by {0} service',
    pageIsTranslated: 'Siden er maskinoversat af {0}',
    pageIsTranslating: 'Machine translation of page content in progress',
    noSegmentsFound: 'No segments found'
  },
  alerts: {
    errors: {
      default: 'Error',
      connection: 'Connection error',
      systems: 'No systems are currently available',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Error while translating page, some text may be left untranslated',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
      }
    }
  },
  languages: {
    ar: 'Arabisk',
    bg: 'Bulgarsk',
    cs: 'Tjekkisk',
    da: 'Dansk',
    de: 'Tysk',
    el: 'Græsk',
    en: 'Engelsk',
    es: 'Spansk',
    et: 'Estisk',
    fi: 'Finsk',
    fr: 'Fransk',
    ga: 'Irsk',
    hr: 'Kroatisk',
    hu: 'Ungarsk',
    is: 'Islandsk',
    it: 'Italiensk',
    ja: 'Japansk',
    lt: 'Litauisk',
    lv: 'Lettisk',
    mt: 'Maltesisk',
    nb: 'Bokmål',
    nl: 'Nederlandsk',
    nn: 'Nynorsk',
    pl: 'Polsk',
    pt: 'Portugisisk',
    ro: 'Rumænsk',
    ru: 'Russisk',
    sk: 'Slovakisk',
    sl: 'Slovensk',
    sv: 'Svensk',
    uk: 'Ukrainsk',
    zh: 'Mandarin (Kina)'
  }

}
export default lang
