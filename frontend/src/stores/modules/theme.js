import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore(
  'currentTheme',
  () => {
    const theme = ref('')

    const setTheme = (value) => {
      theme.value = value
    }
    return {
      theme,
      setTheme
    }
  },
  {
    persist: true
  }
)
