<script setup lang="ts">
import useSWRV from 'swrv'

const fetcher = (key: string) =>
  fetch(key)
    .then((resp) => {
      return resp && resp.json()
    })
    .then((data) => {
      // eslint-disable-next-line antfu/if-newline
      if (data.message) throw new Error(data.message)
      return data
    })

const { data } = useSWRV('https://api.quotable.io/random', fetcher, {
  revalidateOnFocus: false,
})
</script>

<template>
  <main class="bg-zinc-900">
    <div class="text-white flex justify-center items-center h-screen overflow-hidden max-w-[1000px] mx-auto">
      <blockquote>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <h1 v-if="data" class="text-5xl leading-snug font-semibold">“ {{ data.content }} ”</h1>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <h3 v-if="data" class="mt-6 text-3xl text-zinc-500 italic font-serif">- {{ data.author }}</h3>
      </blockquote>
    </div>
  </main>
</template>
