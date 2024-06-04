// TODO: multilevel iframe translation. do we need it?
// TODO: restore dom markers if translation fails?
// TODO: text markers can be raw text wrappers to minimize new DOM node count by wtw
// TODO: fix iframe popup when contents are long and scrollable. Popup snaps to content start.

import { DOMExtensions } from './DOMExtensions'
import { ITranslationAttribute } from '../interfaces/ITranslationAttribute'
import { TranslationAttributeCandidates } from './TranslationAttributeCandidates'
import { skipElements } from './SkipElements'
import { TranslationTextRange } from '../models/TranslationTextRange'
import { Logger } from '../Logger'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { SearchEngineOptimization } from './SearchEngineOptimization'
import { ISegmentInfo } from '../interfaces/ISegmentInfo'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { ITranslatedSegment } from '../interfaces/ITranslatedSegment'
import { TranslatableTagNameType } from '../enums/TranslatableTagNameType'
import { TranslationElementMode } from '../enums/TranslationElementMode'
import { TranslationElementCandidates } from './TranslationElementCandidates'
import IAttributeCandidate from '../interfaces/IAttributeCandidate'
import { TranslationPriority } from '../enums/TranslationPriority'
import { PausableMutationObserver } from './PausableMutationObserver'

const WEBSITE_TRANSLATOR_PREFIX = 'TMT-WTW'

const ATTR_ELEMENT_ID = `${WEBSITE_TRANSLATOR_PREFIX}-ID`
const ATTR_PREFIX = `${WEBSITE_TRANSLATOR_PREFIX}-attr-original-`

const RAW_TEXT_NODE_WRAPPER_TAG = `${WEBSITE_TRANSLATOR_PREFIX}-RAW-TXT`

const TEXT_MARKER_START_TAG = `${WEBSITE_TRANSLATOR_PREFIX}-TXT-S`
const TEXT_MARKER_END_TAG = `${WEBSITE_TRANSLATOR_PREFIX}-TXT-E`

const WATCH_INTERVAL_MS = 500

class DOMTranslation {
  private watcherThread: ReturnType<typeof setInterval>
  private translatedSegments: Map<Node, ITranslatedSegment>
  private translatableParentElements: Set<Node>
  private translatableAttributeElements: TranslationTextRange[]
  private translatableElementRanges: TranslationTextRange[]
  private markedNodesWithId: Set<HTMLElement>
  private translatableElements: Set<HTMLElement>
  private registredIframes: Map<HTMLElement, HTMLElement> = new Map<HTMLElement, HTMLElement>()

  private onTranslationEnter: EventListenerOrEventListenerObject
  private onTranslationLeave: EventListenerOrEventListenerObject
  private onTranslationItemsDiscovered: (items: Array<TranslationTextRange>, priority: TranslationPriority)=>void

  private logger:Logger
  private pluginOptions: IPluginOptions
  private seoTool:SearchEngineOptimization

  private xmlSerializer: XMLSerializer

  private mutationObserver: PausableMutationObserver

  constructor (
    pluginOptions: IPluginOptions,
    onTranslationEnter: EventListenerOrEventListenerObject,
    onTranslationLeave: EventListenerOrEventListenerObject,

    seoTool: SearchEngineOptimization
  ) {
    this.onTranslationEnter = onTranslationEnter
    this.onTranslationLeave = onTranslationLeave

    this.seoTool = seoTool

    this.logger = new Logger(pluginOptions.debug, DOMTranslation.name)
    this.pluginOptions = pluginOptions
    this.xmlSerializer = new XMLSerializer()

    this.mutationObserver = new PausableMutationObserver(this.pluginOptions, this.onMutationObserved.bind(this))
  }

  /**
   * Restore dom in original state
   */
  public restoreDOM () {
    this.mutationObserver.stop()

    clearTimeout(this.watcherThread)
    this.restorePartialDocument()
  }

  /**
   * Translate page
   * @param targetLanguage
   * @param onTranslationItemsDiscovered
   */
  public prepareDOM (
    targetLanguage: string,
    onTranslationItemsDiscovered: (items: Array<TranslationTextRange>, priority:TranslationPriority)=>void
  ) {
    this.onTranslationItemsDiscovered = onTranslationItemsDiscovered
    this.markedNodesWithId = new Set<HTMLElement>()

    this.translatedSegments = new Map<Node, ITranslatedSegment>()
    this.translatableParentElements = new Set<Node>()
    this.translatableAttributeElements = []
    this.translatableElementRanges = []
    this.translatableElements = new Set<HTMLElement>()

    this.translateMetadata()

    this.watcherThread = setInterval(this.watchTransaltableContent.bind(this), WATCH_INTERVAL_MS)

    this.mutationObserver.start()
  }

  /**
   * Set the translated language
   * @param element
   */
  public setLanguage (element:HTMLElement, targetLanguage:string) {
    this.mutationObserver.usingPause(() => {
      const langElement = DOMExtensions.closestLanguageElement(element)
      if (langElement) {
        const translatableAttributeName = this.getTranslationOriginalAttribute('lang')
        if (langElement.getAttribute(translatableAttributeName) === null) {
          const originalLanguage = langElement.getAttribute('lang')
          langElement.setAttribute('lang', targetLanguage)
          langElement.setAttribute(translatableAttributeName, originalLanguage)
        }
      }
    })
  }

