import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { NavigationObserver } from './NavigationObserver'

describe('NavigationObserver', () => {
  let observer: NavigationObserver
  let onNavigate: ReturnType<typeof jest.fn>
  let replaceState: History['replaceState']

  beforeEach(() => {
    window.history.replaceState(null, '', '/page')
    replaceState = window.history.replaceState
    onNavigate = jest.fn()
    observer = new NavigationObserver(onNavigate)
  })

  afterEach(() => {
    observer.dispose()
  })

  it('detects pushState and ignores the same effective route', () => {
    window.history.pushState(null, '', '/next?tab=details#heading')
    window.history.pushState({ updated: true }, '', '/next?tab=details#heading')

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it('detects replaceState route changes', () => {
    window.history.replaceState(null, '', '/replacement')

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it.each(['popstate', 'hashchange'])('detects %s and deduplicates overlapping events', eventName => {
    replaceState.call(window.history, null, '', '/browser-navigation#section')

    window.dispatchEvent(new Event(eventName))
    window.dispatchEvent(new Event(eventName === 'popstate' ? 'hashchange' : 'popstate'))

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})
