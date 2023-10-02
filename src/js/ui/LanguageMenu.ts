import { BehaviorSubject, Subscription } from 'rxjs'
import { ILanguageSelect } from '../interfaces/ILanguageSelect'

import settingsIcon from '../../assets/settings.png'
import { closest, getLanguageName } from '../Common'
import { ILocalizedLanguage } from '../interfaces/ILocalizedLanguage'
import { IPluginOptions } from '../interfaces/IPluginOptions'
import { ILanguage } from '../interfaces/ILanguage'
import { IInternalUiOptions } from '../interfaces/IInternalUiOptions'

/**
 * This is custom language select and not the native DOM select because of the requirements
 * in eu2020. They need styled icons in select options for machine translated languages.
 */
export class LanguageMenu implements ILanguageSelect {
  private menuItems: {[languageCode:string]: any};
  private items: {[id:string]: HTMLElement}
  private selectedItem: HTMLElement;
  private defaultItem: any;
  private uiLocalization: BehaviorSubject<ILocalizedLanguage>;
  private currentLangCode: string;
  private languageChanged: BehaviorSubject<any>;
  private langCodes: { [Key: string]: ILanguage};
  private pluginOptions: IPluginOptions;
  private internalOptions:IInternalUiOptions;

  private menuSelect: HTMLElement;
  private menuContainer: HTMLElement;
  private menuCloseListener:(event: MouseEvent)=>void;
  private subscriptions:Array<Subscription>;
  private disposed:boolean
  constructor (
    uiLocalization: BehaviorSubject<ILocalizedLanguage>,
    langCodes: { [Key: string]: ILanguage },
    pluginOptions: IPluginOptions,
    internalOptions:IInternalUiOptions
  ) {
    // For storing DOM element references
    this.items = {}
    this.menuItems = {}
    this.selectedItem = null
    this.defaultItem = null
    this.uiLocalization = uiLocalization
    this.languageChanged = new BehaviorSubject<any>(1)
    this.langCodes = langCodes
    this.currentLangCode = 'en'
    this.pluginOptions = pluginOptions
    this.internalOptions = internalOptions
    this.subscriptions = []
    this.disposed = true
  }

