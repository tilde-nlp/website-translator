import { IExtractedTextElementInfo } from '../interfaces/IExtractedTextElementInfo'

export class DOMExtensions {
  /**
   * Check if element can contain only text (no HTML tags)
   * @param element
   * @returns
   */
  public static elementIsTextOnly (element:HTMLElement) {
    return element.tagName === 'TITLE'
  }

  public static selfClosingTag (tagName: string) {
    const elem = document.createElement(tagName)
    return !elem.outerHTML.includes('></')
  }

  /**
   * Convert HTML string to DOM tree and single wrap it
   * @param html
   */
  public static stringToElement (html:string) {
    const parser = new DOMParser()
    const wrapper = parser.parseFromString('<span>' + html + '</span>', 'application/xhtml+xml')
    return wrapper.firstChild as HTMLElement
  }

  /**
   * Unified way to select DOM elements
   * @param selector
   */
  public static selectDOMElements (selector: string, rootElement: HTMLElement|Document = null) {
    if (!rootElement) {
      rootElement = document
    }
    let result = [...rootElement.querySelectorAll(selector)]

    const iframes = rootElement.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      if (DOMExtensions.canAccessIframe(iframe)) {
        const items = [...iframe.contentDocument.querySelectorAll(selector)]
        result = result.concat(items)
      }
    })
    return result
  }

  /**
   * Unified way to select all documents
   * @param selector
   */
  public static selectAllDocuments () {
    const result = [document]

    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      if (DOMExtensions.canAccessIframe(iframe)) {
        result.push(iframe.contentDocument)
      }
    })
    return result
  }

  /**
   * Check if element is visible in current Viewport
   * @param element
   */
  public static elementIsVisible (element: HTMLElement, registredIframes: Map<HTMLElement, HTMLElement>) {
    let position:DOMRect = element.getBoundingClientRect()
    let testElement:HTMLElement = element
    // When elements are in iframe, only body has scrolling
    // https://stackoverflow.com/questions/36227559/scrolltop-always-returns-0
    if (document !== element.ownerDocument) {
      const closestIframe = registredIframes.get(element.ownerDocument.documentElement)

      // getBoundingClientRect is relative to iframe
      const elementIsInVisibleIframe =
        position.x + position.width > 0 &&
        position.y + position.height > 0 &&
        position.x < closestIframe.clientWidth &&
        position.y < closestIframe.scrollHeight

      if (!elementIsInVisibleIframe) {
        return false
      }

      position = closestIframe.getBoundingClientRect()
      testElement = closestIframe
    }
    const elementIsInWindow =
      position.x + testElement.scrollWidth > 0 &&
      position.y + testElement.scrollHeight > 0 &&
      position.x < window.innerWidth &&
      position.y < window.innerHeight
    return elementIsInWindow
  }

  /**
   * Checks if iframe is accessable and it is not cross domain
   * @param iframe
   */
  public static canAccessIframe (iframe: HTMLIFrameElement) :boolean {
    try {
      if (iframe.contentDocument) {
        return true
      }
    }
    catch (error) {
      // IE does not like contentDocument to be accessed when iframe is cross-domain
    }

    return false
  }

  public static closestLanguageElement (element: HTMLElement) {
    do {
      if (element.getAttribute('lang')) {
        return element
      }
      element = element.parentElement
    } while (element !== null && element.nodeType === 1)
    return null
  }

  /**
   * Traverse between distant and non same level HTML elements colleting text nodes between them
   * @param extractedInfo
   * @param currentElement
   * @param endElement
   */
  public static extractTextElementsFromRange (currentElement:Node, endElement:Node, extractedInfo:IExtractedTextElementInfo = null) {
    if (extractedInfo === null) {
      extractedInfo = {
        completed: false,
        textNodes: [],
        nodesProcessed: 0
      }
    }

    if (currentElement === endElement && extractedInfo.nodesProcessed > 0) {
      extractedInfo.completed = true
      return extractedInfo
    }
    let nextElement:Node
    if (currentElement.nodeType === Node.TEXT_NODE) {
      extractedInfo.textNodes.push(currentElement)
    }

    currentElement.childNodes.forEach(child => {
      nextElement = child
      if (extractedInfo.completed || nextElement === endElement) {
        extractedInfo.completed = true
        return extractedInfo
      }
      DOMExtensions.extractTextElementsFromRange(nextElement, endElement, extractedInfo)
    })

    if (!extractedInfo.completed) {
      // Try to traverse up if we have not reached sentence end element
      /**
       * Example:
       *
       * <div> <em>Sentence</em> start</div> and then end.
       */
      nextElement = currentElement
      while (nextElement.nextSibling === null) {
        if (extractedInfo.completed || nextElement === endElement) {
          extractedInfo.completed = true
          return extractedInfo
        }
        nextElement = nextElement.parentElement
      }
      if (extractedInfo.completed || nextElement === endElement) {
        extractedInfo.completed = true
        return extractedInfo
      }
      nextElement = nextElement.nextSibling
      DOMExtensions.extractTextElementsFromRange(nextElement, endElement, extractedInfo)
    }

    return extractedInfo
  }
}
