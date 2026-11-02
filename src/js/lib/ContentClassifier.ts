import { TranslatableItemType } from '../enums/TranslatableItemType'
import { ContentElementType, ContentLocation, ISegmentMetadata, SeoType } from '../interfaces/ISegmentMetadata'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'

const headingTags = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])
const paragraphTags = new Set(['P', 'BLOCKQUOTE', 'DD', 'DT'])
const inputTags = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'OPTGROUP', 'LABEL', 'FIELDSET', 'LEGEND'])
const listTags = new Set(['UL', 'OL', 'LI', 'DL'])
const tableTags = new Set(['TABLE', 'CAPTION', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD'])
const mediaTags = new Set(['IMG', 'PICTURE', 'FIGURE', 'FIGCAPTION', 'AUDIO', 'VIDEO', 'SOURCE', 'TRACK'])
const buttonRoles = new Set(['button', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'tab'])
const inputRoles = new Set(['checkbox', 'combobox', 'listbox', 'option', 'radio', 'searchbox', 'slider', 'spinbutton', 'switch', 'textbox'])
const tableRoles = new Set(['cell', 'columnheader', 'grid', 'gridcell', 'row', 'rowgroup', 'rowheader', 'table'])

function getElement (item:ITranslatableItem) {
  return item.translatableItem?.element || item.translatableItem?.startMarker?.parentElement || null
}

function isSeo (item:ITranslatableItem) {
  return item.type === TranslatableItemType.ELEMENT_SEO || item.type === TranslatableItemType.ATTRIBUTE_SEO
}

function getSeoType (item:ITranslatableItem, element:HTMLElement):SeoType | undefined {
  if (item.type === TranslatableItemType.ELEMENT_SEO && element?.tagName === 'TITLE') {
    return 'PAGE_TITLE'
  }

  const identifier = (item.description || '').toLowerCase()
  switch (identifier) {
    case 'title': return 'PAGE_TITLE'
    case 'description': return 'META_DESCRIPTION'
    case 'og:title': return 'OG_TITLE'
    case 'og:description': return 'OG_DESCRIPTION'
    case 'twitter:title': return 'TWITTER_TITLE'
    case 'twitter:description': return 'TWITTER_DESCRIPTION'
    default: return undefined
  }
}

function getComposedParentElement (element:HTMLElement):HTMLElement | null {
  if (element.parentElement) {
    return element.parentElement
  }

  const root = element.getRootNode()
  return 'host' in root ? (root as ShadowRoot).host as HTMLElement : null
}

function getContentLocations (element:HTMLElement):ContentLocation[] {
  const locations = new Set<ContentLocation>()
  let current:HTMLElement | null = element

  while (current) {
    const tagName = current.tagName
    const role = (current.getAttribute('role') || '').toLowerCase()
    const ariaLabel = (current.getAttribute('aria-label') || '').toLowerCase()

    if (tagName === 'NAV' || role === 'navigation' || ariaLabel.includes('breadcrumb')) locations.add('NAVIGATION')
    if (tagName === 'HEADER' || role === 'banner' || ariaLabel.includes('announcement')) locations.add('HEADER')
    if (tagName === 'FOOTER' || role === 'contentinfo') locations.add('FOOTER')
    if (tagName === 'FORM' || role === 'form') locations.add('FORM')
    if (tagName === 'MAIN' || role === 'main') locations.add('MAIN_CONTENT')
    if (tagName === 'DIALOG' || role === 'dialog' || role === 'alertdialog') locations.add('DIALOG')

    current = getComposedParentElement(current)
  }

  if (inputTags.has(element.tagName)) locations.add('FORM')
  if (locations.size === 0) locations.add('OTHER')

  return Array.from(locations)
}

function getElementType (element:HTMLElement):ContentElementType {
  const tagName = element.tagName
  const role = (element.getAttribute('role') || '').toLowerCase()
  const inputType = (element.getAttribute('type') || '').toLowerCase()

  if (headingTags.has(tagName) || role === 'heading') return 'HEADING'
  if (tagName === 'BUTTON' || (tagName === 'INPUT' && ['button', 'submit', 'reset'].includes(inputType)) || buttonRoles.has(role)) return 'BUTTON'
  if (tagName === 'A' || tagName === 'AREA' || role === 'link') return 'LINK'
  if (inputTags.has(tagName) || inputRoles.has(role)) return 'INPUT'
  if (listTags.has(tagName) || role === 'list' || role === 'listitem') return 'LIST'
  if (tableTags.has(tagName) || tableRoles.has(role)) return 'TABLE'
  if (mediaTags.has(tagName) || role === 'img') return 'MEDIA'
  if (paragraphTags.has(tagName)) return 'PARAGRAPH'

  return 'OTHER'
}

export function classifySegment (item:ITranslatableItem, id:string):ISegmentMetadata {
  const element = getElement(item)
  if (isSeo(item)) {
    return {
      id,
      seoType: getSeoType(item, element)
    }
  }

  if (!element) {
    return {
      id,
      contentLocations: ['OTHER'],
      elementType: 'OTHER'
    }
  }

  return {
    id,
    contentLocations: getContentLocations(element),
    elementType: getElementType(element)
  }
}
