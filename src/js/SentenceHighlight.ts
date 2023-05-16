import { IPluginOptions } from './Interfaces/IPluginOptions'

class SentenceHighlight {
  private lastDocument: Document;
  private pluginOptions: IPluginOptions;

  constructor (pluginOptions:IPluginOptions) {
    this.pluginOptions = pluginOptions
  }

  public applySentenceHighlight (element: HTMLElement, range) {
    if (this.needToHighlight()) {
      this.lastDocument = element.ownerDocument
      this.lastDocument.getSelection().addRange(range)
    }
  }

  public removeSentenceHighlight () {
    if (this.needToHighlight()) {
      if (this.lastDocument) {
        this.lastDocument.getSelection().removeAllRanges()
      }
    }
  }

  private needToHighlight () {
    return this.pluginOptions.ui.showPopup && this.pluginOptions.ui.alwaysShowOriginalTextInPopup
  }
}

export default SentenceHighlight
