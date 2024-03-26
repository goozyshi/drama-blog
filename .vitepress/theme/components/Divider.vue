<script setup>
  const props = defineProps({
    customClass: String,
  })
</script>
<template>
  <div :class="customClass"></div>
</template>

<style scoped>
  .circle {
    width: 0.2667rem;
    height: 0.2667rem;
    background-color: var(--vp-c-text-3);
    border-radius: 100%;
    vertical-align: middle;
  }
  .circle-sm {
    width: 0.16rem;
    height: 0.16rem;
    background-color: var(--vp-c-text-3);
    border-radius: 100%;
    vertical-align: middle;
  }
</style>