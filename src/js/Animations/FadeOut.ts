// Creates fade out animation on element
class FadeOut {
  animationThread: any;
  animationTimeStep: number;
  canceled: boolean;
  element: any;
  constructor () {
    this.animationThread = null

    this.animationTimeStep = 100
  }

  animate (element, onAnimationSuccess) {
    clearInterval(this.animationThread)
    this.canceled = false
    this.element = element
    this.element.classList.remove('website-translator-animations-fade-out')
    this.element.style.animation = 'none'
    this.element.classList.add('website-translator-animations-fade-out')

    let animationEnd = false
    this.element.addEventListener('transitionend', () => {
      animationEnd = true
    })
    this.animationThread = setInterval(() => {
      if (this.canceled) {
        this.element.classList.remove('website-translator-animations-fade-out')
        clearInterval(this.animationThread)
      }
      else if (animationEnd) {
        clearInterval(this.animationThread)
        onAnimationSuccess()
        this.element.classList.remove('website-translator-animations-fade-out')
      }
    }, this.animationTimeStep)
  }

  reset () {
    this.canceled = true
  }
}

export default FadeOut
