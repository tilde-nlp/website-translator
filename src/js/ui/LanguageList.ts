import { ILanguageSelect } from '../Interfaces/ILanguageSelect'

import settingsIcon from '../../assets/settings.png'
import { BehaviorSubject, Subscription } from 'rxjs'
import { ILocalizedLanguage } from '../Interfaces/ILocalizedLanguage'
import { IPluginOptions } from '../Interfaces/IPluginOptions'
import { getLanguageName } from '../Common'

export class LanguageList implements ILanguageSelect {
  private items: {}
  private defaultItem: any
  private uiLocalization: BehaviorSubject<ILocalizedLanguage>
  private readonly pluginOptions: IPluginOptions
  private subscriptions:Array<Subscription>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (
    uiLocalization: BehaviorSubject<ILocalizedLanguage>,
    langCodes,
    pluginOptions: IPluginOptions
  ) {
    // For storing DOM element references
    this.items = {

    }
    this.defaultItem = null
    this.uiLocalization = uiLocalization
    this.subscriptions = []
    this.pluginOptions = pluginOptions
  }

  create (items: Array<any>, onSelect: Function, defaultItem) {
    this.defaultItem = defaultItem
    const widget = document.querySelector('.website-translator')

    const container = document.createElement('div')
    container.classList.add('language-list')

    for (const item of items) {
      const lang = document.createElement('button')

      this.items[item.id] = lang

      lang.type = 'button'
      lang.appendChild(document.createTextNode(getLanguageName(item.langCode, this.pluginOptions, this.uiLocalization)))

      if (this.pluginOptions.ui.showLanguagesInNativeLanguage) {
        lang.setAttribute('lang', item.langCode)
      }

      lang.dataset.id = item.id

      if (item.machineTranslated) {
        const icon = document.createElement('span')
        icon.classList.add('icon')
        const img = document.createElement('img')
        img.src = settingsIcon

        this.subscriptions.push(
          this.uiLocalization.subscribe({
            next: () => {
              img.title = this.uiLocalization.value.labels.machineTranslatedText
            }
          })
        )

        icon.appendChild(img)
        lang.appendChild(icon)
        lang.classList.add('machine-translated-language')
      }
      lang.onclick = async () => {
        await onSelect(item.id, item.langCode)

        for (const opt in this.items) {
          this.items[opt].classList.remove('active')
        }
        lang.classList.add('active')
      }
      container.appendChild(lang)
    }
    widget.appendChild(container)

    this.reset()
  }

  // progress (percent: number) {
  //   var widget = document.querySelector('.website-translator')
  //   widget.setAttribute('style', `background: linear-gradient(to right, palegreen ${percent * 100}%, transparent 0)`)
  // }

  select (id: string) {
    const item = this.items[id]
    if (item) {
      item.click()
      return true
    }
    return false
  }

  reset () {
    this.silentSelect(this.defaultItem.id)
  }

  silentSelect (id: string) {
    for (const opt in this.items) {
      this.items[opt].classList.remove('active')
    }
    this.items[id].classList.add('active')
  }

  public dispose () {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    this.subscriptions = []
  }
}
