<template>
  <Avatar />
  <div :class="$style.profile">
    <h1 :class="$style.nickname">
      {{ nickname }}
    </h1>
    <p :class="$style.bio">
      <span>{{ bio }}</span>
    </p>
    <ClientOnly>
      
    </ClientOnly>
  </div>
</template>

<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const { nickname, bio } = theme.value;
import Avatar from "./Avatar.vue";
import Divider from "./Divider.vue";
// import ProfileExtra from "./ProfileExtra.vue";
</script>

<style scoped module>
.profile {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  text-align: center;
}

.nickname {
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
}

.bio {
  margin: 1em 0;
  margin-left: -0.5rem;
  color: var(--vp-c-neutral);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .nickname {
    font-size: 1.7em;
  }
}
</style>
