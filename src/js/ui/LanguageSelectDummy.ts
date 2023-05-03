/* eslint-disable @typescript-eslint/no-unused-vars */

import { ILanguageSelect } from '../Interfaces/ILanguageSelect'

export class LanguageSelectDummy implements ILanguageSelect {
  create (items: any[], onSelect: Function, defaultItem: any) {

  }

  progress (percent: number) {

  }

  select (id: string) {

  }

  silentSelect (id: string) {

  }

  reset () {

  }

  dispose () {

  }
}
