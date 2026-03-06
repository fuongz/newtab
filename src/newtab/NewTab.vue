<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import quotesData from '~/assets/quotes.json'
import useUI from '~/composables/useUI'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

interface Config {
  bgColor: string
  quoteFontFamily: string
  authorFontFamily: string
}

function getRandomQuote(quotes: { author: string, text: string }[]) {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

const quote = ref(getRandomQuote(quotesData as { author: string, text: string }[]))
const showSetting = ref(false)

const { data: config, dataReady } = useWebExtensionStorage<Config>('fuongz_just_random_quote', {
  bgColor: '#18181b',
  quoteFontFamily: 'playfair-display',
  authorFontFamily: 'montserrat',
}, { mergeDefaults: true })

// Local data
const colors = ['#fff', '#18181b', '#1e3a8a', '#312e81', '#166534', '#7f1d1d']
const fontFamilies: { label: string, value: string }[] = [
  { label: 'OS Default', value: 'sans' },
  { label: 'Playfair Display', value: 'playfair-display' },
  { label: 'Space Grotesk', value: 'space-grotesk' },
  { label: 'Montserrat', value: 'montserrat' },
  { label: 'Proza Libre', value: 'proza-libre' },
  { label: 'Rubik', value: 'rubik' },
  { label: 'Roboto', value: 'roboto' },
  { label: 'Oswald', value: 'oswald' },
  { label: 'DM Sans', value: 'dm-sans' },
  { label: 'Inter', value: 'inter' },
  { label: 'Numans', value: 'numans' },
  { label: 'Be Vietnam Pro', value: 'be-vietnam-pro' },
]

const fontGoogleMap: Record<string, string> = {
  'playfair-display': 'Playfair+Display:wght@500',
  'space-grotesk': 'Space+Grotesk:wght@400;500',
  'montserrat': 'Montserrat:wght@400;500;600',
  'proza-libre': 'Proza+Libre',
  'rubik': 'Rubik:wght@500',
  'roboto': 'Roboto',
  'oswald': 'Oswald:wght@400;500',
  'dm-sans': 'DM+Sans:wght@400;500',
  'inter': 'Inter:wght@500',
  'numans': 'Numans',
  'be-vietnam-pro': 'Be+Vietnam+Pro:wght@400;500',
}

const loadedFonts = new Set<string>()

function loadFont(fontValue: string) {
  if (fontValue === 'sans' || loadedFonts.has(fontValue) || !fontGoogleMap[fontValue]) return
  loadedFonts.add(fontValue)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${fontGoogleMap[fontValue]}&display=swap`
  document.head.appendChild(link)
}

// Refs
const dialogRef = ref<HTMLElement | null>(null)
const settingBtnRef = ref<HTMLElement | null>(null)
const customColor = ref('')
const isQuoteLoading = ref(false)
const isAuthorLoading = ref(false)

// Use UI
const { lightOrDark } = useUI()

const skeletonClass = computed(() =>
  lightOrDark(config.value.bgColor as string) === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300',
)

onClickOutside(dialogRef, () => {
  showSetting.value = false
}, { ignore: [settingBtnRef] })

function handleOpenQuickSetting() {
  showSetting.value = !showSetting.value
}

function fetchQuote() {
  quote.value = getRandomQuote(quotesData as { author: string, text: string }[])
}

function handleUpdateSetting(key: keyof Config, value: string) {
  if (key === 'quoteFontFamily') {
    loadFont(value)
    isQuoteLoading.value = true
    setTimeout(() => {
      isQuoteLoading.value = false
    }, 500)
  }
  else if (key === 'authorFontFamily') {
    loadFont(value)
    isAuthorLoading.value = true
    setTimeout(() => {
      isAuthorLoading.value = false
    }, 500)
  }
  config.value = { ...config.value, [key]: value }
}

function handleCustomColor(e: Event) {
  const value = (e.target as HTMLInputElement).value
  customColor.value = value
  handleUpdateSetting('bgColor', value)
}

onMounted(async () => {
  await dataReady
  loadFont(config.value.quoteFontFamily)
  loadFont(config.value.authorFontFamily)
  fetchQuote()
  if (config.value && !colors.includes(config.value.bgColor)) {
    customColor.value = config.value.bgColor
  }
})
</script>

<template>
  <main class="relative transition" :style="{ backgroundColor: config.bgColor }">
    <div class="text-white flex relative justify-center items-center h-screen overflow-hidden max-w-[1024px] mx-auto">
      <blockquote class="w-full">
        <template v-if="!quote || isQuoteLoading">
          <div class="animate-pulse space-y-3">
            <div class="h-10 rounded w-full" :class="skeletonClass" />
            <div class="h-10 rounded w-5/6" :class="skeletonClass" />
            <div class="h-10 rounded w-4/6" :class="skeletonClass" />
          </div>
        </template>
        <template v-else>
          <h1
            class="text-5xl leading-snug font-normal whitespace-break-spaces"
            :class="[`font-${config.quoteFontFamily}`, lightOrDark((config.bgColor as string)) === 'dark' ? 'text-white' : 'text-zinc-900']"
          >
            &ldquo;{{ quote.text }}&rdquo;
          </h1>
        </template>

        <template v-if="!quote || isAuthorLoading">
          <div class="animate-pulse mt-6">
            <div class="h-5 rounded w-32" :class="skeletonClass" />
          </div>
        </template>
        <template v-else>
          <h3 :class="[`font-${config.authorFontFamily}`, lightOrDark((config.bgColor as string)) === 'dark' ? 'text-zinc-300' : 'text-zinc-900']" class="mt-6 text-xl">
            - {{ quote.author }}
          </h3>
        </template>
      </blockquote>
    </div>

    <div class="absolute bottom-4 text-left left-4 flex gap-2">
      <div
        ref="settingBtnRef"
        :class="lightOrDark((config.bgColor as string)) === 'dark' ? 'text-zinc-200 hover:text-zinc-50 transition hover:transition' : 'text-zinc-900 hover:text-zinc-700 transition hover:transition'"
        class="transition hover:transition cursor-pointer"
        @click="handleOpenQuickSetting()"
      >
        <svg
          id="Settings"
          fill="currentColor"
          width="24px"
          height="24px"
          viewBox="0 -8 72 72"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          class="transition-transform duration-300"
          :class="showSetting ? 'rotate-90' : 'rotate-0'"
        >
          <path
            d="M56.74,20.89l-1-2.31c3.33-7.53,3.11-7.75,2.46-8.41L54,6l-.42-.35h-.49c-.26,0-1,0-7.51,2.93l-2.38-1C40.09,0,39.77,0,38.87,0h-6c-.9,0-1.25,0-4.1,7.66l-2.37,1C22,6.78,19.45,5.84,18.75,5.84l-.56,0-4.58,4.49c-.7.65-.94.88,2.58,8.3l-1,2.3c-7.79,3-7.79,3.3-7.79,4.23v5.89c0,.92,0,1.25,7.82,4l1,2.29c-3.33,7.53-3.11,7.76-2.46,8.41L18,50l.42.37h.5c.25,0,1,0,7.5-3l2.38,1C31.9,56,32.21,56,33.12,56h6c.92,0,1.25,0,4.11-7.66l2.39-1c4.37,1.85,6.93,2.79,7.61,2.79l.57,0,4.62-4.52c.66-.66.89-.89-2.62-8.28l1-2.3c7.81-3,7.81-3.33,7.81-4.23V24.93C64.57,24,64.57,23.68,56.74,20.89ZM36,37.8A9.8,9.8,0,1,1,46,28,9.91,9.91,0,0,1,36,37.8Z"
          />
        </svg>
      </div>
    </div>

    <Teleport to="#modal">
      <Transition name="pop" appear>
        <div v-if="showSetting" ref="dialogRef" role="dialog" class="transform-none absolute bottom-12 left-4 bg-zinc-200 rounded font-sans w-[300px]">
          <h3 class="font-semibold px-4 py-2 border-b border-zinc-300">Settings</h3>
          <div class="space-y-2 p-4">
            <div>
              <h4 class="mb-1 font-medium font-sans">Background Color</h4>
              <div class="flex flex-wrap gap-1">
                <div
                  v-for="vcolor in colors"
                  :key="`setting-color-${vcolor}`"
                  class="cursor-pointer transition hover:transition border-2 border-transparent p-0.5 rounded hover:border-zinc-300"
                  :class="config.bgColor === vcolor ? 'border-zinc-500' : ''"
                  @click="handleUpdateSetting('bgColor', vcolor)"
                >
                  <div class="w-4 h-4 rounded block" :style="{ backgroundColor: vcolor }" />
                </div>

                <!-- Custom color picker -->
                <div
                  class="cursor-pointer transition border-2 border-transparent p-0.5 rounded hover:border-zinc-300 relative"
                  :class="!colors.includes(config.bgColor) && config.bgColor ? 'border-zinc-500' : ''"
                >
                  <div
                    class="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold text-zinc-500"
                    :class="customColor ? '' : 'border border-dashed border-zinc-400'"
                    :style="customColor ? { backgroundColor: customColor } : {}"
                  >
                    <span v-if="!customColor">+</span>
                  </div>
                  <input
                    type="color"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    :value="customColor || config.bgColor"
                    @input="handleCustomColor"
                  >
                </div>
              </div>
            </div>

            <div>
              <div class="form-control mt-4">
                <h4 class="mb-1 font-medium font-sans">Quote font</h4>
                <div class="bg-zinc-100 rounded">
                  <select :value="config.quoteFontFamily" @change="(e: any) => handleUpdateSetting('quoteFontFamily', e.target.value)">
                    <option v-for="font in fontFamilies" :key="`quote-font-${font.value}`" :value="font.value">
                      {{ font.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div class="form-control mt-4">
                <h4 class="mb-1 font-medium font-sans">Author font</h4>
                <div class="bg-zinc-100 rounded">
                  <select :value="config.authorFontFamily" @change="(e: any) => handleUpdateSetting('authorFontFamily', e.target.value)">
                    <option v-for="font in fontFamilies" :key="`author-font-${font.value}`" :value="font.value">
                      {{ font.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="flex gap-4 absolute bottom-4 text-right right-4">
      <div :class="lightOrDark((config.bgColor as string)) === 'dark' ? 'text-zinc-300' : 'text-zinc-500'" class="text-[8px] font-mono">
        Made with ❤️ by <a href="https://github.com/fuongz" class="transition hover:transition hover:underline">fuongz</a>
      </div>
    </div>
  </main>
</template>
