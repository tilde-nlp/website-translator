import { TranslatableItemType } from '../Enums/TranslatableItemType'

export interface ITranslationAttribute {
    /**
     * Description of attribute, for example that attribute is "page title..."
     */
    descriptionAttributeValue:string
    /**
     * Translatable attribute name
     */
    translationAtttibuteName:string
    /**
     * Original translatable attribute value
     */
    translationAtttibuteValue:string
    /**
     * Attribute type
     */
    type:TranslatableItemType
}
