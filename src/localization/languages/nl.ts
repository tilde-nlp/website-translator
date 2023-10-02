import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Herstel {originele taal}',
    close: 'Sluit',
    cancel: 'Annuleren'
  },
  labels: {
    developedBy: 'Ontwikkeld door {0}',
    original: 'Original',
    machineTranslatedText: 'Door machine vertaalde tekst',
    machineTranslation: 'Machinevertaling',
    translationNotice: 'Geselecteerde tekst wordt automatisch vertaald door {0} service',
    pageIsTranslated: 'Pagina-inhoud machinaal vertaald door {0}',
    pageIsTranslatedWithoutBranding: 'Pagina-inhoud machinaal vertaald.',
    pageIsTranslating: 'Machinevertaling van pagina-inhoud in uitvoering',
    noSegmentsFound: 'Geen segmenten gevonden',
    selectLanguage: 'Selecteer taal'
  },
  alerts: {
    errors: {
      default: 'Fout',
      connection: 'Fout in verbinding',
      systems: 'Er zijn momenteel geen systemen beschikbaar',
      forbidden: 'Vertaling website verboden. Controleer of de toegestane domeinen het huidige domein bevatten',
      translation: 'Fout bij het vertalen van de pagina, sommige tekst kan onvertaald blijven',
      translationSubStatus: {
        resourceNotFound: 'Bron niet gevonden'
      }
    }
  },
  languages: {
    ar: 'Arabisch',
    bg: 'Bulgaars',
    cs: 'Tsjechisch',
    da: 'Deens',
    de: 'Duits',
    el: 'Grieks',
    en: 'Engels',
    es: 'Spaans',
    et: 'Estisch',
    fi: 'Fins',
    fr: 'Frans',
    ga: 'Iers',
    hr: 'Kroatisch',
    hu: 'Hongaars',
    is: 'IJslands',
    it: 'Italiaans',
    ja: 'Japans',
    lt: 'Litouws',
    lv: 'Lets',
    mt: 'Maltees',
    nb: 'Noors - Bokmål',
    nl: 'Nederlands',
    nn: 'Noors - Nynorsk',
    pl: 'Pools',
    pt: 'Portugees',
    ro: 'Roemeens',
    ru: 'Russisch',
    sk: 'Slowaaks',
    sl: 'Sloveens',
    sv: 'Zweeds',
    uk: 'Oekraïens',
    zh: 'Mandarijn'
  }

}
export default lang
