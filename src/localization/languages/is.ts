import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Endurheimta {upprunalegt tungumál}',
    close: 'Loka',
    cancel: 'Hætta við'
  },
  labels: {
    developedBy: 'Þróað af {0}',
    original: 'Upprunalegur',
    machineTranslatedText: 'Texti úr vélþýðingu',
    machineTranslation: 'Vélþýðing',
    translationNotice: 'Valinn texti er þýddur sjálfvirkt með {0} þjónustunni',
    pageIsTranslated: 'Innihald síðunnar þýtt með {0}',
    pageIsTranslatedWithoutBranding: 'Innihald síðu vél þýtt.',
    pageIsTranslating: 'Vélþýðing á efni síðunnar er í vinnslu',
    noSegmentsFound: 'Engir hlutar fundust',
    selectLanguage: 'Veldu tungumál'
  },
  alerts: {
    errors: {
      default: 'Villa',
      connection: 'Villa við tengingu',
      systems: 'Engin kerfi eru tiltæk núna',
      forbidden: 'Vefsíðuþýðing bönnuð. Vinsamlegast athugaðu hvort leyfð lén innihaldi núverandi lén.',
      translation: 'Villa við að þýða síðuna, einhver texti gæti verið óþýddur.',
      translationSubStatus: {
        resourceNotFound: 'Auðlind fannst ekki'
      }
    }
  },
  languages: {
    ar: 'Arabíska',
    bg: 'Búlgarska',
    cs: 'Tékkneska',
    da: 'Danska',
    de: 'Þýska',
    el: 'Gríska',
    en: 'Enska',
    es: 'Spænska',
    et: 'Eistneska',
    fi: 'Finnska',
    fr: 'Franska',
    ga: 'Írska',
    hr: 'Króatíska',
    hu: 'Ungverska',
    is: 'Íslenska',
    it: 'Ítalska',
    ja: 'Japanska',
    lt: 'Litháíska',
    lv: 'Lettneska',
    mt: 'Maltneska',
    nb: 'Norskt bókmál',
    nl: 'Hollenska',
    nn: 'Nýnorska',
    pl: 'Pólska',
    pt: 'Portúgalska',
    ro: 'Rúmenska',
    ru: 'Rússneska',
    sk: 'Slóvakíska',
    sl: 'Slóvenska',
    sv: 'Sænska',
    uk: 'Úkraínska',
    zh: 'Kínverska, mandarín'
  }

}
export default lang
