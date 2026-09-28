import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import axios, { CancelToken } from 'axios'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import WebsiteService from './WebsiteService'

jest.mock('axios')

const mockedPost = axios.post as jest.Mock
const cancelToken = {} as CancelToken
const tokenUrl = 'https://api.example/api/websitetranslationservice/translate/website/website-1/translate/widget-token'
const batchUrl = 'https://api.example/api/websitetranslationservice/translate/website/website-1/translate/batch'
const wordCountUrl = 'https://api.example/api/websitetranslationservice/word-count/website-1/pages'

function createService () {
  return new WebsiteService({
    api: {
      clientId: 'website-1',
      url: 'https://api.example',
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
