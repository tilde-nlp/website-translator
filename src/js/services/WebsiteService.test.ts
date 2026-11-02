import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import axios, { CancelToken } from 'axios'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'
import { TranslationTextRange } from '../models/TranslationTextRange'
import WebsiteService from './WebsiteService'

jest.mock('axios')

const mockedPost = axios.post as jest.Mock
const cancelToken = {} as CancelToken
const tokenUrl = 'https://api.example/api/websitetranslationservice/translate/website/website-1/translate/widget-token'
const batchUrl = 'https://api.example/api/websitetranslationservice/translate/website/website-1/translate/batch'
const wordCountUrl = 'https://api.example/api/websitetranslationservice/word-count/website-1/pages'

function createService (websiteTranslationUrl?:string) {
  return new WebsiteService({
    api: {
      clientId: 'website-1',
      url: 'https://api.example',
      websiteTranslationUrl,
      version: 3
    }
  } as IPluginOptions)
}

function tokenResponse (accessToken:string, expiresIn = 300) {
  return {
    data: {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn
    }
  }
}

function translationResponse () {
  return {
    data: [{
      translation: '<g1 sid="42">Translated</g1>'
    }]
  }
}

function translatableItem (
  element:HTMLElement,
  text:string,
  type = TranslatableItemType.ELEMENT,
  attributeName:string = null,
  description:string = null
):ITranslatableItem {
  const range = new TranslationTextRange()
  range.element = element

  return {
    attributeName,
    description,
    tagName: element.tagName,
    text,
    translatableItem: range,
    type
  }
}

