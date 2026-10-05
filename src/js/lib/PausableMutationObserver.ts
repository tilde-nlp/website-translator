import { IPluginOptions } from '../interfaces/IPluginOptions'
import { Logger } from '../Logger'
import { DOMExtensions } from './DOMExtensions'

export class PausableMutationObserver {
    private logger: Logger
    private mutationObservers: Array<MutationObserver>
    private observedRoots: Set<Node>
    private knownRoots: Set<Node>
    private onMutationObserved: (element: MutationRecord) => void

    /** If Mutation observer is started manually,
     * if not usingPause calls should not enable mutation observation */
    private running:boolean
    private lockLevel: number
    private config:MutationObserverInit = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    }

    constructor (
      pluginOptions: IPluginOptions,
      onMutationDiscovered: (element: MutationRecord) => void
    ) {
      this.logger = new Logger(pluginOptions.debug, 'PausableMutationObserver')
      this.mutationObservers = []
      this.observedRoots = new Set<Node>()
      this.knownRoots = new Set<Node>()
      this.onMutationObserved = onMutationDiscovered
      this.lockLevel = 0
    }

    public usingPause (func: () => void) {
      if (this.running) {
        try {
          this.lockLevel++
          // this.logger.debug(`Lock pause, level: ${this.lockLevel}`)
          this.stop()
          func()
        }
        finally {
          this.lockLevel--
          this.start()
          // this.logger.debug(`Lock release pause, level: ${this.lockLevel}`)
        }
      }
      else {
        func()
      }
    }

    public stop () {
      this.lockLevel--

      if (this.lockLevel <= 0) {
        // this.logger.info('stop listen')
        this.running = false
        for (const mutationObserver of this.mutationObservers) {
          mutationObserver.disconnect()
        }
        this.mutationObservers = []
        this.observedRoots.clear()
      }
    }

    public observeNewRoots () {
      if (!this.running) {
        return
      }

      for (const node of DOMExtensions.selectObservableRoots()) {
        this.observeRoot(node)
      }
    }

    public observeRoot (node: Node) {
      this.knownRoots.add(node)

      if (!this.running) {
        return
      }

      if (this.observedRoots.has(node)) {
        return
      }

      const observer = new MutationObserver((mutationsList:MutationRecord[]) => {
        for (const mutation of mutationsList) {
          if (this.lockLevel === 0) {
            this.onMutationObserved(mutation)
          }
        }
      })

      observer.observe(node, this.config)
      this.mutationObservers.push(observer)
      this.observedRoots.add(node)
    }

    public clearRoots () {
      this.knownRoots.clear()
      this.observedRoots.clear()
    }

    public start () {
      if (this.lockLevel <= 0) {
        this.lockLevel = 0
        // this.logger.info('start listen')
        this.running = true

        this.knownRoots.forEach(node => this.observeRoot(node))
        this.observeNewRoots()
      }
    }
}
