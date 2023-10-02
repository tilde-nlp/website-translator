import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Restaurați {limba originală}',
    close: 'Închide',
    cancel: 'Anulează'
  },
  labels: {
    developedBy: 'Dezvoltat de {0}',
    original: 'Original',
    machineTranslatedText: 'Text tradus automat',
    machineTranslation: 'Traducere automată',
    translationNotice: 'Textul selectat este tradus automat de serviciul {0}',
    pageIsTranslated: 'Conținutul paginii este tradus automat de {0}',
    pageIsTranslatedWithoutBranding: 'Conținutul paginii tradus automat.',
    pageIsTranslating: 'Traducerea automată a conținutului paginii este în curs de desfășurare',
    noSegmentsFound: 'Nu s-au găsit segmente',
    selectLanguage: 'Selecteaza limba'
  },
  alerts: {
    errors: {
      default: 'Error',
      connection: 'Eroare de conexiune',
      systems: 'Nu există sisteme disponibile în prezent',
      forbidden: 'Traducerea site-ului este interzisă. Vă rugăm să verificați dacă domeniile permise conțin domeniul curent',
      translation: 'Eroare în timpul traducerii paginii, este posibil ca unele texte să rămână netraduse',
      translationSubStatus: {
        resourceNotFound: 'Resursele nu au fost găsite'
      }
    }
  },
  languages: {
    ar: 'Arabă',
    bg: 'Bulgară',
    cs: 'Cehă',
    da: 'Daneză',
    de: 'Germană',
    el: 'Greacă',
    en: 'Engleză',
    es: 'Spaniolă',
    et: 'Estonă',
    fi: 'Finlandeză',
    fr: 'Franceză',
    ga: 'Irlandeză',
    hr: 'Croată',
    hu: 'Maghiară',
    is: 'Islandeză',
    it: 'Italiană',
    ja: 'Japoneză',
    lt: 'Lituaniană',
    lv: 'Letonă',
    mt: 'Malteză',
    nb: 'Norvegiană bokmål',
    nl: 'Neerlandeză',
    nn: 'Norvegiană nynorsk',
    pl: 'Poloneză',
    pt: 'Portugheză',
    ro: 'Română',
    ru: 'Rusă',
    sk: 'Slovacă',
    sl: 'Slovenă',
    sv: 'Suedeză',
    uk: 'Ucraineană',
    zh: 'Chineză, mandarină'
  }

}
export default lang
