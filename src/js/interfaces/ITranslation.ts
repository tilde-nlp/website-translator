import { TranslatableItemType } from '../enums/TranslatableItemType'

export interface IDomTranslation {
    sourceHTML:string;
    translatedHTML:string;
    description:string;
    element:HTMLElement;
    type:TranslatableItemType
    tagNames: {[tagId: number]: string}
}
