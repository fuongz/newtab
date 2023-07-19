export default function useUI() {
  const keys: any = { 37: 1, 38: 1, 39: 1, 40: 1 }
  const supportsPassive = ref(false)

  const preventDefault = (e: any) => {
    e.preventDefault()
  }

  const preventDefaultForScrollKeys = (e: any) => {
    if (keys[e.keyCode]) {
      preventDefault(e)
      return false
    }
  }

  onMounted(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
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

  return {}
}
