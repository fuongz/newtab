<script setup lang="ts">
import { useStorageLocal } from '~/composables/useStorageLocal'
import { fetcher } from '~/logic/fetcher'
const keys: any = { 37: 1, 38: 1, 39: 1, 40: 1 }
const supportsPassive = ref(false)
const modalSettingStatus = ref(false)
const data = ref<{ content: string; author: string } | null>(null)
const cached = useStorageLocal('fuongz_just_random_quote', JSON.stringify({}), {
  mergeDefaults: true,
})

const preventDefault = (e: any) => {
  e.preventDefault()
}

const preventDefaultForScrollKeys = (e: any) => {
  if (keys[e.keyCode]) {
    preventDefault(e)
    return false
  }
}

const handleOpenSetting = () => {
  modalSettingStatus.value = true
}

const fetchQuote = async (newVal: any) => {
  let url = 'https://api.quotable.io/random'
  if (newVal) {
    const cachedParsed = JSON.parse(newVal)
    // eslint-disable-next-line antfu/if-newline
    if (cachedParsed && cachedParsed.tagsData) url = `${url}?=${cachedParsed.tagsData}`
  }
  const res = await fetcher(url)

  // eslint-disable-next-line antfu/if-newline
  if (res) data.value = res
}

const handleOnSubmit = async (rawData: string) => {
  modalSettingStatus.value = false
  cached.value = rawData
  await fetchQuote(rawData)
}

const handleChangeStatus = () => {
  modalSettingStatus.value = false
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

watchEffect(async () => {
  setTimeout(async () => {
    await fetchQuote(cached.value)
  }, 10)
})
</script>

<template>
  <main class="bg-zinc-900 relative">
    <div class="text-white flex relative justify-center items-center h-screen overflow-hidden max-w-[1000px] mx-auto">
      <blockquote>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <h1 v-if="data" class="text-5xl leading-snug font-semibold">“ {{ data.content }} ”</h1>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <h3 v-if="data" class="mt-6 text-3xl text-zinc-500 italic font-serif">- {{ data.author }}</h3>
      </blockquote>
    </div>

    <div class="absolute bottom-4 text-left left-4" @click="handleOpenSetting()">
      <div class="text-zinc-500 hover:text-zinc-300 transition hover:transition cursor-pointer">
        <svg id="Settings" fill="currentColor" width="24px" height="24px" viewBox="0 -8 72 72" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M56.74,20.89l-1-2.31c3.33-7.53,3.11-7.75,2.46-8.41L54,6l-.42-.35h-.49c-.26,0-1,0-7.51,2.93l-2.38-1C40.09,0,39.77,0,38.87,0h-6c-.9,0-1.25,0-4.1,7.66l-2.37,1C22,6.78,19.45,5.84,18.75,5.84l-.56,0-4.58,4.49c-.7.65-.94.88,2.58,8.3l-1,2.3c-7.79,3-7.79,3.3-7.79,4.23v5.89c0,.92,0,1.25,7.82,4l1,2.29c-3.33,7.53-3.11,7.76-2.46,8.41L18,50l.42.37h.5c.25,0,1,0,7.5-3l2.38,1C31.9,56,32.21,56,33.12,56h6c.92,0,1.25,0,4.11-7.66l2.39-1c4.37,1.85,6.93,2.79,7.61,2.79l.57,0,4.62-4.52c.66-.66.89-.89-2.62-8.28l1-2.3c7.81-3,7.81-3.33,7.81-4.23V24.93C64.57,24,64.57,23.68,56.74,20.89ZM36,37.8A9.8,9.8,0,1,1,46,28,9.91,9.91,0,0,1,36,37.8Z"
          />
        </svg>
      </div>
    </div>

    <div class="absolute bottom-4 text-right right-4">
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <div class="text-sm text-zinc-500 font-mono">Made with ❤️ by<a href="https://github.com/fuongz" class="hover:text-zinc-300 text-zinc-400 transition hover:transition"> fuongz</a></div>
      <div class="text-sm text-zinc-500 font-mono mt-2">
        Quotes by<a href="https://github.com/lukePeavey/quotable" class="hover:text-zinc-300 text-zinc-400 transition hover:transition"> lukePeavey/quotable</a>
      </div>
    </div>
  </main>

  <!-- eslint-disable-next-line vue/v-on-event-hyphenation -->
  <SettingModal :status="modalSettingStatus" @change-status="handleChangeStatus" @on-submit="handleOnSubmit" />
</template>
