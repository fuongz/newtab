<script setup lang="ts">
import useSWRV from 'swrv'
import { computed, reactive, ref } from 'vue'
import { fetcher } from '../logic/fetcher'

const props = defineProps(['status', 'data'])
const emit = defineEmits(['changeStatus', 'onSubmit'])

const fontFamilies: { label: string; value: string }[] = [
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
]

const isLoading = ref(false)
const formData: any = reactive({
  tagsData: '',
  fontFamily: '',
})

const { data: tags } = useSWRV('https://api.quotable.io/tags', fetcher, {
  revalidateOnFocus: false,
})

const status = computed({
  get() {
    return props.status
  },
  set(value) {
    emit('changeStatus', value)
  },
})

const handleOnSubmit = () => {
  isLoading.value = true
  emit('onSubmit', formData)
  setTimeout(() => {
    isLoading.value = false
  }, 10)
}

watch(props, (newVal) => {
  Object.keys(newVal.data).forEach((key: string) => {
    // eslint-disable-next-line antfu/if-newline
    if (typeof formData[key] !== 'undefined') formData[key] = newVal.data[key]
  })
})
</script>

<template>
  <div v-if="status === true" class="relative z-10 font-mono" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity" />
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-zinc-900 p-4">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 id="modal-title" class="text-base font-semibold leading-6 text-zinc-100">Settings</h3>
                <div v-if="tags">
                  <div class="form-control mt-4">
                    <label for="tags">Quote category:</label>
                    <select id="tags" v-model="formData.tagsData" name="tags">
                      <option value="" selected>Select category</option>
                      <option v-for="tag in tags" :key="tag._id" :value="tag.slug">
                        {{ tag.name }}
                      </option>
                    </select>
                  </div>

                  <div v-if="fontFamilies" class="form-control mt-4">
                    <label for="tags">Font Family:</label>
                    <select id="tags" v-model="formData.fontFamily" name="fontFamily">
                      <option value="" selected>Select font</option>
                      <option v-for="font in fontFamilies" :key="font.value" :value="font.value">
                        {{ font.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <div v-else class="text-zinc-500 italic">Loading...</div>
              </div>
            </div>
          </div>
          <div class="bg-zinc-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              :disabled="isLoading"
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200 transition hover:transition sm:ml-3 sm:w-auto"
              @click="handleOnSubmit()"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isLoading ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-zinc-900 hover:bg-zinc-700 hover:ring-zinc-700 transition hover:transition sm:mt-0 sm:w-auto"
              @click="status = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
