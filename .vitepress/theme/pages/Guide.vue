<script setup>
  import CategoryCard from "../components/CategoryCard.vue";
  import { SITE_DATA } from '../../tools/sitedata'
  console.log(SITE_DATA)
</script>
<template>
  <div class="w-full">
    <h1>Sites Included</h1>
    <div v-for="cate in SITE_DATA" :key="cate.title">
      <h2>{{ cate.title }}</h2>
      <div class="grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        <CategoryCard
          v-for="item in cate.items"
          :key="item.title"
          :category="item.title"
          :desc="item.desc"
          :link="item.link"
          :image="item.icon"
        />
      </div>
    </div>
  </div>
</template>