<script setup>
import { baseURL } from '@/utils/request'
import { ref } from 'vue'

const url = ref()

const exitFullscreen = (e) => {
  if (e.target.tagName === 'IMG') return
  url.value = ''
}

const onFullScreen = (imgUrl) => {
  if (imgUrl) {
    url.value = imgUrl
  }
}

defineExpose({
  onFullScreen
})
</script>

<template>
  <div v-if="url" class="pic" @click="exitFullscreen">
    <img :src="baseURL + url" />
  </div>
</template>

<style scoped lang="scss">
.pic {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(61, 61, 61, 0.7);

  img {
    max-width: 80%;
    max-height: 80%;
    cursor: default;
  }

  cursor: pointer;
}
</style>
