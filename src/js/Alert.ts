import { closeToolbarSection } from './Common'
import { IPluginOptions } from './interfaces/IPluginOptions'

class Alert {
  static display (
    pluginOptions:IPluginOptions,
    message:string,
    type:string,
    uiLocalization,
    detailedMessage:string = null
  ) {
    const alert = document.createElement('div')
    alert.ariaLive = 'polite'

    this.clear()
    alert.classList.add('website-translator-toolbar-alert', 'closable')

    const messageContainer = document.createElement('span')
    const detailedMessageContainer = document.createElement('span')
    detailedMessageContainer.classList.add('detailed-message')
    detailedMessageContainer.textContent = detailedMessage

    messageContainer.textContent = message
    alert.appendChild(messageContainer)
    if (detailedMessage !== null) {
      messageContainer.appendChild(detailedMessageContainer)
    }
    if (type === 'danger' || type === 'success') {
      const icon = document.createElement('span')
      icon.classList.add('website-translator-icon')
      icon.classList.add(`website-translator-icon-${type}`)
      alert.appendChild(icon)
    }

    alert.appendChild(closeToolbarSection(uiLocalization))

    const toolbar = document.querySelector('.website-translator-toolbar')
    if (toolbar !== null) {
      if (pluginOptions.ui.toolbarPosition === 'top') {
        toolbar.appendChild(alert)
      }
      else if (pluginOptions.ui.toolbarPosition === 'bottom') {
        toolbar.insertBefore(alert, toolbar.firstChild)
      }
    }
  }

  static clear () {
    const alert = document.querySelector('.website-translator-toolbar-alert')
    if (alert) {
      alert.parentNode.removeChild(alert)
    }
  }
}
export default Alert
