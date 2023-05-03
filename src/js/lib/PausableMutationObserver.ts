import { IPluginOptions } from '../interfaces/IPluginOptions'
import { Logger } from '../Logger'
import { DOMExtensions } from './DOMExtensions'

export class PausableMutationObserver {
    private logger: Logger
    private mutationObservers: Array<MutationObserver>
    private onMutationObserved: (element: MutationRecord) => void

    /** If Mutation observer is started manually,
     * if not usingPause calls should not enable mutation observation */
    private running:boolean
    private lockLevel: number
    private config:MutationObserverInit = {
      characterData: true,
      subtree: true
    }

    constructor (
      pluginOptions: IPluginOptions,
      onMutationDiscovered: (element: MutationRecord) => void
    ) {
      this.logger = new Logger(pluginOptions.debug, 'PausableMutationObserver')
      this.mutationObservers = []
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
      }
    }

    public start () {
      if (this.lockLevel <= 0) {
        this.lockLevel = 0
        // this.logger.info('start listen')
        this.running = true

        const htmlNodes = DOMExtensions.selectDOMElements('html')

        for (const node of htmlNodes) {
          const observer = new MutationObserver((mutationsList:MutationRecord[], observer) => {
            for (const mutation of mutationsList) {
              if (this.lockLevel === 0) {
                this.onMutationObserved(mutation)
              }
            }
          })

          // Start observing the target node for configured mutations
          observer.observe(node, this.config)

          this.mutationObservers.push(observer)
        }
      }
    }
}
