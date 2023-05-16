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
    ar: 'Αραβικά',
    bg: 'Βουλγαρικά',
    cs: 'Τσεχικά',
    da: 'Δανικά',
    de: 'Γερμανικά',
    el: 'Ελληνικά',
    en: 'Αγγλικά',
    es: 'Ισπανικά',
    et: 'Εσθονικά',
    fi: 'Φινλανδικά',
    fr: 'Γαλλικά',
    ga: 'Ιρλανδικά',
    hr: 'Κροατικά',
    hu: 'Ουγγρικά',
    is: 'Ισλανδικά',
    it: 'Ιταλικά',
    ja: 'Ιαπωνικά',
    lt: 'Λιθουανικά',
    lv: 'Λετονικά',
    mt: 'Μαλτεζικά',
    nb: 'Νορβηγικά Μποκμάλ',
    nl: 'Ολλανδικά',
    nn: 'Νορβηγικά Νινόρσκ',
    pl: 'Πολωνικά',
    pt: 'Πορτογαλικά',
    ro: 'Ρουμανικά',
    ru: 'Ρωσικά',
    sk: 'Σλοβακικά',
    sl: 'Σλοβενικά',
    sv: 'Σουηδικά',
    uk: 'Ουκρανικά',
    zh: 'Κινεζικά, Μανδαρινικά'
  }

}
export default lang
