<script setup>
import { ref, watchEffect, nextTick } from 'vue'
import { useSwitchStore } from '@/stores'

const switchStore = useSwitchStore()

const match = window.matchMedia('(prefers-color-scheme: dark)')
const isDarkMode = () => {
  return window.matchMedia && match.matches
}

const toggle = ref()

/**
 * @param arr 按钮数组
 * @param state 浅/深状态
 */
const toggleBtn = (arr, state) => {
  if (state === 'dark') {
    toggle.value.title = '切换浅色模式'
    arr[0].classList.remove('active')
    arr[1].classList.add('active')
  } else {
    toggle.value.title = '切换深色模式'
    arr[0].classList.add('active')
    arr[1].classList.remove('active')
  }
}

const setThemeDefault = () => {
  const btn = document.querySelectorAll('.theme-btn')
  const dataset = document.body.dataset

  if (switchStore.theme) {
    dataset.theme = switchStore.theme
    toggleBtn(btn, dataset.theme)
    return
  }

  if (isDarkMode()) {
    dataset.theme = 'dark'
    switchStore.setTheme('dark')
    toggleBtn(btn, dataset.theme)
  } else {
    dataset.theme = 'light'
    switchStore.setTheme('light')
    toggleBtn(btn, dataset.theme)
  }
}

watchEffect(() => {
  nextTick(() => {
    setThemeDefault()
  })
  match.addEventListener('change', () => {
    isDarkMode()
    setThemeDefault()
  })
})

const themeToggle = () => {
  const btn = document.querySelectorAll('.theme-btn')
  const dataset = document.body.dataset
  if (dataset.theme === 'light') {
    dataset.theme = 'dark'
    switchStore.setTheme('dark')
    toggleBtn(btn, dataset.theme)
  } else {
    dataset.theme = 'light'
    switchStore.setTheme('light')
    toggleBtn(btn, dataset.theme)
  }
}

defineExpose({
  themeToggle
})
</script>

<template>
  <div ref="toggle" class="icon" title="切换深色模式">
    <svg
      class="theme-btn active"
      @click="themeToggle"
      t="1742024128220"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="8863"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="32"
      height="32"
    >
      <path
        d="M512 768c-141.376 0-256-114.624-256-256s114.624-256 256-256 256 114.624 256 256-114.624 256-256 256z m0-85.333333a170.666667 170.666667 0 1 0 0-341.333334 170.666667 170.666667 0 0 0 0 341.333334zM469.333333 85.333333a42.666667 42.666667 0 1 1 85.333334 0v85.333334a42.666667 42.666667 0 1 1-85.333334 0V85.333333z m0 768a42.666667 42.666667 0 1 1 85.333334 0v85.333334a42.666667 42.666667 0 1 1-85.333334 0v-85.333334zM85.333333 554.666667a42.666667 42.666667 0 1 1 0-85.333334h85.333334a42.666667 42.666667 0 1 1 0 85.333334H85.333333z m768 0a42.666667 42.666667 0 1 1 0-85.333334h85.333334a42.666667 42.666667 0 1 1 0 85.333334h-85.333334zM161.834667 222.165333a42.666667 42.666667 0 0 1 60.330666-60.330666l64 64a42.666667 42.666667 0 0 1-60.330666 60.330666l-64-64z m576 576a42.666667 42.666667 0 0 1 60.330666-60.330666l64 64a42.666667 42.666667 0 0 1-60.330666 60.330666l-64-64z m-515.669334 64a42.666667 42.666667 0 0 1-60.330666-60.330666l64-64a42.666667 42.666667 0 0 1 60.330666 60.330666l-64 64z m576-576a42.666667 42.666667 0 0 1-60.330666-60.330666l64-64a42.666667 42.666667 0 0 1 60.330666 60.330666l-64 64z"
        p-id="8864"
      ></path>
    </svg>
    <svg
      @click="themeToggle"
      t="1742024143774"
      class="theme-btn"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="9850"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="32"
      height="32"
    >
      <path
        d="M516.266667 938.666667h-38.4c-234.666667-21.333333-405.333333-230.4-384-465.066667 17.066667-204.8 179.2-366.933333 384-384 17.066667 0 34.133333 8.533333 42.666666 21.333333 8.533333 12.8 8.533333 34.133333-4.266666 46.933334-85.333333 115.2-59.733333 273.066667 55.466666 358.4 89.6 68.266667 213.333333 68.266667 302.933334 0 12.8-8.533333 29.866667-12.8 46.933333-4.266667 12.8 8.533333 21.333333 25.6 21.333333 42.666667-8.533333 115.2-64 217.6-153.6 290.133333-81.066667 59.733333-174.933333 93.866667-273.066666 93.866667zM396.8 187.733333c-123.733333 42.666667-213.333333 153.6-221.866667 290.133334-17.066667 187.733333 119.466667 354.133333 307.2 371.2 89.6 8.533333 179.2-17.066667 247.466667-76.8 46.933333-38.4 81.066667-89.6 102.4-145.066667-106.666667 38.4-226.133333 21.333333-320-46.933333-119.466667-93.866667-166.4-251.733333-115.2-392.533334z"
        p-id="9851"
      ></path>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.icon {
  .active {
    display: block;
  }

  svg {
    fill: var(--font-color);
    display: none;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      filter: drop-shadow(0 0 0.8px var(--font-color));
    }
  }
}
</style>
