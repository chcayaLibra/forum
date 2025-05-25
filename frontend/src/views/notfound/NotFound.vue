<script setup>
import router from '@/router'
import { ref, onMounted, onUnmounted } from 'vue'

const count = ref(5)
const timer = ref(null)

onMounted(() => {
  timer.value = setInterval(() => {
    count.value--
    if (count.value === 0) {
      router.push('/')
      clearInterval(timer.value)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer.value)
  console.log('clear timer')
})
</script>

<template>
  <div class="container">
    <h1>404 NOT FOUND</h1>
    <p>Return to the homepage in {{ count }} seconds...</p>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
