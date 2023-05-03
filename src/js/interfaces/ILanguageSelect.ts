export interface ILanguageSelect{

    /**
     * Create DOM
     * @param items
     * @param onSelect
     */
    create (items: Array<any>, onSelect: Function, defaultItem: any, container: HTMLElement):void

    // /**
    //  * Change appearence when translation progress is changed
    //  * @param percent
    //  */
    // progress (percent: number)

    /**
     * Programmatically select element
     * @param id
     */
    select (id: string):void

    /**
     * Programmatically select element silently
     * @param id
     */
    silentSelect (id: string):void

    /**
     * Reset default state
     */
    reset ():void

    /**
     * Dispose language select
     */
    dispose():void
}
