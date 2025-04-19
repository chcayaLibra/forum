<script setup>
import router from '@/router'
import showPrompt from '@/utils/promptBox'
import { useUserStore, useThemeStore } from '@/stores'
import ToggleButton from '@/components/ToggleButton.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useTemplateRef } from 'vue'

const userStore = useUserStore()
const themeStore = useThemeStore()

const themeToggleRef = useTemplateRef('themeToggle')
const toggle = () => {
  themeToggleRef.value.themeToggle()
}

const btn = () => {
  showPrompt('你确定要退出登录吗', 'error', {
    time: 5000,
    event: 'exit',
    eventName: exitAccount
  })
}
const exitAccount = () => {
  localStorage.removeItem('user')
  router.go(0)
}
</script>

<template>
  <div class="setting">
    <h3>个人设置</h3>
    <button v-if="userStore.userId" @click="btn">退出登录</button>
    <h3>系统设置</h3>
    <div class="theme">
      <span>主题切换</span>
      <ThemeToggle style="display: none" ref="themeToggle"></ThemeToggle>
      <toggle-button
        :theme="themeStore.theme"
        @event="toggle"
        class="theme-btn"
      >
        <template #first>浅色主题</template>
        <template #second>深色主题</template>
      </toggle-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.setting {
  display: flex;
  flex-direction: column;
  gap: $main-gap;
  button {
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    border-radius: calc($main-gap / 2);
    transition: all 0.3s ease;
    background-color: var(--postcard-btn-color);
    cursor: pointer;

    &:hover {
      background-color: var(--postcard-btn-hover-color);
    }
  }

  .theme {
    display: flex;
    align-items: center;
    .theme-btn {
      margin-left: auto;
      width: 200px;
    }
  }
}
</style>