  public create (items: Array<any>, onSelect: Function, defaultItem: any, container: HTMLElement) {
    this.dispose()

    this.disposed = false
    this.menuContainer = container
    this.defaultItem = defaultItem

    const languageMenu = document.createElement('div')
    languageMenu.classList.add('language-menu')

    this.menuSelect = document.createElement('div')
    this.menuSelect.classList.add('website-translator-select')

    languageMenu.appendChild(this.menuSelect)

    const selectedItem = document.createElement('button')
    selectedItem.classList.add('selected-item')
    selectedItem.type = 'button'
    selectedItem.setAttribute('aria-label', this.uiLocalization.value.labels.selectLanguage)

    this.selectedItem = selectedItem

    const menuText = document.createElement('span')
    menuText.classList.add('menu-text')

    this.subscriptions.push(
      this.uiLocalization.subscribe({
        next: () => {
          this.languageChanged.next(null)
        }
      })
    )

    this.subscriptions.push(
      this.languageChanged.subscribe({
        next: () => {
          menuText.textContent = getLanguageName(this.currentLangCode, this.pluginOptions, this.uiLocalization)
          if (this.pluginOptions.ui.showLanguagesInNativeLanguage) {
            menuText.setAttribute('lang', this.currentLangCode)
          }          
          selectedItem.setAttribute('aria-label', this.uiLocalization.value.labels.selectLanguage)
        }
      })
    )

    const menuArrow = document.createElement('img')
    menuArrow.classList.add('menu-arrow')
    menuArrow.src = this.internalOptions.ui.icons.menuIcon
    menuArrow.setAttribute('role', 'presentation')

    selectedItem.appendChild(menuText)
    selectedItem.appendChild(menuArrow)

    selectedItem.onclick = () => {
      this.menuSelect.classList.toggle('open')
    }

    selectedItem.onkeydown = (event) => {
      switch (event.code) {
        case 'Space':
        case 'NumpadEnter':
        case 'Enter': {
          this.menuSelect.classList.toggle('open', true)
          const selectedOption = options.querySelector('.option.selected') as HTMLElement
          selectedOption.focus()

          event.preventDefault()
          event.stopPropagation()
          break
        }
        default: {
          break
        }
      }
    }

    const options = document.createElement('div')
    options.classList.add('options')
    options.setAttribute('tabindex', '0')
    options.setAttribute('role', 'menu')

    for (const item of items) {
      const option = document.createElement('span')
      option.classList.add('option')
      option.setAttribute('tabindex', '-1')
      option.setAttribute('role', 'menuitem')

      this.items[item.id] = option
      this.menuItems[item.id] = item

      const optionText = document.createElement('span')

      this.subscriptions.push(
        this.uiLocalization.subscribe({
          next: () => {
            optionText.textContent = getLanguageName(item.langCode, this.pluginOptions, this.uiLocalization)
            option.title = optionText.textContent
            if (this.pluginOptions.ui.showLanguagesInNativeLanguage) {
              optionText.setAttribute('lang', item.langCode)
            }
          }
        })
      )

      optionText.classList.add('text')

      const optionIcon = document.createElement('span')
      optionIcon.classList.add('icon')

      option.appendChild(optionText)
      option.appendChild(optionIcon)

      option.dataset.id = item.id

      if (item.machineTranslated) {
        const img = document.createElement('img')
        img.src = settingsIcon

        this.subscriptions.push(
          this.uiLocalization.subscribe({
            next: () => {
              img.title = this.uiLocalization.value.labels.machineTranslatedText
            }
          })
        )
        optionIcon.appendChild(img)
        option.classList.add('machine-translated-language')
      }

      option.onclick = async () => {
        await onSelect(item.id, item.langCode)
        this.menuSelect.classList.remove('open')
        menuText.textContent = item.text

        for (const opt in this.items) {
          this.items[opt].classList.remove('selected')
        }
        option.classList.add('selected')
        this.currentLangCode = item.langCode
        this.languageChanged.next(null)
      }

      option.onkeydown = (event) => {
        switch (event.code) {
          case 'Escape':
          case 'Tab': {
            this.menuSelect.classList.toggle('open', false)
            break
          }
          case 'ArrowUp': {
            if (option.previousSibling) {
              (option.previousSibling as HTMLElement).focus()
            }
            else {
              (option.parentElement.lastChild as HTMLElement).focus()
            }

            break
          }
          case 'ArrowDown': {
            if (option.nextSibling) {
              (option.nextSibling as HTMLElement).focus()
            }
            else {
              (option.parentElement.firstChild as HTMLElement).focus()
            }
            break
          }
          case 'Enter': {
            option.click()
            break
          }
        }
      }

      options.appendChild(option)
    }

    this.menuSelect.appendChild(selectedItem)
    this.menuSelect.appendChild(options)

    this.menuContainer.appendChild(languageMenu)

    this.menuCloseListener = this.onDomClick.bind(this)
    window.addEventListener('click', this.menuCloseListener)

    this.reset()
  }

  private onDomClick (event: MouseEvent) {
    let shouldCloseMenu = false
    try {
      const targetElement = event.target
      if (!targetElement || closest(targetElement, '.website-translator .language-menu') === null) {
        shouldCloseMenu = true
      }
    }
    catch (err) {
      shouldCloseMenu = true
    }
    finally {
      if (shouldCloseMenu) {
        this.menuSelect.classList.remove('open')
      }
    }
  }

  public select (id: string) {
    const item = this.items[id]
    if (item) {
      item.click()
      return true
    }
    return false
  }

  public reset () {
    this.silentSelect(this.defaultItem.langCode)
  }

  public silentSelect (id: string) {
    for (const opt in this.items) {
      this.items[opt].classList.remove('selected')
    }

    this.items[id].classList.add('selected')
    const langCode:string = this.menuItems[id].langCode

    this.currentLangCode = langCode
    this.languageChanged.next(null)
  }

  public dispose () {
    if (this.disposed) {
      return
    }
    this.disposed = true
    window.removeEventListener('click', this.menuCloseListener)

    this.menuContainer.childNodes.forEach(child => {
      child.remove()
    })

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    this.subscriptions = []
  }
}

export default LanguageMenu
