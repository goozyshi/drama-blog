<script setup>
import { useData } from 'vitepress'
const { theme } = useData()
</script>

<template>
  <div class="
      flex
      items-center
      justify-center
      p-0
      pb-6
      md:py-8
    "
  >
    <img
      :src="theme.avatar"
      class="
        border-2
        border-solid
        border-[--ct-avatar-border]
        rounded-full
        w-[var(--ct-avatar-small)]
        h-[var(--ct-avatar-small)]
        md:w-[var(--ct-avatar-medium)]
        md:h-[var(--ct-avatar-medium)]
      "
    >
  </div>
</template>

