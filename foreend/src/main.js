import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import '@/assets/main.css'
import '@/assets/theme.css'
import directives from '@/utils/directives'

const app = createApp(App)

Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key])
})

app.use(pinia)
app.use(router)

app.mount('#app')
