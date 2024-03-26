<script setup>
import { useData, withBase } from "vitepress";
import { toDashedHash } from "../../tools/utils";
import Divider from "./Divider.vue";
const { frontmatter } = useData();
</script>
<template>
  <div
    v-if="frontmatter.category || frontmatter.tags?.length"
    class="annotations"
  >
    <a
      v-if="frontmatter.category"
      :href="withBase(`/sorts#${toDashedHash(frontmatter.category)}`)"
      class="badge sort"
    >
      {{ frontmatter.category?.toUpperCase() }}
    </a>
    <Divider v-if="frontmatter.category && frontmatter.tags?.length" custom-class="circle inline-block my-[1px] mx-[0.7rem]"/>
    <a
      v-for="tag in frontmatter.tags"
      :key="tag"
      :href="withBase(`/tags#${toDashedHash(tag)}`)"
      class="badge tag"
    >
      {{ tag }}
    </a>
  </div>
</template>
<style scoped>
.annotations {
  border-top: 1px solid var(--vp-c-divider);
  padding: 1rem 0 1.5rem 0;
  font-size: 14px;
}

.badge {
  border-radius: 4px;
  display: inline-block;
  font-weight: bold;
  white-space: nowrap;
}

.sort {
  color: var(--vp-c-neutral-inverse);
  background-color: var(--vp-c-brand-2);
  padding: 1px 8px;
}

.sort:hover {
  background-color: var(--vp-c-neutral);
}

.dot {
  margin: 1px 0.7rem;
  display: inline-block;
}

.tag {
  color: var(--vp-c-brand-2);
  line-height: 20px;
  border: 2px solid var(--vp-c-brand-2);
  padding: 1px 5px;
  margin-top: 1rem;
  margin-right: 0.7rem;
}

.tag:hover {
  background-color: var(--vp-c-brand-2);
  color: var(--vp-c-neutral-inverse);
}
</style>
