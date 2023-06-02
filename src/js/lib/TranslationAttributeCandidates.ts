// https://html.spec.whatwg.org/multipage/dom.html#the-translate-attribute
// https://w3c.github.io/aria/#translatable-attributes
// https://developers.google.com/search/docs/advanced/crawling/special-tags

import { TranslatableItemType } from '../enums/TranslatableItemType'
import IAttributeCandidate from '../interfaces/IAttributeCandidate'

export const TranslationAttributeCandidates = new Map<string, IAttributeCandidate[]>([
  [null,
    [
      {
        translatableAttribute: 'title',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'aria-label',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'aria-placeholder',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'aria-roledescription',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'aria-valuetext',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'aria-description',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  [
    'FIELDSET',
    [
      // --- Magento CMS
      {

        translatableAttribute: 'data-hasrequired',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['TH',
    [
      {
        translatableAttribute: 'abbr',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]],
  ['AREA',
    [
      {
        translatableAttribute: 'alt',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['IMG',
    [
      {
        translatableAttribute: 'alt',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['INPUT',
    [
      {
        translatableAttribute: 'alt',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'placeholder',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'value',
        requiredAttributeName: 'type',
        requiredAttributeValue: 'button',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'value',
        requiredAttributeName: 'type',
        requiredAttributeValue: 'submit',
        type: TranslatableItemType.ATTRIBUTE
      },
      {
        translatableAttribute: 'value',
        requiredAttributeName: 'type',
        requiredAttributeValue: 'reset',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['A',
    [
      {
        translatableAttribute: 'download',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['AREA',
    [
      {
        translatableAttribute: 'download',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['OPTGROUP',
    [
      {
        translatableAttribute: 'label',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['OPTION',
    [
      {
        translatableAttribute: 'label',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['TRACK',
    [
      {
        translatableAttribute: 'label',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['TEXTAREA',
    [
      {
        translatableAttribute: 'placeholder',
        type: TranslatableItemType.ATTRIBUTE
      }
    ]
  ],
  ['META',
    [
      // --- Magento CMS
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'title',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      // --- Default
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'application-name',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'description',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'keywords',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'abstract',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      // --- OpenGraph Meta tags --- https://ogp.me/
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'property',
        requiredAttributeValue: 'og:title',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'property',
        requiredAttributeValue: 'og:description',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'property',
        requiredAttributeValue: 'og:site_name',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'property',
        requiredAttributeValue: 'og:image:alt',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      // --- Twitter specific --- https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'twitter:title',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'twitter:description',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'name',
        requiredAttributeValue: 'twitter:image:alt',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      // ---  Schema.org markup for Google+ --- https://schema.org/docs/gs.html
      // TODO: this needs review as this should work not only on metadata HTML tags.
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'itemprop',
        requiredAttributeValue: 'name',
        type: TranslatableItemType.ATTRIBUTE_SEO
      },
      {
        translatableAttribute: 'content',
        requiredAttributeName: 'itemprop',
        requiredAttributeValue: 'description',
        type: TranslatableItemType.ATTRIBUTE_SEO
      }
    ]
  ]
])
