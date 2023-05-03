export class ProgressBar {
    private progressBar:HTMLElement
    private progressBarBuffer:HTMLElement

    constructor () {
      this.progressBar = document.createElement('div')
      this.progressBar.classList.add('progress-bar')

      this.progressBarBuffer = document.createElement('div')
      this.progressBarBuffer.classList.add('buffered')
      this.progressBarBuffer.classList.add('progress-bar')

      this.progressBar.appendChild(this.progressBarBuffer)
    }

    /**
     * Set progress of progress bar
     * @param progress 0 - 1
     */
    public setProgress (progress:number) {
      this.progressBar.classList.remove('indeterminate')
      this.progressBarBuffer.setAttribute('style', `width:${progress * 100}%;`)
      this.progressBarBuffer.classList.toggle('indeterminate', progress !== 1)
    }

    /**
     * Set progress bar to indeterminate state
     */
    public unsetProgress () {
      this.progressBar.classList.add('indeterminate')
      this.progressBarBuffer.setAttribute('style', 'width:0;')
    }

    /**
     *
     * @returns
     */
    public getProgressContainer () {
      return this.progressBar
    }

    /**
     * Hide progress bar
     */
    public remove () {
      this.progressBar.remove()
    }
}
