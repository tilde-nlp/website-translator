// https://www.link-assistant.com/news/html-tags-for-seo.html

import { TranslatableItemType } from '../Enums/TranslatableItemType'
import IElementCandidate from '../interfaces/IElementCandidate'

export const TranslationElementCandidates = new Map<string, IElementCandidate>([
  [
    'TITLE',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ],
  [
    'H1',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ],
  [
    'H2',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ],
  [
    'H3',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ],
  [
    'H4',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ],
  [
    'H5',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ],
  [
    'H6',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ]
])
