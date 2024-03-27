<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const { nickname, bio } = theme.value;
import Avatar from "./Avatar.vue";
import Contact from "./Contact.vue";
</script>

<template>
  <Avatar />
  <div class="flex flex-col items-center text-center py-0 px-[15px]">
    <h2 class="flex items-center text-[1.7em] md:text-4xl font-medium">
      {{ nickname }}
    </h2>
    <p class="my-[1em] ml-[-0.5rem] text-[var(--vp-c-neutral)] whitespace-nowrap">
      <span>{{ bio }}</span>
    </p>
    <ClientOnly>
      <Contact />
    </ClientOnly>
  </div>
</template>

