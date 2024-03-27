<script setup>
import { useData, withBase } from "vitepress";
import { toDashedHash } from "../../tools/utils";
import Divider from "./Divider.vue";
const { frontmatter } = useData();
</script>
<template>
  <div
    v-if="frontmatter.category || frontmatter.tags?.length"
    class="border-t border-[var(--vp-c-divider)] text-[14px] p-0 pt-4 pb-6 "
  >
    <a
      v-if="frontmatter.category"
      :href="withBase(`/archives#${toDashedHash(frontmatter.category)}`)"
      class="inline-block rounded font-bold whitespace-nowrap py-px px-2 text-[var(--vp-c-neutral-inverse)] bg-[var(--vp-c-brand-2)] hover:bg-[var(--vp-c-neutral)]"
    >
      {{ frontmatter.category?.toUpperCase() }}
    </a>
    <Divider v-if="frontmatter.category && frontmatter.tags?.length" custom-class="circle inline-block my-[1px] mx-[0.7rem]"/>
    <a
      v-for="tag in frontmatter.tags"
      :key="tag"
      :href="withBase(`/tags#${toDashedHash(tag)}`)"
      class="
        inline-block
        rounded
        font-bold
        whitespace-nowrap
        leading-5
        border-2
        border-[var(--vp-c-brand-2)]
        py-px
        px-1.5
        mt-4
        mr-3
        text-[var(--vp-c-brand-2)]
        hover:text-[var(--vp-c-neutral-inverse)]
        hover:bg-[var(--vp-c-brand-2)]
      "
    >
      {{ tag }}
    </a>
  </div>
</template>
