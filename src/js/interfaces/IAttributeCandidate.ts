import { TranslatableItemType } from '../Enums/TranslatableItemType'

export default interface IAttributeCandidate{
    translatableAttribute:string
    requiredAttributeName?:string,
    requiredAttributeValue?:string,
    type: TranslatableItemType
  }
