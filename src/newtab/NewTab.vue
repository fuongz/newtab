<script setup lang="ts">
import { useStorageLocal } from '~/composables/useStorageLocal'
import useUI from '~/composables/useUI'
import { fetcher } from '~/logic/fetcher'

const data = ref<{ text: string; author: string } | null>(null)
const cached = useStorageLocal('fuongz_just_random_quote', JSON.stringify({}), {
  mergeDefaults: true,
})
const showSetting = ref(false)
const config = reactive<any>({
  bgColor: '#18181b',
  quoteFontFamily: 'playfair-display',
  authorFontFamily: 'montserrat',
})

// Local data
const colors = ['#fff', '#18181b', '#1e3a8a', '#312e81', '#166534', '#7f1d1d']
const fontFamilies: { label: string; value: string | null }[] = [
  {
    label: 'Playfair Display',
    value: 'playfair-display',
  },
  {
    label: 'Montserrat',
    value: 'montserrat',
  },
  {
    label: 'Proza Libre',
    value: 'proza-libre',
  },
  {
    label: 'Rubik',
    value: 'rubik',
  },
  {
    label: 'Roboto',
    value: 'roboto',
  },
  {
    label: 'Inter',
    value: 'inter',
  },
]

// Use UI
const { lightOrDark } = useUI()

function handleOpenQuickSetting() {
  showSetting.value = !showSetting.value
}

function getRandomQuote(quotes: { author: string; text: string }[]) {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

async function fetchQuote(_newVal: any = null) {
  const url = 'https://gist.githubusercontent.com/fuongz/dc7bdaffc9181e7ef0b176f1f025ab22/raw/0d62f619d5ff9457e8e9f710c9fdefd463a0ee7c/quotes.json'
  const res = await fetcher(url)
  if (res) data.value = getRandomQuote(res)
}

const cachedParsed: any = computed(() => {
  return JSON.parse(cached.value)
})

watch(cached, async (newVal, oldVal) => {
  if (oldVal === '{}' && newVal) {
    const data: any = JSON.parse(cached.value)
    Object.keys(data).forEach((key: any) => {
      config[key] = data[key]
    })
    await fetchQuote(cached.value)
  }
})

onMounted(async () => {
  setTimeout(async () => {
    if (cached.value === '{}') await fetchQuote()
  }, 1)
})

async function handleUpdateSetting(key: any, value: string) {
  const data = {
    ...cachedParsed.value,
    [key]: value,
  }
  if (data) config[key] = value
  if (data) cached.value = JSON.stringify(data)
}
</script>

<template>
  <main class="relative transition" :style="{ backgroundColor: config.bgColor }">
    <div class="text-white flex relative justify-center items-center h-screen overflow-hidden max-w-[1024px] mx-auto">
      <blockquote>
        <h1
          v-if="data"
          class="text-5xl leading-snug font-normal whitespace-break-spaces"
          :class="[`font-${config.quoteFontFamily}`, [lightOrDark((config.bgColor as string)) === 'dark' ? 'text-white' : 'text-zinc-900']]"
        >
          “ {{ data.text }} ”
        </h1>
        <h3 v-if="data" :class="[`font-${config.authorFontFamily}`, lightOrDark((config.bgColor as string)) === 'dark' ? 'text-zinc-300' : 'text-zinc-900']" class="mt-6 text-xl">
          - {{ data.author }}
        </h3>
      </blockquote>
    </div>

    <div class="absolute bottom-4 text-left left-4 flex gap-2">
      <div
        :class="lightOrDark((config.bgColor as string)) === 'dark' ? 'text-zinc-200 hover:text-zinc-50' : 'text-zinc-900 hover:text-zinc-700'"
        class="transition hover:transition cursor-pointer"
        @click="handleOpenQuickSetting()"
      >
        <svg id="Settings" fill="currentColor" width="24px" height="24px" viewBox="0 -8 72 72" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M56.74,20.89l-1-2.31c3.33-7.53,3.11-7.75,2.46-8.41L54,6l-.42-.35h-.49c-.26,0-1,0-7.51,2.93l-2.38-1C40.09,0,39.77,0,38.87,0h-6c-.9,0-1.25,0-4.1,7.66l-2.37,1C22,6.78,19.45,5.84,18.75,5.84l-.56,0-4.58,4.49c-.7.65-.94.88,2.58,8.3l-1,2.3c-7.79,3-7.79,3.3-7.79,4.23v5.89c0,.92,0,1.25,7.82,4l1,2.29c-3.33,7.53-3.11,7.76-2.46,8.41L18,50l.42.37h.5c.25,0,1,0,7.5-3l2.38,1C31.9,56,32.21,56,33.12,56h6c.92,0,1.25,0,4.11-7.66l2.39-1c4.37,1.85,6.93,2.79,7.61,2.79l.57,0,4.62-4.52c.66-.66.89-.89-2.62-8.28l1-2.3c7.81-3,7.81-3.33,7.81-4.23V24.93C64.57,24,64.57,23.68,56.74,20.89ZM36,37.8A9.8,9.8,0,1,1,46,28,9.91,9.91,0,0,1,36,37.8Z"
          />
        </svg>
      </div>
    </div>

    <Teleport to="#modal">
      <Transition name="pop" appear>
        <div v-if="showSetting" role="dialog" class="transform-none absolute bottom-12 left-4 bg-zinc-200 rounded font-montserrat w-[300px]">
          <h3 class="font-semibold px-4 py-2 border-b border-zinc-300">Setting</h3>
          <div class="space-y-2 p-4">
            <div>
              <h4 class="mb-1 font-medium font-montserrat">Background Color</h4>
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
              </div>
            </div>

            <div>
              <div v-if="fontFamilies" class="form-control mt-4">
                <h4 class="mb-1 font-medium font-montserrat">Quote font</h4>
                <div class="bg-zinc-100 rounded">
                  <select @change="(e: any) => handleUpdateSetting('quoteFontFamily', e.target.value)">
                    <option v-for="font in fontFamilies" :key="`quote-font-${font.value}`" :value="font.value">
                      {{ font.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div v-if="fontFamilies" class="form-control mt-4">
                <h4 class="mb-1 font-medium font-montserrat">Author font</h4>
                <div class="bg-zinc-100 rounded">
                  <select @change="(e: any) => handleUpdateSetting('authorFontFamily', e.target.value)">
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
      <div :class="lightOrDark((config.bgColor as string)) === 'dark' ? 'text-zinc-300' : 'text-zinc-500'" class="text-xs font-mono">
        Made with ❤️ by<a href="https://github.com/fuongz" class="transition hover:transition"> fuongz </a>
      </div>
    </div>
  </main>
</template>
