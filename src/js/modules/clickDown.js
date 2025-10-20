export const clickDownUi = (dropDownElement, matches = false) => {
  const dropDown = dropDownElement
  const button = dropDown.querySelector('[aria-expanded][aria-controls]')
  const id = button.getAttribute('aria-controls')
  const dropDownTarget = document.getElementById(id)

  const getState = () => button.getAttribute('aria-expanded')

  const onHide = () => {
    button.setAttribute('aria-expanded', 'false')
    dropDownTarget.setAttribute('aria-hidden', 'true')
    dropDown.classList.remove('is-show')
    document.documentElement.classList.remove('js-show-dropdown')
  }

  const onShow = () => {
    button.setAttribute('aria-expanded', 'true')
    dropDownTarget.setAttribute('aria-hidden', 'false')
    dropDown.classList.add('is-show')
    document.documentElement.classList.add('js-show-dropdown')
  }

  const onKeydownEsc = (event) => {
    if (getState() !== 'true' || event.key !== 'Escape') {
      return
    }
    event.preventDefault()
    button.focus()
    onHide()
  }

  const onClickOutside = (event) => {
    if (getState() === 'true' && !dropDown.contains(event.target)) {
      onHide()
    }
  }

  if (!matches) {
    onHide()
    dropDown.addEventListener('mouseleave', onHide, false)

    button.addEventListener(
      'click',
      (event) => {
        event.stopPropagation()
        getState() === 'true' ? onHide() : onShow()
      },
      true,
    )

    dropDown.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && !event.shiftKey) {
        const focusableElements = dropDown.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const lastFocusableElement = focusableElements[focusableElements.length - 1]
        if (document.activeElement === lastFocusableElement) {
          onHide()
        }
      }
    })

    window.addEventListener('keydown', onKeydownEsc, false)
    document.addEventListener('click', onClickOutside, false)
  } else {
    onShow()
    dropDown.removeEventListener('mouseleave', onHide, false)
    window.removeEventListener('keydown', onKeydownEsc, false)
    document.removeEventListener('click', onClickOutside, false)
  }
}