  /**
   * Get original and translated sentence from focused element
   *
   * @param {HTMLELement} focusedElement
   */
  public selectSegmentInformation (focusedElement:HTMLElement): ISegmentInfo {
    let currentElement:HTMLElement = focusedElement
    let translationStartMarker: HTMLElement
    let translationEndMarker: HTMLElement
    let startMarkerFound = false

    // Find start marker from focused raw text node
    while (currentElement !== null && !startMarkerFound) {
      let sibling = currentElement
      while (sibling !== null && !startMarkerFound) {
        if (sibling.nodeName === TEXT_MARKER_START_TAG) {
          startMarkerFound = true
          translationStartMarker = sibling
        }
        sibling = sibling.previousElementSibling as HTMLElement
      }
      currentElement = currentElement.parentElement
    }

    if (translationStartMarker === null) {
      return null
    }
    else {
      for (translationEndMarker = translationStartMarker; translationEndMarker;) {
        if (translationEndMarker.nodeName === TEXT_MARKER_END_TAG) {
          break
        }

        translationEndMarker = translationEndMarker.nextSibling as HTMLElement
      }

      const translatedSegment = this.translatedSegments.get(translationStartMarker)
      const originalHTML = DOMExtensions.stringToElement(translatedSegment.source)
      const range = focusedElement.ownerDocument.createRange()
      range.setStartBefore(translationStartMarker)
      range.setEndAfter(translationEndMarker)

      const result: ISegmentInfo = {
        segmentId: translatedSegment.segmentId,
        originalText: originalHTML.textContent,
        originalHTML: translatedSegment.source,
        translatedHTML: translatedSegment.translation,
        translatedRange: range
      }
      return result
    }
  }

  /**
   * When suggestion is submitted, then try to update dom to display future changes that may be when suggestion is used in page
   * @param sentenceStart
   * @param sentenceEnd
   * @param originalText
   * @param previewText
   */
  public applySuggestionPreviewToElement (sentenceStart: HTMLElement, sentenceEnd: HTMLElement, originalText:string, previewText:string) {
    this.mutationObserver.usingPause(() => {
      const suggestion = DOMExtensions.stringToElement(previewText)
      // Translated segments in DOM will already have all text nodes wrapped in translation.
      // We need same format to run text replace.
      this.unwrapTextNodes(sentenceStart)
      this.replaceTextContent(sentenceStart.firstChild, suggestion.firstChild, true)
      this.wrapAllTextNodes(sentenceStart, true)
    })
  }

  /**
   * Apply translated text to element
   *
   * Do not try to wrap each translation sentence in wrapper element
   * because translation may change tags in result sentences, so you cannot know what elements to wrap.
   * Later on find these sentence markers and cut out original sentence
   * @param translationRange
   * @param sourceHTML
   * @param translatedHTML
   */
  public applyTranslationToElement (
    translationRange: TranslationTextRange,
    sourceHTML: string,
    translatedHTML:string,
    segmentId:number
  ) {
    this.mutationObserver.usingPause(() => {
      this.translatedSegments.set(
        translationRange.startMarker,
        {
          segmentId: segmentId,
          source: sourceHTML,
          translation: translatedHTML
        }
      )
      const translatedDom = DOMExtensions.stringToElement(translatedHTML)

      try {
        if (translationRange.startMarker.parentElement) {
          this.replaceTextContent(translationRange.startMarker, translatedDom.firstChild, true)
        }
      }
      catch (err) {
        this.logger.warn(`Failed to translate part of document. \n\tError: ${err} \n\tTranslated: ${translatedDom.innerHTML}`)
      // Nothing that we can do actually for example in case that JS is modifying page at the very same time
      }
    })
  }

  public restorePartialDocument (rootElement: HTMLElement = null) {
    this.mutationObserver.usingPause(() => {
      this.restoreElements(rootElement)
      this.restoreAttributes(rootElement)
    })
  }

  public applySeo (language:string, availableLocales:string[]) {
    this.seoTool.applyLinkedPages(language, availableLocales)
  }

  public applyUrlLocalization (targetLanguage: string = null) {
    this.mutationObserver.usingPause(() => {
      const urls = this.getLocalizableUrls()
      this.seoTool.localizeUrls(urls, targetLanguage)
    })
  }

  public restoreSeo () {
    this.mutationObserver.usingPause(() => {
      const urls = this.getLocalizableUrls()
      this.seoTool.restoreUrlLocalization(urls)
    })
  }

  /**
   * apply translation to HTML attribute
   * @param element
   * @param attributeName
   * @param translated
   */
  public applyAttributeTranslationToElement (
    element:HTMLElement,
    attributeName:string,
    translated:string
  ) {
    this.mutationObserver.usingPause(() => {
      const alreadyTranslated = element.hasAttribute(this.getTranslationOriginalAttribute(attributeName))

      if (!alreadyTranslated) {
        const originalText = element.getAttribute(attributeName)

        element.setAttribute(this.getTranslationOriginalAttribute(attributeName), originalText)
        element.setAttribute(`${attributeName}`, translated)
      }
    })
  }

  /**
   * Selects all elements and their translatable attributes
   */
  public gatherTranslationAttributes (elements:Set<HTMLElement>) {
    const translationElementsWithAttributes:Array<TranslationTextRange> = []

    elements.forEach(element => {
      const attributes = this.getTranslatableAttributes(element)
      if (attributes.length > 0) {
        const translation = new TranslationTextRange()
        translation.attributes = attributes
        translation.element = element
        translation.type = TranslatableItemType.ATTRIBUTE

        translationElementsWithAttributes.push(translation)
      }
    })

    return translationElementsWithAttributes
  }

