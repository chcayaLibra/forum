<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const prop = defineProps({
  keyPath: String
})
const container = ref(null)

const route = useRoute()

const restoreScrollPosition = () => {
  if (prop.keyPath === '/publish') {
    sessionStorage.setItem(prop.keyPath, 0)
  }
  if (prop.keyPath.startsWith('/post/')) {
    sessionStorage.setItem(prop.keyPath, 0)
  }

  nextTick(() => {
    const savePosition = sessionStorage.getItem(prop.keyPath)
    if (savePosition) {
      container.value.scrollTop = parseInt(savePosition)
    }
  })
}

watch(route, () => {
  restoreScrollPosition()
})

const saveScrollPosition = () => {
  if (
    prop.keyPath === '/post' ||
    prop.keyPath === '/user' ||
    prop.keyPath.startsWith('/follow/u') ||
    !prop.keyPath.startsWith('/chat')
  ) {
    sessionStorage.setItem(prop.keyPath, container.value.scrollTop)
  }
}
nextTick(() => {
  sessionStorage.setItem('/user', 0)
  sessionStorage.setItem('/post', 0)
})
</script>

<template>
  <div ref="container" @scrollend="saveScrollPosition">
    <slot></slot>
  </div>
</template>

<style></style>
