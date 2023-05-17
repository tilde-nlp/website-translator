import { TranslatableItemType } from '../enums/TranslatableItemType'
import { TranslationTextRange } from '../models/TranslationTextRange'

export interface ITranslatableItem{
    translatableItem: TranslationTextRange
    text:string
    type:TranslatableItemType
    attributeName:string,
    description: string
    tagName: string
}
