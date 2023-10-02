import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Ripristina {lingua originale}',
    close: 'Chiudi',
    cancel: 'Annulla'
  },
  labels: {
    developedBy: 'Sviluppato da {0}',
    original: 'Originale',
    machineTranslatedText: 'Testo tradotto a macchina',
    machineTranslation: 'Traduzione automatica',
    translationNotice: 'Il testo selezionato è tradotto automaticamente dal servizio {0}',
    pageIsTranslated: 'Contenuto della pagina tradotto automaticamente da {0}',
    pageIsTranslatedWithoutBranding: 'Contenuto della pagina tradotto automaticamente.',
    pageIsTranslating: 'Traduzione automatica del contenuto della pagina in corso',
    noSegmentsFound: 'Nessun segmento trovato',
    selectLanguage: 'Seleziona la lingua'
  },
  alerts: {
    errors: {
      default: 'Errore',
      connection: 'Errore di connessione',
      systems: 'Non ci sono sistemi attualmente disponibili',
      forbidden: 'Traduzione del sito web vietata. Controllare se i domini consentiti contengono il dominio corrente',
      translation: 'Errore durante la traduzione della pagina, alcuni testi potrebbero rimanere non tradotti',
      translationSubStatus: {
        resourceNotFound: 'Risorsa non trovata'
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
