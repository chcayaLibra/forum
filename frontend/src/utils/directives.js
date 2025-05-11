const directives = {
  loading: {
    mounted(el) {
      const lightStyle = `
        rgba(0, 0, 0, 0.5) 30%,
        rgba(0, 0, 0, 0.9) 50%,
        rgba(0, 0, 0, 0.5) 70%
      `
      const darkStyle = `
        rgba(255, 255, 255, 0.5) 30%,
        rgba(255, 255, 255, 0.9) 50%,
        rgba(255, 255, 255, 0.5) 70%
      `
      const dataset = document.body.dataset

      el.style.background = 'var(--loading-bg-color)'
      if (dataset.theme === 'light') {
        el.style.mask = `linear-gradient(-45deg,${lightStyle})`
      } else {
        el.style.mask = `linear-gradient(-45deg,${darkStyle})`
      }

      el.style.maskSize = '300% 300%'
      el.style.webkitMaskSize = '300% 300%'

      const animation = el.animate(
        [
          {
            maskPosition: '0% 0%',
            webkitMaskPosition: '0% 0%'
          },
          {
            maskPosition: '100% 100%',
            webkitMaskPosition: '100% 100%'
          }
        ],
        {
          duration: 2000,
          easing: 'linear',
          iterations: Infinity
        }
      )

      el.addEventListener('load', () => {
        el.style.mask = ''
        el.style.webkitMask = ''
        el.style.maskSize = ''
        el.style.webkitMaskSize = ''
        animation.cancel()
      })
    }
  },

  disableEnter: {
    mounted(el) {
      el.addEventListener('keydown', (event) => {
        if (
          event.key === 'Enter' &&
          !event.shiftKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.metaKey
        ) {
          event.preventDefault()
        }
      })
    }
  }
}

export default directives
