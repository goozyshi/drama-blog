<script setup></script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="relative mx-auto mb-12 cursor-pointer">
      <img
        src="./assets/pro-figma.png"
        alt=""
        class="w-[30rem] hover:scale-95 transition-all duration-300"
      />
      <div
        class="text-center px-4 py-8 bg-white shadow-lg rounded-md w-4/5 md:w-4/4 mx-auto absolute left-0 right-0 -bottom-12"
      >
        <h3>react-figma</h3>
        <p class="text-sm text-gray-500">基于 figma 设计稿还原的网站</p>
        <div class="flex items-center justify-center gap-8">
          <a
            href="https://react-figma-landing-site.vercel.app/"
            class="font-bold text-brandPrimary hover:text-neutral-500"
          >
            Readmore
          </a>
        </div>
      </div>
    </div>
    <div class="relative mx-auto mb-12 cursor-pointer">
      <img
        src="./assets/pro-spotify.png"
        alt=""
        class="w-[30rem] hover:scale-95 transition-all duration-300"
      />
      <div
        class="text-center px-4 py-8 bg-white shadow-lg rounded-md w-4/5 mx-auto absolute left-0 right-0 -bottom-12"
      >
        <h3>mini-spotify</h3>
        <p class="text-sm text-gray-500">类 Spotify 音乐播放 Vue App</p>
        <div class="flex items-center justify-center gap-8">
          <a
            href="https://mini-spotify-orpin.vercel.app"
            class="font-bold text-brandPrimary hover:text-neutral-500"
          >
            Readmore
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