describe('WebsiteService widget tokens', () => {
  beforeEach(() => {
    mockedPost.mockReset()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('requests the translate scope and sends token and origin headers', async () => {
    mockedPost
      .mockResolvedValueOnce(tokenResponse('translate-token'))
      .mockResolvedValueOnce(translationResponse())

    await createService().translate([
      { text: 'Original' } as any
    ], 'lv', '/page', cancelToken)

    expect(mockedPost).toHaveBeenNthCalledWith(
      1,
      `${tokenUrl}?scope=translate%3Abatch`,
      undefined,
      { headers: { 'X-Origin': 'https://widget.example' } }
    )
    expect(mockedPost).toHaveBeenNthCalledWith(
      2,
      batchUrl,
      expect.anything(),
      {
        cancelToken,
        headers: {
          Authorization: 'Bearer translate-token',
          'X-Origin': 'https://widget.example'
        }
      }
    )
  })

  it('uses a configured direct website translation service URL', async () => {
    mockedPost
      .mockResolvedValueOnce(tokenResponse('translate-token'))
      .mockResolvedValueOnce(translationResponse())

    await createService('https://localhost:44367/translate/website/').translate([
      { text: 'Original' } as any
    ], 'lv', '/page', cancelToken)

    expect(mockedPost.mock.calls[0][0]).toBe(
      'https://localhost:44367/translate/website/website-1/translate/widget-token?scope=translate%3Abatch'
    )
    expect(mockedPost.mock.calls[1][0]).toBe(
      'https://localhost:44367/translate/website/website-1/translate/batch'
    )
  })

  it('maps mixed batch group identifiers to content classification metadata', async () => {
    document.body.innerHTML = '<main><h1>Products</h1><button>Continue shopping</button></main>'
    const heading = document.querySelector('h1') as HTMLElement
    const button = document.querySelector('button') as HTMLElement
    mockedPost
      .mockResolvedValueOnce(tokenResponse('translate-token'))
      .mockResolvedValueOnce({
        data: [{
          translation: '<g1 sid="1">Produkti</g1>\n<g2 sid="2">Turpināt iepirkties</g2>'
        }]
      })

    await createService().translate([
      translatableItem(heading, 'Products'),
      translatableItem(button, 'Continue shopping')
    ], 'lv', '/products', cancelToken)

    expect(mockedPost.mock.calls[1][1]).toEqual({
      lang: 'lv',
      URL: '/products',
      texts: [{
        text: '<g1>Products</g1>\n<g2>Continue shopping</g2>',
        meta: {
          seo: false,
          tag: 'BATCH',
          attr: null,
          refAttr: null,
          segments: [
            {
              id: 'g1',
              contentLocations: ['MAIN_CONTENT'],
              elementType: 'HEADING'
            },
            {
              id: 'g2',
              contentLocations: ['MAIN_CONTENT'],
              elementType: 'BUTTON'
            }
          ]
        }
      }]
    })
  })

  it('uses the current DOM context for translatable attribute metadata', async () => {
    const input = document.createElement('input')
    const item = translatableItem(input, 'Search', TranslatableItemType.ATTRIBUTE, 'placeholder', 'placeholder')
    const dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    dialog.appendChild(input)
    document.body.appendChild(dialog)
    mockedPost
      .mockResolvedValueOnce(tokenResponse('translate-token'))
      .mockResolvedValueOnce(translationResponse())

    await createService().translate([item], 'lv', '/search', cancelToken)

    expect(mockedPost.mock.calls[1][1].texts[0].meta.segments).toEqual([{
      id: 'g1',
      contentLocations: ['DIALOG', 'FORM'],
      elementType: 'INPUT'
    }])
  })

  it('maps SEO groups to supported SEO types without DOM classifications', async () => {
    const title = document.createElement('title')
    const description = document.createElement('meta')
    const openGraphTitle = document.createElement('meta')
    const openGraphDescription = document.createElement('meta')
    const twitterTitle = document.createElement('meta')
    const twitterDescription = document.createElement('meta')
    const items = [
      translatableItem(title, 'Products', TranslatableItemType.ELEMENT_SEO),
      translatableItem(description, 'Description', TranslatableItemType.ATTRIBUTE_SEO, 'content', 'description'),
      translatableItem(openGraphTitle, 'Products', TranslatableItemType.ATTRIBUTE_SEO, 'content', 'og:title'),
      translatableItem(openGraphDescription, 'Description', TranslatableItemType.ATTRIBUTE_SEO, 'content', 'og:description'),
      translatableItem(twitterTitle, 'Products', TranslatableItemType.ATTRIBUTE_SEO, 'content', 'twitter:title'),
      translatableItem(twitterDescription, 'Description', TranslatableItemType.ATTRIBUTE_SEO, 'content', 'twitter:description')
    ]
    mockedPost
      .mockResolvedValueOnce(tokenResponse('translate-token'))
      .mockResolvedValueOnce({
        data: [{
          translation: items.map((_, index) => `<g${index + 1} sid="${index + 1}">Translated</g${index + 1}>`).join('\n')
        }]
      })

    await createService().translate(items, 'lv', '/products', cancelToken)

    expect(mockedPost.mock.calls[1][1].texts[0].meta).toEqual(expect.objectContaining({
      seo: true,
      segments: [
        {
          id: 'g1',
          seoType: 'PAGE_TITLE'
        },
        {
          id: 'g2',
          seoType: 'META_DESCRIPTION'
        },
        {
          id: 'g3',
          seoType: 'OG_TITLE'
        },
        {
          id: 'g4',
          seoType: 'OG_DESCRIPTION'
        },
        {
          id: 'g5',
          seoType: 'TWITTER_TITLE'
        },
        {
          id: 'g6',
          seoType: 'TWITTER_DESCRIPTION'
        }
      ]
    }))
  })

  it('requests the word count scope for page reports', async () => {
    mockedPost
      .mockResolvedValueOnce(tokenResponse('word-count-token'))
      .mockResolvedValueOnce({ data: undefined })

    await createService().reportWordCountPage(['One two'], '/page', cancelToken)

    expect(mockedPost.mock.calls[0][0]).toBe(`${tokenUrl}?scope=word-count%3Aingest`)
    expect(mockedPost).toHaveBeenNthCalledWith(
      2,
      wordCountUrl,
      {
        Uri: '/page',
        Segments: ['One two']
      },
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer word-count-token',
          'X-Origin': 'https://widget.example'
        }
      })
    )
  })

  it('caches a token by website and scope while it is valid', async () => {
    mockedPost
      .mockResolvedValueOnce(tokenResponse('cached-token'))
      .mockResolvedValue({ data: undefined })
    const service = createService()

    await service.reportWordCountPage(['First'], '/first', cancelToken)
    await service.reportWordCountPage(['Second'], '/second', cancelToken)

    expect(mockedPost.mock.calls.filter(call => call[0].startsWith(tokenUrl))).toHaveLength(1)
  })

  it('refreshes a token shortly before it expires', async () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(1000)
    mockedPost
      .mockResolvedValueOnce(tokenResponse('old-token'))
      .mockResolvedValueOnce({ data: undefined })
      .mockResolvedValueOnce(tokenResponse('fresh-token'))
      .mockResolvedValueOnce({ data: undefined })
    const service = createService()

    await service.reportWordCountPage(['First'], '/first', cancelToken)
    now.mockReturnValue(271000)
    await service.reportWordCountPage(['Second'], '/second', cancelToken)

    expect(mockedPost.mock.calls.filter(call => call[0].startsWith(tokenUrl))).toHaveLength(2)
    expect(mockedPost.mock.calls[3][2].headers.Authorization).toBe('Bearer fresh-token')
  })

  it('deduplicates concurrent token requests for the same website and scope', async () => {
    let resolveToken:(value: ReturnType<typeof tokenResponse>) => void
    const pendingToken = new Promise<ReturnType<typeof tokenResponse>>(resolve => {
      resolveToken = resolve
    })
    mockedPost.mockImplementation((url:string) => {
      if (url.startsWith(tokenUrl)) {
        return pendingToken
      }
      return Promise.resolve({ data: undefined })
    })
    const service = createService()

    const firstReport = service.reportWordCountPage(['First'], '/first', cancelToken)
    const secondReport = service.reportWordCountPage(['Second'], '/second', cancelToken)
    resolveToken!(tokenResponse('shared-token'))
    await Promise.all([firstReport, secondReport])

    expect(mockedPost.mock.calls.filter(call => call[0].startsWith(tokenUrl))).toHaveLength(1)
    expect(mockedPost).toHaveBeenCalledTimes(3)
  })

  it('invalidates a rejected token and retries a protected request only once', async () => {
    const unauthorized = { response: { status: 401 } }
    mockedPost
      .mockResolvedValueOnce(tokenResponse('rejected-token'))
      .mockRejectedValueOnce(unauthorized)
      .mockResolvedValueOnce(tokenResponse('retry-token'))
      .mockRejectedValueOnce(unauthorized)

    await expect(
      createService().reportWordCountPage(['Words'], '/page', cancelToken)
    ).rejects.toBe(unauthorized)

    expect(mockedPost.mock.calls.filter(call => call[0].startsWith(tokenUrl))).toHaveLength(2)
    expect(mockedPost).toHaveBeenCalledTimes(4)
    expect(mockedPost.mock.calls[3][2].headers.Authorization).toBe('Bearer retry-token')
  })
})