  private serializeTextToXML (html: string) {
    // Construct dom
    const tmpElement = document.createElement('span')
    tmpElement.textContent = html

    // Serialize to XML
    const escapedXML = this.xmlSerializer.serializeToString(tmpElement)

    // Get pure XML
    tmpElement.innerHTML = escapedXML
    const wrapper = tmpElement.firstElementChild
    return wrapper.innerHTML
  }

  private getTranslationRoots () {
    let translationRoots = []
    if (this.pluginOptions.translation.translateOnlyAllowedTags) {
      translationRoots = DOMExtensions.selectDOMElements('[translate="yes"]')
    }
    else {
      translationRoots.push(document.documentElement)
    }
    return translationRoots
  }

  private translateMetadata () {
    const translationRoots = this.getTranslationRoots()
    const translationRanges = this.prepareNextTranslationRanges(translationRoots, TranslationElementMode.METADATA_ELEMENTS)

    this.onTranslationItemsDiscovered(translationRanges, TranslationPriority.SEO)
  }

  private onMutationObserved (mutation: MutationRecord) {
    if (mutation.type === 'characterData') {
      const wrapper = mutation.target.parentElement
      const prevElement = wrapper.previousSibling
      const nextElement = wrapper.nextSibling

      const isTextBlock = wrapper?.nodeName === RAW_TEXT_NODE_WRAPPER_TAG &&
        prevElement?.nodeName === TEXT_MARKER_START_TAG &&
        nextElement?.nodeName === TEXT_MARKER_END_TAG
      if (isTextBlock && wrapper.parentElement) {
        wrapper.parentElement.insertBefore(mutation.target, wrapper)
        prevElement.remove()
        nextElement.remove()
        wrapper.remove()
      }
    }
  }

  private watchTransaltableContent () {
    let translationRoots = []
    if (this.pluginOptions.translation.translateOnlyAllowedTags) {
      translationRoots = DOMExtensions.selectDOMElements('[translate="yes"]')
    }
    else {
      translationRoots.push(document.documentElement)
    }

    const translationRanges = this.prepareNextTranslationRanges(translationRoots, TranslationElementMode.VISIBLE_ELEMENTS)

    this.onTranslationItemsDiscovered(translationRanges, TranslationPriority.Text)
  }

  private prepareNextTranslationRanges (
    translationRoots: Array<Node>,
    mode: TranslationElementMode
  ): TranslationTextRange[] {
    let ranges = []
    this.mutationObserver.usingPause(() => {
      const newTranslatableParentElements = new Set<HTMLElement>()
      const translatableElements = new Set<HTMLElement>()

      translationRoots.forEach(rootElement => {
        this.collectTextElements(
          newTranslatableParentElements,
          translatableElements,
          rootElement,
          this.pluginOptions.sourceLanguage,
          mode
        )
      })

      this.translatableParentElements = new Set([...this.translatableParentElements, ...newTranslatableParentElements])

      const newElementRanges = this.markTranslationRanges(
        this.translatableParentElements,
        translatableElements
      )

      this.translatableElementRanges = this.translatableElementRanges.concat(newElementRanges)

      let newTranslatableAttributeElements:TranslationTextRange[] = []
      if (this.pluginOptions.translation.translateAttributes) {
        newTranslatableAttributeElements = this.gatherTranslationAttributes(translatableElements)
        this.translatableAttributeElements = this.translatableAttributeElements.concat(newTranslatableAttributeElements)
      }

      this.translatableElements = new Set([...translatableElements, ...this.translatableElements])

      ranges = newElementRanges.concat(newTranslatableAttributeElements)
    })
    return ranges
  }

  private getLocalizableUrls () {
    const newTranslatableParentElements = new Set<HTMLElement>()
    const translatableElements = new Set<HTMLElement>()
    const translationRoots = this.getTranslationRoots()

    translationRoots.forEach(rootElement => {
      this.collectTextElements(
        newTranslatableParentElements,
        translatableElements,
        rootElement,
        this.pluginOptions.sourceLanguage,
        TranslationElementMode.URLS
      )
    })

    return [...translatableElements]
  }

  /**
   * Remove {TEXT} wrappers
   *
   * @param {HTMLElement} element
   */
  private unwrapTextNodes (element:HTMLElement) {
    if (element.nodeName === RAW_TEXT_NODE_WRAPPER_TAG) {
      this.unwrapTextNode(element)
    }
    else if (element.nodeType === Node.ELEMENT_NODE) {
      const textWrappers = [...element.querySelectorAll(RAW_TEXT_NODE_WRAPPER_TAG)]

      textWrappers.forEach(wrapper => {
        this.unwrapTextNode(wrapper as HTMLElement)
      })
    }
  }

  /**
   * Unwrap single text node
   * @param wrapper
   */
  private unwrapTextNode (wrapper:HTMLElement) {
    const nextSibling = wrapper.nextSibling
    wrapper.parentNode.insertBefore(wrapper.firstChild, nextSibling)

    wrapper.removeEventListener('mouseenter', this.onTranslationEnter)
    wrapper.removeEventListener('mouseleave', this.onTranslationLeave)

    wrapper.remove()
  }

