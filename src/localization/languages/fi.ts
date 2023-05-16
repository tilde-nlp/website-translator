import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Palaa {alkuperäiskieleen}',
    close: 'Sulje',
    cancel: 'Peruuta'
  },
  labels: {
    developedBy: 'Kehittäjä: {0}',
    original: 'Alkuperäinen',
    machineTranslatedText: 'Koneen kääntämä teksti',
    machineTranslation: 'Konekäännös',
    translationNotice: 'Palvelu {0} kääntää valitun tekstin automaattisesti',
    pageIsTranslated: '{0} on käännättänyt sivun konekäännöksenä',
    pageIsTranslating: 'Kone kääntää sivun sisältöä',
    noSegmentsFound: 'Segmenttejä ei löytynyt'
  },
  alerts: {
    errors: {
      default: 'Virhe',
      connection: 'Yhteysvirhe',
      systems: 'Järjestelmiä ei tällä hetkellä ole käytettävissä',
      forbidden: 'Website translation forbidden. Please check if allowed domains contains current domain',
      translation: 'Virhe käännettäessä sivua. Osaa tekstistä ei välttämättä käännetä',
      translationSubStatus: {
        resourceNotFound: 'Resource not found'
      }
    }
  },
  languages: {
    ar: 'Arabia',
    bg: 'Bulgaria',
    cs: 'Tšekki',
    da: 'Tanska',
    de: 'Saksa',
    el: 'Kreikka',
    en: 'Englanti',
    es: 'Espanja',
    et: 'Viro',
    fi: 'Suomi',
    fr: 'Ranska',
    ga: 'Iiri',
    hr: 'Kroatia',
    hu: 'Unkari',
    is: 'Islanti',
    it: 'Italia',
    ja: 'Japani',
    lt: 'Liettua',
    lv: 'Latvia',
    mt: 'Malta',
    nb: 'Norjan bokmål',
    nl: 'Hollanti',
    nn: 'Norjan nynorsk',
    pl: 'Puola',
    pt: 'Portugali',
    ro: 'Romania',
    ru: 'Venäjä',
    sk: 'Slovakki',
    sl: 'Sloveeni',
    sv: 'Ruotsi',
    uk: 'Ukraina',
    zh: 'Kiina (mandariini)'
  }

}
export default lang
