import { TranslatableItemType } from '../enums/TranslatableItemType'
import { ITranslationAttribute } from '../interfaces/ITranslationAttribute'

export class TranslationTextRange {
    startMarker: HTMLElement
    endMarker: HTMLElement
    visibleInCurrentView: boolean
    type: TranslatableItemType
    html: string
    element: HTMLElement
    attributes: Array<ITranslationAttribute>
    markedElementCount:number
    tagNames: {[tagId: number]: string}

    constructor () {
      this.markedElementCount = 0
      this.tagNames = {}
    }
}
