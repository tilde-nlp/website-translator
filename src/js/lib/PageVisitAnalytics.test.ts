import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import WebsiteService from '../services/WebsiteService'
import { PageVisitAnalytics } from './PageVisitAnalytics'

describe('PageVisitAnalytics', () => {
  let reportPageVisit: ReturnType<typeof jest.fn>
  let debug: ReturnType<typeof jest.fn>
  let analytics: PageVisitAnalytics

  beforeEach(() => {
    window.history.replaceState(null, '', '/products?campaign=one#details')
    reportPageVisit = jest.fn(() => Promise.resolve())
    debug = jest.fn()
    analytics = new PageVisitAnalytics(
      'EN',
      { reportPageVisit } as unknown as WebsiteService,
      { debug }
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('does not report native-language initialization', () => {
    analytics.record('en')
    analytics.record('EN')

    expect(reportPageVisit).not.toHaveBeenCalled()
  })

  it('does not report visits when analytics is disabled for single-batch mode', () => {
    const singleBatchAnalytics = new PageVisitAnalytics(
      'en',
      { reportPageVisit } as unknown as WebsiteService,
      { debug },
      false
    )

    singleBatchAnalytics.record('lv')

    expect(reportPageVisit).not.toHaveBeenCalled()
  })

  it('reports translated-language initialization with the current URL', () => {
    analytics.record('LV')

    expect(reportPageVisit).toHaveBeenCalledTimes(1)
    expect(reportPageVisit).toHaveBeenCalledWith(
      'https://widget.example/products?campaign=one#details',
      'lv'
    )
  })

  it('deduplicates repeated renders and initialization callbacks', () => {
    analytics.record('lv')
    analytics.record('LV')
    analytics.record('lv')

    expect(reportPageVisit).toHaveBeenCalledTimes(1)
  })

  it('reports each newly selected translated language once', () => {
    analytics.record('en')
    analytics.record('lv')
    analytics.record('de')
    analytics.record('lv')
    analytics.record('de')

    expect(reportPageVisit.mock.calls).toEqual([
      ['https://widget.example/products?campaign=one#details', 'lv'],
      ['https://widget.example/products?campaign=one#details', 'de']
    ])
  })

  it('allows the same language on a different pathname', () => {
    analytics.record('lv')

    window.history.pushState(null, '', '/checkout?step=one#payment')
    analytics.record('lv')

    expect(reportPageVisit.mock.calls).toEqual([
      ['https://widget.example/products?campaign=one#details', 'lv'],
      ['https://widget.example/checkout?step=one#payment', 'lv']
    ])
  })

  it('ignores query-string-only and fragment-only changes', () => {
    analytics.record('lv')

    window.history.pushState(null, '', '/products?campaign=two#details')
    analytics.record('lv')
    window.history.pushState(null, '', '/products?campaign=two#reviews')
    analytics.record('lv')

    expect(reportPageVisit).toHaveBeenCalledTimes(1)
  })

  it('allows a new request in a new browser page lifecycle', () => {
    analytics.record('lv')

    const reloadedAnalytics = new PageVisitAnalytics(
      'en',
      { reportPageVisit } as unknown as WebsiteService,
      { debug }
    )
    reloadedAnalytics.record('lv')

    expect(reportPageVisit).toHaveBeenCalledTimes(2)
  })

  it('reserves a page and language before an asynchronous request completes', () => {
    let resolveRequest:() => void
    reportPageVisit.mockImplementation(() => new Promise<void>(resolve => {
      resolveRequest = resolve
    }))

    analytics.record('lv')
    analytics.record('lv')
    resolveRequest!()

    expect(reportPageVisit).toHaveBeenCalledTimes(1)
  })

  it('does not block later language selections when analytics fails', async () => {
    reportPageVisit.mockImplementation(() => Promise.reject(new Error('request unavailable')))

    expect(() => analytics.record('lv')).not.toThrow()
    expect(() => analytics.record('de')).not.toThrow()
    await Promise.resolve()

    expect(reportPageVisit).toHaveBeenCalledTimes(2)
    expect(debug).toHaveBeenCalledTimes(2)
  })

  it('logs only a safe status and never logs request credentials', async () => {
    const unauthorized = Object.assign(new Error('unauthorized'), {
      response: {
        status: 401,
        config: {
          headers: {
            Authorization: 'Bearer sensitive-token'
          }
        }
      }
    })
    reportPageVisit.mockImplementation(() => Promise.reject(unauthorized))

    analytics.record('lv')
    await Promise.resolve()

    expect(debug).toHaveBeenCalledWith('Page visit analytics request failed with status 401')
    expect(JSON.stringify(debug.mock.calls)).not.toContain('sensitive-token')
  })
})
