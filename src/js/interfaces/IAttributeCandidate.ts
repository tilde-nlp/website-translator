import { TranslatableItemType } from '../enums/TranslatableItemType'

export default interface IAttributeCandidate{
    translatableAttribute:string
    requiredAttributeName?:string,
    requiredAttributeValue?:string,
    type: TranslatableItemType
  }
