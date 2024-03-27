<script setup>
import { ref } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
import { toDashedHash } from '../../tools/utils'
import { data as allPosts } from '../../tools/post.data.mjs'
import PostList from './PostList.vue'


const { theme } = useData()
const page = {
  size: theme.value.pageSize,
  total: Math.ceil(allPosts.length / theme.value.pageSize),
  cursor: ref(1)
}

const postList = ref([]);
postList.value = allPosts.slice(0, page.size)

function turnTo(n) {
  history.pushState(null, '', `#${toDashedHash(n.toString())}`)
  n = Math.min(n, page.total)
  page.cursor.value = n
  const start = (n - 1) * page.size
  postList.value = allPosts.slice(start, start + page.size)
}

function setPostListMinHeight() {
  const root = document.querySelector(':root');
  const h = Math.min(allPosts.length, theme.value.pageSize) * 2.9
  root.style.setProperty('--post-list-min-height', `${h}rem`)
}

function loadPage() {
  const defaultPage = parseInt(window.location.hash?.slice(1))
  page.cursor.value = defaultPage || 1
  turnTo(page.cursor.value)
}

onContentUpdated(() => {
  setPostListMinHeight()
  loadPage()
})
</script>

<template>
  <div class="min-h-[var(--post-list-min-height)]">
    <PostList :post-list="postList" />
  </div>

  <div class="flex items-center justify-center relative italic">
    <button
      v-if="page.cursor.value > 1"
      class="
        absolute
        left-0
        cursor-pointer
        font-bold
        italic
        text-[1rem]
        text-[var(--vp-c-text-1)
        hover:bg-yellow-300
      "
      @click="turnTo(page.cursor.value - 1)"
    >
      PREV
    </button>
    <div
      v-if="page.total > 1"
      class="digit text-base text-[var(--vp-c-text-3)]"
    >
      {{ `${page.cursor.value}/${page.total}` }}
    </div>
    <button
      v-if="page.cursor.value < page.total"
      class="
        absolute
        right-0
        cursor-pointer
        font-bold
        italic
        text-[1rem]
        text-[var(--vp-c-text-1)
        hover:bg-yellow-300
      "
      @click="turnTo(page.cursor.value + 1)"
    >
      NEXT
    </button>
  </div>
</template>
