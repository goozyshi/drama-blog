<script setup>
import { toDashedHash } from '../../tools/utils'
defineProps({
  text: {
    type: String,
    default: ''
  },
  number: {
    type: Number,
    default: 0
  },
  selected: {
    type: Boolean,
    default: false
  },
  link: {
    type: Boolean,
    defaul: false
  }
})
</script>
<template>
  <a
    :href="link ? `#${toDashedHash(text)}` : ''"
    :class="[
      selected && 'active',
      link && 'link',
      'inline-block rounded overflow-hidden !mb-2 text-[var(--vp-c-brand-soft)] shadow-none'
    ]"
  >
    <div class="m-0 bg-[var(--vp-c-default-soft)] text-sm">
      <span class="m-0 p-0 px-2.5">{{ text }}</span>
      <span
        class="
          digit
          inline-block
          py-px
          px-2.5
          m-0
          text-[var(--vp-c-brand-3)]
          bg-[var(--vp-c-default-soft)]
        "
      >
        {{ number }}
      </span>
    </div>
  </a>
</template>
<style scoped>
.link {
  margin: 0 0.5rem;
}

.link:hover,
a.active {
  color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-2);
  background-color: var(--vp-c-default-soft);
}

.link:hover .digit,
a.active .digit {
  color: var(--vp-c-default-3);
  background-color: var(--vp-c-brand-2);
}
</style>

