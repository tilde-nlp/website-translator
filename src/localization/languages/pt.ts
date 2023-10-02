import { ILocalizedLanguage } from '../../js/interfaces/ILocalizedLanguage'

const lang:ILocalizedLanguage = {
  controls: {
    restore: 'Restaurar {idioma original}',
    close: 'Fechar',
    cancel: 'Cancelar'
  },
  labels: {
    developedBy: 'Desenvolvido por {0}',
    original: 'Original',
    machineTranslatedText: 'Texto traduzido automaticamente',
    machineTranslation: 'Tradução automática',
    translationNotice: 'O texto seleccionado é traduzido automaticamente pelo serviço {0}',
    pageIsTranslated: 'Conteúdo da página traduzido automaticamente por {0}',
    pageIsTranslatedWithoutBranding: 'Conteúdo da página traduzido automaticamente.',
    pageIsTranslating: 'Tradução automática do conteúdo da página em curso',
    noSegmentsFound: 'Não foram encontrados segmentos',
    selectLanguage: 'Selecione o idioma'
  },
  alerts: {
    errors: {
      default: 'Erro',
      connection: 'Erro de conexão',
      systems: 'Nenhum sistema está actualmente disponível',
      forbidden: 'Tradução do sítio Web proibida. Verifique se os domínios permitidos contêm o domínio actual',
      translation: 'Erro ao traduzir a página, algum texto pode ficar por traduzir',
      translationSubStatus: {
        resourceNotFound: 'Recurso não encontrado'
      }
    }
  },
  languages: {
    ar: 'Árabe',
    bg: 'Búlgaro',
    cs: 'Tcheco',
    da: 'Dinamarquês',
    de: 'Alemão',
    el: 'Grego',
    en: 'Inglês',
    es: 'Espanhol',
    et: 'Estoniano',
    fi: 'Finlandês',
    fr: 'Francês',
    ga: 'Irlandês',
    hr: 'Croata',
    hu: 'Húngaro',
    is: 'Islandês',
    it: 'Italiano',
    ja: 'Japonês',
    lt: 'Lituano',
    lv: 'Letão',
    mt: 'Maltês',
    nb: 'Bokmål norueguês',
    nl: 'Holandês',
    nn: 'Nynorsk norueguês',
    pl: 'Polonês',
    pt: 'Português',
    ro: 'Romeno',
    ru: 'Russo',
    sk: 'Eslovaco',
    sl: 'Esloveno',
    sv: 'Sueco',
    uk: 'Ucraniano',
    zh: 'Chinês, mandarim'
  }

}
export default lang
