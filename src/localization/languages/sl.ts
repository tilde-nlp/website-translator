import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Restore {original language}',
    close: 'Zapri',
    cancel: 'Prekliči'
  },
  labels: {
    developedBy: 'Razvil {0}',
    original: 'Izvirnik',
    machineTranslatedText: 'Strojno prevedeno besedilo',
    machineTranslation: 'Strojno prevajanje',
    translationNotice: 'Izbrano besedilo je samodejno prevedeno s storitvijo {0}',
    pageIsTranslated: 'Vsebina strani je strojno prevedena s strani {0}',
    pageIsTranslatedWithoutBranding: 'Vsebina strani je strojno prevedena.',
    pageIsTranslating: 'Strojno prevajanje vsebine strani v teku',
    noSegmentsFound: 'Ni najdenih segmentov',
    selectLanguage: 'Izberi jezik'
  },
  alerts: {
    errors: {
      default: 'Napaka',
      connection: 'Napaka v povezavi',
      systems: 'Trenutno ni na voljo nobenih sistemov',
      forbidden: 'Prevajanje spletne strani je prepovedano. Preverite, ali dovoljene domene vsebujejo trenutno domeno',
      translation: 'Napaka pri prevajanju strani, nekatera besedila lahko ostanejo neprevedena',
      translationSubStatus: {
        resourceNotFound: 'Vir ni najden'
      }
    }
  },
  languages: {
    ar: 'Arabščina',
    bg: 'Bolgarščina',
    cs: 'Češčina',
    da: 'Danščina',
    de: 'Nemščina',
    el: 'Grščina',
    en: 'Angleščina',
    es: 'Španščina',
    et: 'Estonščina',
    fi: 'Finščina',
    fr: 'Francoščina',
    ga: 'Irščina',
    hr: 'Hrvaščina',
    hu: 'Madžarščina',
    is: 'Islandščina',
    it: 'Italijanščina',
    ja: 'Japonščina',
    lt: 'Litovščina',
    lv: 'Latvijščina',
    mt: 'Malteščina',
    nb: 'Knjižna norveščina',
    nl: 'Nizozemščina',
    nn: 'Novonorveščina',
    pl: 'Poljščina',
    pt: 'Portugalščina',
    ro: 'Romunščina',
    ru: 'Ruščina',
    sk: 'Slovaščina',
    sl: 'Slovenščina',
    sv: 'Švedščina',
    uk: 'Ukrajinščina',
    zh: 'Kitajščina (mandarinščina)'
  }

}
export default lang
