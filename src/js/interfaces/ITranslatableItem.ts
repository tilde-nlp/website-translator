import { TranslatableItemType } from '../Enums/TranslatableItemType'
import { TranslationTextRange } from '../Models/TranslationTextRange'

export interface ITranslatableItem{
    translatableItem: TranslationTextRange
    text:string
    type:TranslatableItemType
    attributeName:string,
    description: string
    tagName: string
}
