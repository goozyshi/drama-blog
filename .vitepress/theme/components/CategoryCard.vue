<script setup>
  import { ref } from 'vue'
  import uniqolor from 'uniqolor'
  let rainbowColor = ref('')
  rainbowColor.value = uniqolor.random({
    saturation: 80,
    lightness: [70, 80],
  })

  const props = defineProps({
    category: String,
    desc: String,
    link: String,
    image: String,
  })

  const { category, image, desc } = props
</script>

<template>
  <div
    v-if="rainbowColor.color"
    :style="`background-color: ${rainbowColor.color};`"
    class="
      hover:brightness-[1]
      contrast-2
      rounded-xl
      brightness-[0.88]
      relative
      cursor-pointer
      overflow-hidden
      aspect-[4/1] md:aspect-square
    "
  >
  <a class="!no-underline !hover:underline" :href="link" target="_blank">
    <div class="text-white pt-3 pl-4 font-semibold text-[23px]">{{ category }}</div>
    <div class="text-gray-50 px-4 text-[12px]">{{ desc }}</div>
    <img
      class="
        absolute
        contrast-[0.67]
        -right-3.5
        bottom-0
        z-[-1]
        max-w-[88px]
        rotate-[15deg]
      "
      :src="image || ''"
    />
  </a>
  </div>
</template>