import { createApp } from 'vue'

import router from '@/router'
import directives from '@/utils/directives'
import FollowList from '@/views/follow/FollowList.vue'

export function linkWebSocket() {
  const link = createApp(FollowList)
  link.use(router)
  link.directive('loading', directives['loading'])
  link.directive('disableEnter', directives['disableEnter'])
  link.mount(document.createElement('div'))
}
