import { BehaviorSubject } from 'rxjs'
import { ILanguage } from './interfaces/ILanguage'
import { ILocalizedLanguage } from './interfaces/ILocalizedLanguage'
import { IPluginOptions } from './interfaces/IPluginOptions'
import languageCodes from '../localization/langCodes'

function normalizeLanguageCode (langCode:string) {
  return langCode.toLowerCase()
}

/**
 * Get localized language name or default language name
 * @param langCode
 */
function getLanguageName (
  langCode: string,
  pluginOptions:IPluginOptions,
  uiLocalization: BehaviorSubject<ILocalizedLanguage>
):string {
  // TODO: maybe more sophisticated language name here taking into account country code
  const resolvedLangCode = normalizeLanguageCode(langCode)
  let language:ILanguage
  if (pluginOptions.ui.showLanguagesInNativeLanguage) {
    language = languageCodes[resolvedLangCode]
    if (language) {
      return language.nativeName
    }
    else {
      return langCode
    }
  }
  else {
    const localizedLanguage = uiLocalization.value.languages[resolvedLangCode]

    if (localizedLanguage) {
      return localizedLanguage
    }
    else {
      language = languageCodes[resolvedLangCode]
      if (language) {
        return language.name
      }
      else {
        return langCode
      }
    }
  }
}

function closest (element, selector) {
  const matchSelector = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
  do {
    if (matchSelector.call(element, selector)) return element
    element = element.parentElement || element.parentNode
  } while (element !== null && element.nodeType === 1)
  return null
}

function closeToolbarSection (uiLocalization) {
  const button = document.createElement('a')
  button.textContent = uiLocalization.value.controls.close
  button.href = 'javascript:;'
  button.classList.add('website-translator-close', 'website-translator-button')
  button.onclick = function () {
    const closable = button.closest('.closable')
    closable.parentNode.removeChild(closable)
  }

  return button
}

// Mouse relative to iframe position
function mouseRelativeToIframe (event) {
  const mousePosition = {
    left: 0,
    top: 0,
    iframe: null
  }

  // if element is in this iframe
  if (event.target.ownerDocument !== document) {
    document.querySelectorAll('iframe').forEach((iframe) => {
      if (
        iframe.contentDocument &&
        iframe.contentDocument === event.target.ownerDocument
      ) {
        mousePosition.iframe = iframe
        const iframeInfo = iframe.getBoundingClientRect()

        // Relative position to iframe
        mousePosition.top += iframeInfo.top
        mousePosition.left += iframeInfo.left

        // Border
        mousePosition.top += iframe.style.borderTopWidth ? parseInt(iframe.style.borderTopWidth) : 0
        mousePosition.left += iframe.style.borderLeftWidth ? parseInt(iframe.style.borderLeftWidth) : 0

        // Padding
        mousePosition.top += iframe.style.paddingTop ? parseInt(iframe.style.paddingTop) : 0
        mousePosition.left += iframe.style.paddingLeft ? parseInt(iframe.style.paddingLeft) : 0
      }
    })
  }
  return mousePosition
}
export { mouseRelativeToIframe, closeToolbarSection, closest, getLanguageName, normalizeLanguageCode }
