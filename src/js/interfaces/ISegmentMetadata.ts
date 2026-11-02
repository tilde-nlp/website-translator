export type ContentLocation =
  'NAVIGATION' |
  'HEADER' |
  'FOOTER' |
  'FORM' |
  'MAIN_CONTENT' |
  'DIALOG' |
  'OTHER'

export type ContentElementType =
  'HEADING' |
  'PARAGRAPH' |
  'BUTTON' |
  'LINK' |
  'INPUT' |
  'LIST' |
  'TABLE' |
  'MEDIA' |
  'OTHER'

export type SeoType =
  'PAGE_TITLE' |
  'META_DESCRIPTION' |
  'OG_TITLE' |
  'OG_DESCRIPTION' |
  'TWITTER_TITLE' |
  'TWITTER_DESCRIPTION'

export interface ISegmentMetadata {
  id: string
  contentLocations?: ContentLocation[]
  elementType?: ContentElementType
  seoType?: SeoType
}
