import type { Placement } from '@popperjs/core'
import { createPopper } from '@popperjs/core'

export default function useUI() {
  const keys: any = { 37: 1, 38: 1, 39: 1, 40: 1 }
  const supportsPassive = ref(false)
  const placement = ref<Placement | undefined>('bottom')

  const preventDefault = (e: any) => {
    e.preventDefault()
  }

  const preventDefaultForScrollKeys = (e: any) => {
    if (keys[e.keyCode]) {
      preventDefault(e)
      return false
    }
  }

  const lightOrDark = (color: string | any) => {
    let r = null
    let g = null
    let b = null
    let hsp = null
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

      r = color[1]
      g = color[2]
      b = color[3]
      // eslint-disable-next-line @typescript-eslint/brace-style
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +`0x${color.slice(1).replace(color.length < 5 && /./g, '$&$&')}`

      r = color >> 16
      g = (color >> 8) & 255
      b = color & 255
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

    // Using the HSP value, determine whether the color is light or dark
    // eslint-disable-next-line antfu/if-newline
    if (hsp > 127.5) return 'light'
    else return 'dark'
  }

  function withPopper(dropdownList: any, component: any, { width }: any) {
    /**
     * We need to explicitly define the dropdown width since
     * it is usually inherited from the parent with CSS.
     */
    dropdownList.style.width = width

    /**
     * Here we position the dropdownList relative to the $refs.toggle Element.
     *
     * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
     * the dropdownList overlap by 1 pixel.
     *
     * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
     * wrapper so that we can set some styles for when the dropdown is placed
     * above.
     */
    const popper = createPopper(component.$refs.toggle, dropdownList, {
      placement: placement.value,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -1],
          },
        },
        {
          name: 'toggleClass',
          enabled: true,
          phase: 'write',
          fn({ state }) {
            component.$el.classList.toggle('drop-up', state.placement === 'top')
          },
        },
      ],
    })

    /**
     * To prevent memory leaks Popper needs to be destroyed.
     * If you return function, it will be called just before dropdown is removed from DOM.
     */
    return () => popper.destroy()
  }

  onMounted(async () => {
    try {
      ;(window as any).addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get() {
            supportsPassive.value = true
          },
          // eslint-disable-next-line @typescript-eslint/comma-dangle
        })
      )
      // eslint-disable-next-line @typescript-eslint/brace-style
    } catch (e) {}

    const wheelOpt = supportsPassive ? { passive: false } : false
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

    // call this to Disable
    window.addEventListener('DOMMouseScroll', preventDefault, false) // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt) // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt) // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false)
  })

  return {
    lightOrDark,
    withPopper,
  }
}
