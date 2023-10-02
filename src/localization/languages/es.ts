import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Restaurar {idioma original}',
    close: 'Cerrar',
    cancel: 'Cancelar'
  },
  labels: {
    developedBy: 'Desarrollado por {0}',
    original: 'Original',
    machineTranslatedText: 'Texto traducido automáticamente',
    machineTranslation: 'Traducción automática',
    translationNotice: 'El texto seleccionado es traducido automáticamente por el servicio {0}',
    pageIsTranslated: 'Contenido de la página traducido automáticamente por {0}',
    pageIsTranslatedWithoutBranding: 'Contenido de la página traducido automáticamente.',
    pageIsTranslating: 'Traducción automática del contenido de la página en curso',
    noSegmentsFound: 'No se han encontrado segmentos',
    selectLanguage: 'Seleccione el idioma'
  },
  alerts: {
    errors: {
      default: 'Error',
      connection: 'Error de conexión',
      systems: 'No hay sistemas disponibles',
      forbidden: 'La traducción del sitio está prohibida. Por favor, compruebe si los dominios permitidos contienen el dominio actual',
      translation: 'Error al traducir la página, es posible que parte del texto no se traduzca',
      translationSubStatus: {
        resourceNotFound: 'Recurso no encontrado'
      }
    }
  },
  languages: {
    ar: 'Árabe',
    bg: 'Búlgaro',
    cs: 'Checo',
    da: 'Danés',
    de: 'Alemán',
    el: 'Griego',
    en: 'Inglés',
    es: 'Español',
    et: 'Estonio',
    fi: 'Finés',
    fr: 'Francés',
    ga: 'Irlandés',
    hr: 'Croata',
    hu: 'Húngaro',
    is: 'Islandés',
    it: 'Italiano',
    ja: 'Japonés',
    lt: 'Lituano',
    lv: 'Letón',
    mt: 'Maltés',
    nb: 'Noruego bokmal',
    nl: 'Neerlandés',
    nn: 'Noruego nynorsk',
    pl: 'Polaco',
    pt: 'Portugués',
    ro: 'Rumano',
    ru: 'Ruso',
    sk: 'Eslovaco',
    sl: 'Esloveno',
    sv: 'Sueco',
    uk: 'Ucraniano',
    zh: 'Chino mandarín'
  }

}
export default lang
