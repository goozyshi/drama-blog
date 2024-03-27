<script setup>
import Giscus from '@giscus/vue'
import { onContentUpdated, useData } from 'vitepress'
import { ref } from 'vue'

const { isDark, theme } = useData()
const { giscusConfig } = theme.value

const getGiscusTheme = () => (isDark.value ? 'dark' : 'light')

const giscusOptions = ref({
  theme: getGiscusTheme(),
  show: false,
})

function reloadGiscus() {
  giscusOptions.value = {
    theme: getGiscusTheme(),
    show: false
  }
  setTimeout(() => {
    giscusOptions.value.show = true
  }, 1)
}

onContentUpdated(() => {
  reloadGiscus()
  const observer = new MutationObserver(reloadGiscus)
  const element = document.querySelector("button.VPSwitchAppearance")
  if (!element) return
  observer.observe(element, { attributes: true })
})
</script>

<template>
  <div class="grid gap-4 mt-6">
    <Giscus
      v-if="giscusOptions.show"
      repo="goozyshi/drama-blog"
      :repo-id="giscusConfig.repo_id"
      category="Announcements"
      :category-id="giscusConfig.category_id"
      mapping="title"
      strict="1"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="giscusOptions.theme"
      lang="en"
    />
  </div>
</template>
