import { Logger } from '../Logger'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'
import { TranslationPriority } from '../enums/TranslationPriority'

/**
 * Async queue for processing items.
 * This queue shedules workers in given concurrency
 * Something similar to https://caolan.github.io/async/v3/docs.html#queue
 * but more minimalistic
 */
export class TranslationQueue {
    /**
     * Function that process queue elements
     */
    private worker:(queue: TranslationQueue, batchNumber: number, batch:Array<ITranslatableItem>, priority: TranslationPriority)=>void
    /**
     * Maximum elements that can be processed in parallel
     */
    private maxConcurrency:number
    /**
     * Logger
     */
    private logger: Logger
    /**
     * Items that need to be processed
     */
    private queue: Array<[number, Array<ITranslatableItem>]>
    /**
     * Promise that resolves when queue is [killed/completed]
     */
    private onDrain: Promise<void>
    /**
     * Function that resolves onDrain
     */
    private onDrainResolved: Function
    /**
     * Current actual concurrency
     */
    private currentConcurrency:number
    /**
     * Wether queue is killed
     */
    private killed:boolean
    /**
    * How many batches are processed
    */
    private itemsProcessed: number
    /**
     * How many async items will be added in future
     */
    private asyncItemsScheduled: number

    /**
     * As worker schedule is async, we can asynchonously acknowledge that async items are scheduled (forget that they were scheduled in future)
     */
    private asyncItemsScheduledToRelease:number

    constructor (
      pluginOptions:IPluginOptions,
      worker: (queue: TranslationQueue, batchNumber: number, batch:Array<ITranslatableItem>, priority:TranslationPriority)=>void,
      concurrency:number
    ) {
      this.logger = new Logger(pluginOptions.debug, 'TranslationQueue')
      this.worker = worker
      this.maxConcurrency = concurrency
      this.currentConcurrency = 0
      this.killed = false
      this.itemsProcessed = 0
      this.asyncItemsScheduled = 0
      this.asyncItemsScheduledToRelease = 0

      this.onDrain = new Promise(resolve => {
        this.onDrainResolved = resolve
      })

      this.queue = []
    }

    public size () {
      return this.queue.length
    }

    public getItems (): ReadonlyArray<Array<ITranslatableItem>> {
      return this.queue.map(item => item[1])
    }

    /**
     * Remove items with specific priority from queue
     * @returns How many items were removed
     */
    public clear (priority:TranslationPriority):number {
      const itemsPreviously = this.queue.length

      this.queue = this.queue.filter(item => item[0] !== priority)

      const itemsRemoved = itemsPreviously - this.queue.length
      this.logger.debug(`queue cleared from '${itemsRemoved}' items`)
      this.incrementConcurrency()
      return itemsRemoved
    }

    public count () {
      return this.queue.length
    }

    /**
     * Add item after timeout
     * @param item
     * @param timeout timeout in milliseconds
     */
    public addItemAsync (item: Array<ITranslatableItem>, priority: number, timeout:number) {
      this.asyncItemsScheduled++
      this.logger.debug(`async add item in: ${timeout}ms`)
      setTimeout(() => {
        this.logger.debug('async add')
        this.addItemSync(item, priority, true)
      }, timeout)
    }

    public addItem (item: Array<ITranslatableItem>, priority: number) {
      this.addItemSync(item, priority)
    }

    private addItemSync (item: Array<ITranslatableItem>, priority: number, asyncRelease: boolean = false) {
      this.logger.debug('new batch item submitted')
      this.queue.push([priority, item])

      if (asyncRelease) {
        this.asyncItemsScheduledToRelease++
      }
      this.incrementConcurrency()
    }

    /**
     * Kill the queue. If killed, you can create new queue.
     */
    public kill () {
      this.logger.debug('killing...')
      this.killed = true
      this.queue = []
      this.onDrainResolved()
    }

    /**
     * Run the queue. Returns promise which resolves when queue is [ killed / completed ]
     */
    public drain (): Promise<void> {
      this.logger.debug('waiting drain...')
      this.incrementConcurrency()
      return this.onDrain
    }

    /**
     * Callback when worker is done processing single item
     */
    public onItemProcessed () {
      this.currentConcurrency--

      // Update async scheduled items
      this.asyncItemsScheduled -= this.asyncItemsScheduledToRelease
      this.asyncItemsScheduledToRelease = 0

      this.incrementConcurrency()
    }

    /**
     * Schedule single workitem to worker
     */
    private async callNextItem () {
      if (!this.killed) {
        if (this.queue.length > 0) {
          this.logger.debug(`items left: ${this.queue.length}`)
          if (this.currentConcurrency < this.maxConcurrency) {
            this.currentConcurrency++

            const item = this.queue.shift()
            this.worker(this, this.itemsProcessed, item[1], item[0])

            this.itemsProcessed++
          }
        }
      }
    }

    /**
     * Shedule items with given concurrency
     */
    private incrementConcurrency () {
      const itemsToSchedule = this.maxConcurrency - this.currentConcurrency
      for (let i = 0; i < itemsToSchedule; i++) {
        this.callNextItem()
      }

      if (itemsToSchedule === this.maxConcurrency && this.currentConcurrency === 0 && this.queue.length === 0 && !this.killed) {
        if (this.asyncItemsScheduled === 0) {
          this.logger.debug('drained. no more items are in the queue')
          this.onDrainResolved()
        }
        else {
          this.logger.debug('drained, but still waiting for async items')
        }
      }
    }
}
