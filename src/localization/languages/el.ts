import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Επαναφορά της {αρχικής γλώσσας}',
    close: 'Κλείσιμο',
    cancel: 'Ακύρωση'
  },
  labels: {
    developedBy: 'Αναπτύχθηκε από {0}',
    original: 'Original',
    machineTranslatedText: 'Μηχανικά μεταφρασμένο κείμενο',
    machineTranslation: 'Μηχανική μετάφραση',
    translationNotice: 'Το επιλεγμένο κείμενο μεταφράζεται αυτόματα από την υπηρεσία {0}',
    pageIsTranslated: 'Το περιεχόμενο της σελίδας μεταφράζεται αυτόματα από {0}',
    pageIsTranslatedWithoutBranding: 'Περιεχόμενο σελίδας μεταφρασμένο μηχανικά.',
    pageIsTranslating: 'Μηχανική μετάφραση του περιεχομένου της σελίδας σε εξέλιξη',
    noSegmentsFound: 'Δεν βρέθηκαν τμήματα',
    selectLanguage: 'Επιλέξτε γλώσσα'
  },
  alerts: {
    errors: {
      default: 'Σφάλμα',
      connection: 'Σφάλμα σύνδεσης',
      systems: 'Δεν υπάρχουν διαθέσιμα συστήματα',
      forbidden: 'Απαγορεύεται η μετάφραση του ιστότοπου. Παρακαλούμε ελέγξτε αν οι επιτρεπόμενοι τομείς περιέχουν τον τρέχοντα τομέα',
      translation: 'Σφάλμα κατά τη μετάφραση της σελίδας, ενδέχεται να μην μεταφραστεί κάποιο κείμενο',
      translationSubStatus: {
        resourceNotFound: 'Ο πόρος δεν βρέθηκε'
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
