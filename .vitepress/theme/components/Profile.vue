<template>
  <Avatar />
  <div :class="$style.profile">
    <h1 :class="$style.nickname">
      {{ nickname }}
    </h1>
    <p :class="$style.bio">
      <Divider custom-class="circle align-middle inline-block m-2" />
      <span>{{ bio }}</span>
    </p>
    <ClientOnly>
      <iframe
        title="Spotify Embed: Recommendation Playlist "
        src="https://open.spotify.com/embed/playlist/3yvqKpNtZ5vRW7USHFuZec?utm_source=generator&theme=0"
        width="100%"
        height="100%"
        style="min-height: '360px'"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
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
