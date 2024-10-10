// https://www.link-assistant.com/news/html-tags-for-seo.html

import { TranslatableItemType } from '../enums/TranslatableItemType'
import IElementCandidate from '../interfaces/IElementCandidate'

export const TranslationElementCandidates = new Map<string, IElementCandidate>([
  [
    'TITLE',
    {
      type: TranslatableItemType.ELEMENT_SEO,
      attributeName: 'title'
    }
  ],
  [
    'H1',
    {
      type: TranslatableItemType.ELEMENT_SEO,
      attributeName: 'h1'
    }
  ],
  [
    'H2',
    {
      type: TranslatableItemType.ELEMENT_SEO,
      attributeName: 'h2'
    }
  ],
  [
    'H3',
    {
      type: TranslatableItemType.ELEMENT_SEO,
      attributeName: 'h3'
    }
  ],
  [
    'H4',
    {
      type: TranslatableItemType.ELEMENT_SEO,
      attributeName: 'h4'
    }
  ],
  [
    'H5',
    {
      type: TranslatableItemType.ELEMENT_SEO,
      attributeName: 'h5'
    }
  ],
  [
    'H6',
    {
      type: TranslatableItemType.ELEMENT_SEO,
      attributeName: 'h6'
    }
  ]
])
