
import { BehaviorSubject } from 'rxjs'
import { ILanguageSelect } from '../interfaces/ILanguageSelect'
import { LanguageList } from './LanguageList'
import { LanguageSelectDummy } from './LanguageSelectDummy'
import LanguageMenu from './LanguageMenu'
import { ILocalizedLanguage } from '../interfaces/ILocalizedLanguage'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { IInternalUiOptions } from '../interfaces/IInternalUiOptions'

const selectTypes = {
  list: LanguageList,
  menu: LanguageMenu
}

class LanguageSelect {
  static get (
    type,
    uiLocalization: BehaviorSubject<ILocalizedLanguage>,
    langCodes,
    pluginOptions: IPluginOptions,
    internalOptions:IInternalUiOptions
  ) : ILanguageSelect {
    if (!selectTypes[type]) {
      return new LanguageSelectDummy()
    }
    else {
      return new selectTypes[type](uiLocalization, langCodes, pluginOptions, internalOptions)
    }
  }
}

export default LanguageSelect