  /**
   * Get attribute name
   * @param attributeName
   * @returns
   */
  private getTranslationOriginalAttribute (attributeName: string):string {
    return `${ATTR_PREFIX}${attributeName}`
  }

  /**
   * Collect attributes that can be translated
   * @see https://html.spec.whatwg.org/multipage/dom.html#the-translate-attribute
   * @todo TODO: implement rest of attributes
   *
   * @param {HTMLElement} element
   */
  private getTranslatableAttributes (element:HTMLElement) {
    const attributes:Array<ITranslationAttribute> = []

    if (element.nodeType === Node.ELEMENT_NODE) {
      this.getAttributesFromCandidate(element, TranslationAttributeCandidates.get(element.nodeName), attributes)
      this.getAttributesFromCandidate(element, TranslationAttributeCandidates.get(null), attributes)
    }
    return attributes
  }

  private getAttributesFromCandidate (element: HTMLElement, attributeCandidates: IAttributeCandidate[], attributes:Array<ITranslationAttribute>) {
    if (attributeCandidates) {
      attributeCandidates.forEach(candidate => {
        if (element.hasAttribute(candidate.translatableAttribute)) {
          const matchesRequiredAttribute = element.hasAttribute(candidate.requiredAttributeName) && element.getAttribute(candidate.requiredAttributeName) === candidate.requiredAttributeValue
          const attributeIsAlreadyTranslated = element.hasAttribute(this.getTranslationOriginalAttribute(candidate.translatableAttribute))

          if (!attributeIsAlreadyTranslated && (candidate.requiredAttributeName == null || matchesRequiredAttribute)) {
            const xmlString = this.serializeTextToXML(element.getAttribute(candidate.translatableAttribute))

            if (xmlString.trim().length > 0) {
              const attribute:ITranslationAttribute = {
                descriptionAttributeValue: candidate.requiredAttributeValue ?? candidate.translatableAttribute,
                translationAtttibuteName: candidate.translatableAttribute,
                translationAtttibuteValue: xmlString,
                type: candidate.type
              }

              attributes.push(attribute)
            }
          }
        }
      })
    }
  }

  /**
   * Restore original attribute values
   */
  private restoreAttributes (rootElement: HTMLElement = null) {
    if (this.translatableAttributeElements) {
      for (const item of this.translatableAttributeElements) {
        if (rootElement) {
          const containedInRoot = rootElement.contains(item.element)
          if (!containedInRoot) {
            continue
          }
        }
        for (const attribute of item.attributes) {
          this.restoreElementAttribute(item.element, attribute.translationAtttibuteName)
        }
      }
    }

    if (this.markedNodesWithId) {
      for (const element of this.markedNodesWithId) {
        if (rootElement) {
          const containedInRoot = rootElement.contains(element)
          if (!containedInRoot) {
            continue
          }
        }
        element.removeAttribute(ATTR_ELEMENT_ID)
      }
    }
  }

  /**
   * Restore single attribute on HTML element
   * @param element
   * @param attribute
   */
  private restoreElementAttribute (element, attribute) {
    const translatedAttributeName = this.getTranslationOriginalAttribute(attribute)
    const originalAttributeValue = element.getAttribute(translatedAttributeName)
    if (originalAttributeValue) {
      element.setAttribute(attribute, originalAttributeValue)
      element.removeAttribute(translatedAttributeName)
    }
  }

  /**
   * Wrap {TEXT} nodes with content in element.
   * All text nodes must be wrapped to apply sentence highlighing later on.
   * You can only apply sentence highlight on real elements not {TEXT} nodes
   * Whitespaces must be wrapped too to be included properly in selected sentence.
   *
   * @param element
   * @param registerEvents add mouse event listeners for elements
   */
  private wrapAllTextNodes (element: HTMLElement, registerEvents = false) {
    if (!DOMTranslation.canTranslateElement(element)) {
      return
    }

    if (element.nodeType === Node.COMMENT_NODE) {
      return
    }

    if (element.nodeType === Node.TEXT_NODE) {
      this.wrapTextNode(element)
    }
    else {
      for (const childNode of [...element.childNodes]) {
        this.wrapAllTextNodes(childNode as HTMLElement, registerEvents)
      }
    }
  }

  private wrapTextNode (element: Node, registerEvents = false) {
    if (DOMExtensions.elementIsTextOnly(element.parentElement)) {
      return
    }
    const wrapper = document.createElement(RAW_TEXT_NODE_WRAPPER_TAG)
    if (registerEvents) {
      wrapper.addEventListener('mouseenter', this.onTranslationEnter)
      wrapper.addEventListener('mouseleave', this.onTranslationLeave)
    }
    const nextSibling = element.nextSibling
    const parentElement = element.parentElement
    wrapper.appendChild(element)

    parentElement.insertBefore(wrapper, nextSibling)
  }

  /**
   * Restore original translation for element
   */
  private restoreElementTranslation (range: TranslationTextRange) {
    const translatedSegment = this.translatedSegments.get(range.startMarker)

    if (translatedSegment) {
      const originalHTML = DOMExtensions.stringToElement(translatedSegment.source)

      this.unwrapTextNodes(originalHTML)

      this.replaceTextContent(range.startMarker, originalHTML.childNodes[0], false)
    }
  }

