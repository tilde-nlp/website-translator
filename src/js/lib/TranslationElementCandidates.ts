// https://www.link-assistant.com/news/html-tags-for-seo.html

import { TranslatableItemType } from '../enums/TranslatableItemType'
import IElementCandidate from '../interfaces/IElementCandidate'

export const TranslationElementCandidates = new Map<string, IElementCandidate>([
  [
    'TITLE',
    {
      type: TranslatableItemType.ELEMENT_SEO
    }
  ]
])
