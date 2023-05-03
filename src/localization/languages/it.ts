import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Restore {original language}',
    close: 'Close',
    cancel: 'Cancel'
  },
  labels: {
    developedBy: 'Developed by {0}',
    original: 'Original',
    machineTranslatedText: 'Machine translated text',
    machineTranslation: 'Machine translation',
    translationNotice: 'Selected text is translated automatically by {0} service',
    pageIsTranslated: 'Page content machine translated by {0}',
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
    ar: 'Arabo',
    bg: 'Bulgaro',
    cs: 'Ceco',
    da: 'Danese',
    de: 'Tedesco',
    el: 'Greco',
    en: 'Inglese',
    es: 'Spagnolo',
    et: 'Estone',
    fi: 'Finlandese',
    fr: 'Francese',
    ga: 'Irlandese',
    hr: 'Croato',
    hu: 'Ungherese',
    is: 'Islandese',
    it: 'Italiano',
    ja: 'Giapponese',
    lt: 'Lituano',
    lv: 'Lettone',
    mt: 'Maltese',
    nb: 'Norvegese bokmål',
    nl: 'Olandese',
    nn: 'Norvegese nynorsk',
    pl: 'Polacco',
    pt: 'Portoghese',
    ro: 'Rumeno',
    ru: 'Russo',
    sk: 'Slovacco',
    sl: 'Sloveno',
    sv: 'Svedese',
    uk: 'Ucraino',
    zh: 'Cinese (mandarino)'
  }

}
export default lang
