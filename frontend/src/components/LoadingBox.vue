<script setup>
import { useTemplateRef, onMounted, onUnmounted } from 'vue'

let loadingReset = null
const loadingRef = useTemplateRef('loading')
onMounted(() => {
  const animationDom = loadingRef.value.children
  loadingReset = setInterval(() => {
    for (let i = 0; i < animationDom.length; i++) {
      animationDom[i].classList.remove('animation')
      setTimeout(function () {
        animationDom[i].classList.add('animation')
      }, 10)
    }
    console.log(loadingReset)
  }, 6000)
})

onUnmounted(() => {
  clearInterval(loadingReset)
  console.log('clear')
})
</script>

<template>
  <div ref="loading" class="loading">
    <span class="animation">L</span>
    <span class="animation">o</span>
    <span class="animation">a</span>
    <span class="animation">d</span>
    <span class="animation">i</span>
    <span class="animation">n</span>
    <span class="animation">g</span>
    <span class="animation">.</span>
    <span class="animation">.</span>
    <span class="animation">.</span>
  </div>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  background-color: transparent;
  font-weight: bold;
  font-size: 12px;
  opacity: 1;
  transition: all 0.3s ease;
  pointer-events: none;

  & > * {
    color: var(--font-color);
  }

  $x: 0.5;
  $y: 0;
  @for $i from 1 through 10 {
    & .animation:nth-child(#{$i}) {
      animation: updown #{$x}s #{$y}s ease;
    }
    $y: $y + 0.5;
  }

  @keyframes updown {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>
