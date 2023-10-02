import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Återställ {originalspråk}',
    close: 'Stäng',
    cancel: 'Avbryt'
  },
  labels: {
    developedBy: 'Utvecklad av {0}',
    original: 'Original',
    machineTranslatedText: 'Maskinöversatt text',
    machineTranslation: 'Maskinöversättning',
    translationNotice: 'Markerad text har översatts automatiskt av tjänsten {0}',
    pageIsTranslated: 'Sidans innehåll maskinöversätts av {0}',
    pageIsTranslating: 'Sidans innehåll maskinöversätts',
    pageIsTranslatedWithoutBranding: 'Sidans innehåll maskinöversatt.',
    noSegmentsFound: 'Inga segment hittades',
    selectLanguage: 'Välj språk'
  },
  alerts: {
    errors: {
      default: 'Fel',
      connection: 'Anslutningsfel',
      systems: 'Inga system finns för närvarande tillgängliga',
      forbidden: 'Översättning av webbplatsen förbjuden. Kontrollera om tillåtna domäner innehåller aktuell domän',
      translationSubStatus: {
        resourceNotFound: 'Resurs hittades inte'
      },
      translation: 'Fel vid översättning av sidan, viss text kan ha lämnats oöversatt'
    }
  },
  languages: {
    ar: 'Arabiska',
    bg: 'Bulgariska',
    cs: 'Tjeckiska',
    da: 'Danska',
    de: 'Tyska',
    el: 'Grekiska',
    en: 'Engelska',
    es: 'Spanska',
    et: 'Estniska',
    fi: 'Finska',
    fr: 'Franska',
    ga: 'Iriska',
    hr: 'Kroatiska',
    hu: 'Ungerska',
    is: 'Isländska',
    it: 'Italienska',
    ja: 'Japanska',
    lt: 'Litauiska',
    lv: 'Lettiska',
    mt: 'Maltesiska',
    nb: 'Norskt bokmål',
    nl: 'Nederländska',
    nn: 'Nynorska',
    pl: 'Polska',
    pt: 'Portugisiska',
    ro: 'Rumänska',
    ru: 'Ryska',
    sk: 'Slovakiska',
    sl: 'Slovenska',
    sv: 'Svenska',
    uk: 'Ukrainska',
    zh: 'Mandarin'
  }

}
export default lang
