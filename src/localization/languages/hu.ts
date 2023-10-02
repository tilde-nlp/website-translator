import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Visszaállítani az {eredeti nyelv}',
    close: 'Bezárás',
    cancel: 'Mégsem'
  },
  labels: {
    developedBy: 'Kifejlesztette {0}',
    original: 'Eredeti',
    machineTranslatedText: 'Gépi fordítású szöveg',
    machineTranslation: 'Gépi fordítás',
    translationNotice: 'A kiválasztott szöveget a {0} szolgáltatás automatikusan fordítja',
    pageIsTranslated: 'Az oldal tartalmát {0} gépi fordította le',
    pageIsTranslatedWithoutBranding: 'Az oldal tartalma gépi fordításban.',
    pageIsTranslating: 'Az oldal tartalmának gépi fordítása folyamatban',
    noSegmentsFound: 'Nem találtunk szegmenseket',
    selectLanguage: 'Válasszon nyelvet'
  },
  alerts: {
    errors: {
      default: 'Hiba',
      connection: 'Csatlakozási hiba',
      systems: 'Jelenleg nincs elérhető rendszer',
      forbidden: 'Weboldal fordítása tilos. Kérjük, ellenőrizze, hogy az engedélyezett tartományok tartalmazzák-e az aktuális tartományt',
      translation: 'Hiba az oldal fordítása során, néhány szöveg lefordítatlanul maradhat',
      translationSubStatus: {
        resourceNotFound: 'Az erőforrás nem található'
      }
    }
  },
  languages: {
    ar: 'Arab',
    bg: 'Bolgár',
    cs: 'Cseh',
    da: 'Dán',
    de: 'Német',
    el: 'Görög',
    en: 'Angol',
    es: 'Spanyol',
    et: 'Észt',
    fi: 'Finn',
    fr: 'Francia',
    ga: 'Ír',
    hr: 'Horvát',
    hu: 'Magyar',
    is: 'Izlandi',
    it: 'Olasz',
    ja: 'Japán',
    lt: 'Litván',
    lv: 'Lett',
    mt: 'Máltai',
    nb: 'Norvég (bokmål)',
    nl: 'Holland',
    nn: 'Norvég (nynorsk)',
    pl: 'Lengyel',
    pt: 'Portugál',
    ro: 'Román',
    ru: 'Orosz',
    sk: 'Szlovák',
    sl: 'Szlovén',
    sv: 'Svéd',
    uk: 'Ukrán',
    zh: 'Mandarin'
  }

}
export default lang