  /**
   * Restore original element values
   */
  private restoreElements (rootElement: HTMLElement = null) {
    if (this.translatableElementRanges) {
      for (const range of this.translatableElementRanges) {
        if (rootElement) {
          const containedInRoot = rootElement.contains(range.startMarker) || rootElement.contains(range.endMarker)
          if (!containedInRoot) {
            continue
          }
        }

        try {
          const langElement = DOMExtensions.closestLanguageElement(range.startMarker)

          if (langElement) {
            this.restoreElementAttribute(langElement, 'lang')
          }

          // If element is not removed from dom yet
          if (range.startMarker.ownerDocument.contains(range.startMarker)) {
            for (let current = range.startMarker; current !== range.endMarker;) {
              const nextElement = current.nextSibling as HTMLElement
              this.unwrapTextNodes(current)
              current = nextElement
            }

            this.restoreElementTranslation(range)
          }

          range.startMarker.remove()
          range.endMarker.remove()
        }
        catch (err) {
          this.logger.error('Failed to restore text segment')
        }
      }
    }
  }

  /**
   * Reorder single level element nodes to sequence exactly like in target
   * @param sourceElement
   * @param targetElement
   */
  private reorderSourceNodesAsInTarget (sourceElement:Node, targetElement:Node) {
    const sourceNodes: Map<string, HTMLElement> = new Map<string, HTMLElement>()
    const targetNodes: Array<{id:string, element: HTMLElement}> = []

    for (let node = sourceElement; node && node.nodeName !== TEXT_MARKER_END_TAG; node = node.nextSibling) {
      if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== TEXT_MARKER_START_TAG) {
        const htmlNode = node as HTMLElement
        sourceNodes.set(
          htmlNode.getAttribute(ATTR_ELEMENT_ID),
          htmlNode
        )
      }
    }
    for (let node = targetElement; node && node.nodeName !== TEXT_MARKER_END_TAG; node = node.nextSibling) {
      if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== TEXT_MARKER_START_TAG) {
        const htmlNode = node as HTMLElement
        targetNodes.push({
          id: htmlNode.getAttribute('id'),
          element: htmlNode
        })
      }
    }
    if (sourceNodes.size !== targetNodes.length) {
      this.logger.warn(`Source and target node count is different ${sourceNodes.size} != ${targetNodes.length}`)
    }
    if (sourceNodes.size > 1) {
      targetNodes.forEach((_, index) => {
        const orderedTargetNode = targetNodes[index]
        const orderedSourceNode: HTMLElement = sourceNodes.get(orderedTargetNode.id)

        // Reference node is either "first unordered node" if nothing has been ordered yet or next element after already ordered nodes.
        const referenceNode = index === 0 ? sourceNodes.entries().next().value[1] : sourceNodes.get(targetNodes[index - 1].id).nextSibling

        if (referenceNode) {
        // Dont reorder Iframe, because reordering Iframe elements causes iframe to reload.
        // It should be correct sequence without because we reorder all other elements.
          if (orderedSourceNode.nodeName !== 'IFRAME') {
            referenceNode.parentElement.insertBefore(orderedSourceNode, referenceNode)
          }
        }
        else {
          this.logger.warn('Tag reorder skip, because reference node not found')
        }
      })
    }
  }

  /**
   * Replace only text content, dont change tags breaking registered JS event handlers on elements
   * Replaces all sibling elements starting from specified elements
   * @param sourceElement first element that text needs to be replaced in source html
   * @param targetElement first element that text needs to be replaced in target html
   */
  private replaceTextContent (sourceElement:Node, targetElement:Node, wrapText: boolean) {
    this.reorderSourceNodesAsInTarget(sourceElement, targetElement)

    const sourceParent = sourceElement.parentElement
    let nextTarget: Node

    while (sourceElement || targetElement) {
      if (sourceElement && (sourceElement.nodeName === TEXT_MARKER_START_TAG)) {
        sourceElement = sourceElement.nextSibling
      }
      else if (sourceElement && sourceElement.nodeType === Node.COMMENT_NODE) {
        // Skip comments nodes
        sourceElement = sourceElement.nextSibling
      }
      else if (targetElement && targetElement.nodeType === Node.COMMENT_NODE) {
        // Skip comments nodes
        targetElement = targetElement.nextSibling
      }
      else if (sourceElement && sourceElement.nodeType === Node.ELEMENT_NODE &&
        targetElement && (targetElement as HTMLElement).localName === TranslatableTagNameType.STANDALONE) {
        // Elements with [translate="no"]... etc.
        sourceElement = sourceElement.nextSibling
        targetElement = targetElement.nextSibling
      }
      else if (!sourceElement || !targetElement) {
        if (!sourceElement) {
          // Target has more elements
          nextTarget = targetElement.nextSibling
          sourceParent.insertBefore(targetElement, sourceElement)
          targetElement = nextTarget
        }
        else {
          if (sourceElement.nodeType === Node.TEXT_NODE) {
            // Source has more elements, so remove text
            sourceElement.textContent = ''

            sourceElement = sourceElement.nextSibling
          }
          else {
            break
          }
        }
      }
      else {
        if (sourceElement.nodeType === Node.TEXT_NODE) {
        // Both have text nodes
          if (targetElement.nodeType === Node.TEXT_NODE) {
            // If source text had leading or trailing whitespaces, add them
            if (
              targetElement.nextSibling &&
              (targetElement.nextSibling as HTMLElement).localName === TranslatableTagNameType.STANDALONE
            ) {
              const trailingSpaces = sourceElement.textContent.match(/(\s*)$/)[0]
              sourceElement.textContent = targetElement.textContent + trailingSpaces
            }
            else if (
              targetElement.previousSibling &&
              (targetElement.previousSibling as HTMLElement).localName === TranslatableTagNameType.STANDALONE
            ) {
              const leadingSpaces = sourceElement.textContent.match(/^(\s*)/)[0]
              sourceElement.textContent = leadingSpaces + targetElement.textContent
            }
            else {
              sourceElement.textContent = targetElement.textContent
            }

            const nextSourceElement = sourceElement.nextSibling
            if (wrapText) {
              this.wrapTextNode(sourceElement, true)
            }

            sourceElement = nextSourceElement
            targetElement = targetElement.nextSibling
          }
          // Text node missing in target element
          else {
            sourceElement.textContent = ''
            sourceElement = sourceElement.nextSibling
          }
        }
        else if (targetElement.nodeType === Node.TEXT_NODE) {
          // Target has text node that source have not
          nextTarget = targetElement.nextSibling
          sourceParent.insertBefore(targetElement, sourceElement)

          if (wrapText) {
            this.wrapTextNode(targetElement, true)
          }

          targetElement = nextTarget
        }
        else {
          // Non text nodes
          if (sourceElement.childNodes[0] && targetElement.childNodes[0]) {
            this.replaceTextContent(sourceElement.childNodes[0], targetElement.childNodes[0], wrapText)
          }
          else if (sourceElement.childNodes.length === 1) {
            // This is alignment + tag problem where translated tag does not have text content
            if (sourceElement.childNodes[0].nodeType === Node.TEXT_NODE) {
              sourceElement.childNodes[0].textContent = ''
            }
          }
          sourceElement = sourceElement.nextSibling
          targetElement = targetElement.nextSibling
        }
      }
    }
  }

  /**
   * Create wrapper element for Text nodes to translate
   */
  private createTranslatableTextMarker (startMarker:boolean) {
    return document.createElement(startMarker ? TEXT_MARKER_START_TAG : TEXT_MARKER_END_TAG)
  }

  /**
   * Check if element is inline element.
   * We need this to split text blocks in smaller chunks that can be translated in parallel
   */
  private elementIsInline (element: HTMLElement) {
    if (element.nodeType === Node.ELEMENT_NODE) {
      const computedStyle = window.getComputedStyle(element)
      return computedStyle.display.trim() === 'inline'
    }
    return element.nodeType !== Node.ELEMENT_NODE
  }

  /**
   * Split element into translatable texts and insert text markers.
   * @param element
   * @param translationRanges
   * @param currentTranslationRange
   * @param translatableElements
   * @param visitedElements
   * @param level
   */
  private findTranslationRanges (
    element:Node,
    translationRanges: Array<TranslationTextRange>,
    currentTranslationRange:TranslationTextRange,
    translatableElements:Set<Node>,
    visitedElements:Set<Node>,
    level:number = 0
  ) {
    const childNodes = [...element.childNodes]
    let index = -1

    let translatedZone = false
    for (const child of childNodes) {
      index++
      if (visitedElements.has(child)) {
        continue
      }

      const skipElement = this.skipElement(child)
      const inlineElement = this.elementIsInline(child as HTMLElement)
      const lastRootChild = level === 0 && index === childNodes.length - 1
      visitedElements.add(child)

      if (child.nodeName === TEXT_MARKER_START_TAG || child.previousSibling?.nodeName === TEXT_MARKER_START_TAG) {
        translatedZone = true
      }
      if (child.nodeName === TEXT_MARKER_END_TAG || child.previousSibling?.nodeName === TEXT_MARKER_END_TAG) {
        translatedZone = false
      }

      if (!translatedZone) {
        if (translatableElements.has(child) && !skipElement && inlineElement) {
          if (!currentTranslationRange.startMarker) {
            const startMarker = this.createTranslatableTextMarker(true)
            child.parentElement.insertBefore(startMarker, child)
            currentTranslationRange.startMarker = startMarker
          }
        }

        if (currentTranslationRange.startMarker && (skipElement || !inlineElement || lastRootChild)) {
          const range = new TranslationTextRange()
          const endMarker = this.createTranslatableTextMarker(false)

          range.startMarker = currentTranslationRange.startMarker
          range.endMarker = endMarker

          if (lastRootChild && inlineElement) {
            child.parentElement.insertBefore(endMarker, child.nextSibling)
          }
          else {
            child.parentElement.insertBefore(endMarker, child)
          }
          currentTranslationRange.startMarker = null

          translationRanges.push(range)
        }
      }
    }
    return true
  }

  /**
   * Crop non translatable elements from range and minimize html
   * @param currentHtml
   * @param currentElement
   */
  private cropAndMinifyTranslationRange (range: TranslationTextRange, translatableElements:Set<Node>, currentElement:Node, startMarker:Node = null, endMarker:Node = null) {
    let currentHTML = ''

    for (let child = currentElement; child; child = child.nextSibling) {
      if (startMarker && child === startMarker) {
        continue
      }
      if (endMarker && child === endMarker) {
        break
      }
      if (child.nodeType === Node.ELEMENT_NODE) {
        const currentElementId = range.markedElementCount++
        const childNode = child as HTMLElement
        childNode.setAttribute(ATTR_ELEMENT_ID, `${currentElementId}`)
        this.markedNodesWithId.add(childNode)

        if (this.elementIsInline(child as HTMLElement) && translatableElements.has(child) && !this.skipElement(child) && !DOMExtensions.selfClosingTag(child.nodeName)) {
          let childHTML = ''
          if (child.childNodes.length > 0) {
            childHTML = this.cropAndMinifyTranslationRange(range, translatableElements, child.childNodes[0])
          }
          currentHTML += `<${TranslatableTagNameType.PAIRED} id="${currentElementId}">${childHTML}</${TranslatableTagNameType.PAIRED}>`
        }
        else {
          currentHTML += `<${TranslatableTagNameType.STANDALONE} id="${currentElementId}"/>`
        }
        range.tagNames[currentElementId] = childNode.nodeName
      }
      else if (child.nodeType === Node.TEXT_NODE) {
        currentHTML += this.serializeTextToXML(child.textContent)
      }
    }
    return currentHTML
  }

  private markTranslationRanges (
    translatableParentElements:Set<Node>,
    translatableElements:Set<Node>
  ) {
    // Parent nodes may actually overlap in different levels
    const visitedElements = new Set<HTMLElement>()
    const translationRanges:Array<TranslationTextRange> = []
    const currentTranslationRange = new TranslationTextRange()

    for (const parent of translatableParentElements) {
      const rangeExists = this.findTranslationRanges(
        parent,
        translationRanges,
        currentTranslationRange,
        translatableElements,
        visitedElements
      )
      if (rangeExists) {
        translatableParentElements.delete(parent)
      }
    }
    for (const range of translationRanges) {
      range.visibleInCurrentView = DOMExtensions.elementIsVisible(range.startMarker, this.registredIframes)
      range.type = TranslatableItemType.ELEMENT
      range.html = this.cropAndMinifyTranslationRange(range, translatableElements, range.startMarker, range.startMarker, range.endMarker)
    }

    const tagsRegex = new RegExp(`<${TranslatableTagNameType.PAIRED}[^>]*>|</${TranslatableTagNameType.PAIRED}>|<${TranslatableTagNameType.STANDALONE}[^>]*/>`, 'g')
    const translationRangesWithText = translationRanges.filter(range => {
      const hasContent = range.html.replace(tagsRegex, '').trim().length > 0
      if (!hasContent) {
        range.startMarker.remove()
        range.endMarker.remove()
      }
      return hasContent
    })

    return translationRangesWithText.sort((a, b) => {
      const bView = b.visibleInCurrentView ? 1 : 0
      const aView = a.visibleInCurrentView ? 1 : 0
      return bView - aView
    })
  }

  /**
   * Check if HTML lang attribute matches with WTW required language
   * @param element
   * @param sourceLanguage
   * @returns
   */
  private languageMatches (element: HTMLElement, sourceLanguage:string) {
    const langAttribute = element.getAttribute('lang').split('-').map(part => part.trim().toLowerCase())
    const langExpected = sourceLanguage.split('-').map(part => part.trim().toLowerCase())

    const elementisTranslated = element.hasAttribute(this.getTranslationOriginalAttribute('lang'))
    return langAttribute[0] === langExpected[0] || elementisTranslated
  }

  /**
   * Gather text elements suitable for translation from DOM.
   * Gather all elements which are not excluded
   *
   * We cannot eazy gather translatable text here, because we dont know where text is located
   * For example:
   * <div>
   *    <span>
   *        <span>
   *            Hello
   *        </span>
   *    </span>
   *    i'm text
   * </div
   * @param translatableTextNodes
   * @param translatableElements
   * @param element
   * @param sourceLanguage
   * @param mode
   */
  private collectTextElements (
    translatableParentElements:Set<HTMLElement>,
    translatableElements:Set<HTMLElement>,
    element:Node,
    sourceLanguage:string,
    mode: TranslationElementMode
  ) {
    const forceVisibility = this.pluginOptions.translation.translateWholePage && mode === TranslationElementMode.VISIBLE_ELEMENTS;

    this.collectTextElementsChunked(
      translatableParentElements,
      translatableElements,
      element,
      sourceLanguage,
      true,
      true,
      mode,
      forceVisibility,
      element as HTMLElement,
      true
    )
  }

  private addUserElementToCollection (collection: Set<HTMLElement>, element) {
    if (
      element.nodeType === Node.ELEMENT_NODE && (
        element.nodeName === RAW_TEXT_NODE_WRAPPER_TAG ||
        element.nodeName === TEXT_MARKER_START_TAG ||
        element.nodeName === TEXT_MARKER_END_TAG
      )
    ) {
      return
    }
    collection.add(element)
  }

  /**
   *
   * @param translatableParentElements
   * @param translatableElements
   * @param element
   * @param sourceLanguage
   * @param sourceLanguageSame Element some level child of translatable language
   * @param isTranslatable If element is not some level of [translate="no"]. [translate="yes"] resets this
   * @param mode
   * @param forceVisibility
   * @param currentParent
   * @param firstLevel
   * @returns
   */
  private collectTextElementsChunked (
    translatableParentElements:Set<HTMLElement>,
    translatableElements:Set<HTMLElement>,
    element:any,
    sourceLanguage:string,
    sourceLanguageSame:boolean,
    isTranslatable:boolean,
    mode:TranslationElementMode,
    forceVisibility: boolean,
    currentParent: HTMLElement,
    firstLevel: boolean = false
  ) {
    try {
      if (element.nodeType === Node.TEXT_NODE && element.textContent.trim().length === 0) {
        return
      }

      // Properties to determine if elements shall be included in translation
      let currentSourceLangSame = sourceLanguageSame
      if (element.attributes && element.getAttribute('lang')) {
      // Check if language country code matches. If it does, then use it. We may not have systems with country codes.
        currentSourceLangSame = this.languageMatches(element, sourceLanguage)
      }

      let currentIsTranslatable = isTranslatable
      if (element.attributes && element.getAttribute('translate')) {
        currentIsTranslatable = element.getAttribute('translate') === 'yes'
      }
      if (element.classList && element.classList.contains('notranslate')) {
        currentIsTranslatable = false
      }
      if (DOMTranslation.elementIsPartOfWTW(element)) {
        // Don't translate child elements of website translator
        return
      }
      if (currentSourceLangSame && currentIsTranslatable) {
        if (mode === TranslationElementMode.VISIBLE_ELEMENTS) {
          if (element.nodeType === Node.ELEMENT_NODE && DOMExtensions.elementIsVisible(element, this.registredIframes)) {
            // Select <option> will always be "invisible", so we need to translate it if select itself is visible
            if (element.nodeName === 'SELECT') {
              forceVisibility = true
            }

            this.addUserElementToCollection(translatableElements, element)
          }
        }
        else if (mode === TranslationElementMode.METADATA_ELEMENTS) {
          const hasSeoAttributes = this.getTranslatableAttributes(element)
            .some(item => item.type === TranslatableItemType.ATTRIBUTE_SEO)

          if (hasSeoAttributes) {
            this.addUserElementToCollection(translatableElements, element)
          }
        }
        else if (mode === TranslationElementMode.URLS) {
          if (element.nodeType === Node.ELEMENT_NODE) {
            const htmlElement = (element as HTMLElement)
            if (htmlElement.parentNode.nodeName !== 'HEAD' && htmlElement.hasAttribute('HREF')) {
              this.addUserElementToCollection(translatableElements, element)
            }
          }
        }

        if (!firstLevel && element.parentElement) {
          const parentIsInlineRoot = !this.elementIsInline(element.parentElement) && this.elementIsInline(element)

          if (parentIsInlineRoot || !isTranslatable) {
            // We have found new parent element
            currentParent = element.parentElement
          }
        }
      }
      else {
        currentParent = null
        if (this.pluginOptions.translation.translateOnlyAllowedTags) {
          return
        }
      }

      if (element.nodeName.toLowerCase() === 'iframe' && DOMExtensions.canAccessIframe(element)) {
        this.registredIframes.set(element.contentDocument.documentElement, element)
        const frameDocument = element.contentDocument.documentElement

        this.collectTextElementsChunked(
          translatableParentElements,
          translatableElements,
          frameDocument,
          sourceLanguage,
          currentSourceLangSame,
          currentIsTranslatable,
          mode,
          forceVisibility,
          currentParent
        )
      }
      else {
        if (!this.skipElement(element)) {
          const children = element.childNodes
          if (children.length === 0 && currentSourceLangSame && currentIsTranslatable) {
            const parentIsPreformattedElement = element.parentNode && element.parentNode.nodeName === 'PRE'
            if (element.textContent.trim().length > 0 || parentIsPreformattedElement) {
              const visibleChildAllowed = mode === TranslationElementMode.VISIBLE_ELEMENTS && DOMExtensions.elementIsVisible(element.parentElement, this.registredIframes)
              const metadataChildAllowed = mode === TranslationElementMode.METADATA_ELEMENTS && TranslationElementCandidates.get(element.parentElement.nodeName)?.type === TranslatableItemType.ELEMENT_SEO

              if (visibleChildAllowed || metadataChildAllowed || forceVisibility) {
                this.addUserElementToCollection(translatableParentElements, currentParent)
                this.addUserElementToCollection(translatableElements, element)
              }
            }
          }
          else {
            children.forEach(child => {
              this.collectTextElementsChunked(
                translatableParentElements,
                translatableElements,
                child,
                sourceLanguage,
                currentSourceLangSame,
                currentIsTranslatable,
                mode,
                forceVisibility,
                currentParent
              )
            })
          }
        }
      }
    }
    catch (err) {
      this.logger.error(err)
    }
  }

  /**
   * Check if element should be translated or not
   * @param element
   */
  private skipElement (element:Node) {
    if (skipElements[element.nodeName] === true || element.nodeType === Node.COMMENT_NODE) {
      return true
    }
  }

  /**
   * Check if element can be translated
   * @param element
   */
  private static canTranslateElement (element:HTMLElement) {
    const hasNoTranslateAttribute = element.attributes && element.getAttribute('translate') && element.getAttribute('translate') === 'no'
    const isWidget = this.elementIsPartOfWTW(element)
    const hasNoTranslateClass = element.classList && element.classList.contains('notranslate')

    const canTranslate = !isWidget && !hasNoTranslateAttribute && !hasNoTranslateClass

    return canTranslate
  }

  /**
   * Check if element is one of WTW UI elements.
   * We generally dont want to translate them
   * @param element
   * @returns
   */
  private static elementIsPartOfWTW (element:HTMLElement) {
    if (element.classList &&
      (
        element.classList.contains('website-translator-tooltip') ||
        element.classList.contains('website-translator') ||
        element.classList.contains('website-translator-toolbar') ||
        element.classList.contains('website-translator-toolbar-spacer')
      )
    ) {
      return true
    }
    return false
  }
}
export {
  DOMTranslation
}
