import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Gå tilbage til det {oprindelige sprog}',
    close: 'Luk',
    cancel: 'Annuller'
  },
  labels: {
    developedBy: 'Udviklet af {0}',
    original: 'Original',
    machineTranslatedText: 'Maskinoversat tekst',
    machineTranslation: 'Maskinoversættelse',
    translationNotice: 'Valgt tekst oversættes automatisk af {0}-tjenesten',
    pageIsTranslated: 'Siden er maskinoversat af {0}',
    pageIsTranslatedWithoutBranding: 'Sidens indhold er maskinoversat.',
    pageIsTranslating: 'Maskinoversættelse af sidens indhold er i gang',
    noSegmentsFound: 'Ingen segmenter fundet',
    selectLanguage: 'Vælg sprog'
  },
  alerts: {
    errors: {
      default: 'Fejl',
      connection: 'Forbindelsesfejl',
      systems: 'Ingen systemer er tilgængelige i øjeblikket',
      forbidden: 'Oversættelse af hjemmeside forbudt. Tjek venligst, om tilladte domæner indeholder det aktuelle domæne',
      translation: 'Fejl under oversættelse af siden, noget tekst kan være uoversat',
      translationSubStatus: {
        resourceNotFound: 'Ressource ikke fundet'
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
