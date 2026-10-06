export class NavigationObserver {
  private currentRoute: string
  private readonly originalPushState: History['pushState']
  private readonly originalReplaceState: History['replaceState']
  private readonly pushState: History['pushState']
  private readonly replaceState: History['replaceState']

  constructor (private readonly onNavigate: () => void) {
    this.currentRoute = this.getCurrentRoute()
    this.originalPushState = window.history.pushState
    this.originalReplaceState = window.history.replaceState

    this.pushState = (...args) => {
      this.originalPushState.apply(window.history, args)
      this.notifyIfRouteChanged()
    }
    this.replaceState = (...args) => {
      this.originalReplaceState.apply(window.history, args)
      this.notifyIfRouteChanged()
    }

    window.history.pushState = this.pushState
    window.history.replaceState = this.replaceState
    window.addEventListener('popstate', this.notifyIfRouteChanged)
    window.addEventListener('hashchange', this.notifyIfRouteChanged)
  }

  public dispose () {
    if (window.history.pushState === this.pushState) {
      window.history.pushState = this.originalPushState
    }
    if (window.history.replaceState === this.replaceState) {
      window.history.replaceState = this.originalReplaceState
    }

    window.removeEventListener('popstate', this.notifyIfRouteChanged)
    window.removeEventListener('hashchange', this.notifyIfRouteChanged)
  }

  private readonly notifyIfRouteChanged = () => {
    const nextRoute = this.getCurrentRoute()
    if (nextRoute === this.currentRoute) {
      return
    }

    this.currentRoute = nextRoute
    this.onNavigate()
  }

  private getCurrentRoute () {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`
  }
}
