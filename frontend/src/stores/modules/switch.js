import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSwitchStore = defineStore('switch', () => {
  const theme = ref(localStorage.getItem('theme') || '')
  const loading = ref(false)
  const hasMore = ref(true)
  const userPageToggle = ref(true)

  const setTheme = (value) => {
    theme.value = value
    localStorage.setItem('theme', theme.value)
  }

  const setLoading = (value) => {
    loading.value = value
  }

  const setHasMore = (value) => {
    hasMore.value = value
  }

  const setUserPageToggle = (value) => {
    userPageToggle.value = value
  }

  return {
    theme,
    loading,
    hasMore,
    userPageToggle,
    setTheme,
    setLoading,
    setHasMore,
    setUserPageToggle
  }
})
