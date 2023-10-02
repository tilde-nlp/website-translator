import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Revenir à la {langue d\'origine}',
    close: 'Fermer',
    cancel: 'Annuler'
  },
  labels: {
    developedBy: 'Développé par {0}',
    original: 'Original',
    machineTranslatedText: 'Texte traduit automatiquement',
    machineTranslation: 'Traduction automatique',
    translationNotice: 'Le texte sélectionné est traduit automatiquement par le service {0}',
    pageIsTranslated: 'Page traduite automatiquement par {0}',
    pageIsTranslatedWithoutBranding: 'Contenu de la page traduit mécaniquement.',
    pageIsTranslating: 'Le contenu de la page est en cours de traduction automatique',
    noSegmentsFound: 'Aucun segment trouvé',
    selectLanguage: 'Choisir la langue'
  },
  alerts: {
    errors: {
      default: 'Erreur',
      connection: 'Erreur de connexion',
      systems: 'Aucun système n’est actuellement disponible',
      forbidden: 'Traduction du site web interdite. Veuillez vérifier si les domaines autorisés contiennent le domaine actuel',
      translation: 'Erreur lors de la traduction de la page, il est possible qu’une partie du texte ne soit pas traduite',
      translationSubStatus: {
        resourceNotFound: 'Ressource non trouvée'
      }
    }
  },
  languages: {
    ar: 'Arabe',
    bg: 'Bulgare',
    cs: 'Tchèque',
    da: 'Danois',
    de: 'Allemand',
    el: 'Grec',
    en: 'Anglais',
    es: 'Espagnol',
    et: 'Estonien',
    fi: 'Finnois',
    fr: 'Français',
    ga: 'Irlandais',
    hr: 'Croate',
    hu: 'Hongrois',
    is: 'Islandais',
    it: 'Italien',
    ja: 'Japonais',
    lt: 'Lituanien',
    lv: 'Letton',
    mt: 'Maltais',
    nb: 'Norvégien bokmål',
    nl: 'Néerlandais',
    nn: 'Norvégien nynorsk',
    pl: 'Polonais',
    pt: 'Portugais',
    ro: 'Roumain',
    ru: 'Russe',
    sk: 'Slovaque',
    sl: 'Slovène',
    sv: 'Suédois',
    uk: 'Ukrainien',
    zh: 'Chinois mandarin'
  }

}
export default lang
