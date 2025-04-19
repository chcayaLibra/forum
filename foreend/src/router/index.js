import { useUserStore } from '@/stores'
import showPrompt from '@/utils/promptBox'
import { createRouter, createWebHistory } from 'vue-router'

// import.meta.env.BASE_URL vite中的环境变量
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/post',
      children: [
        {
          path: '/post',
          component: () => import('@/views/post/PostList.vue')
        },
        {
          path: '/post/:id',
          component: () => import('@/views/post/PostDetail.vue')
        },
        {
          path: '/publish',
          component: () => import('@/views/post/PostPublish.vue')
        },
        {
          path: '/chat',
          component: () => import('@/views/follow/FollowList.vue')
        },
        {
          path: '/follow/:id',
          component: () => import('@/views/follow/FollowDetail.vue'),
          props: true,
          meta: { unique: true }
        },
        {
          path: '/login',
          component: () => import('@/views/login/LoginPage.vue')
        },
        {
          path: '/user',
          component: () => import('@/views/user/UserPage.vue')
        },
        {
          path: '/user/edit',
          component: () => import('@/views/user/UserEdit.vue')
        },
        {
          path: '/setting',
          component: () => import('@/views/setting/SettingPage.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const useStore = useUserStore()
  if (
    !useStore.token &&
    to.path !== '/login' &&
    (to.path.startsWith('/follow') ||
      to.path.startsWith('/user') ||
      to.path.startsWith('/publish') ||
      to.path.startsWith('/chat'))
  )
    return { path: '/login', query: { redirect: to.path } }
  if (useStore.token && to.path === '/login') {
    showPrompt('您已登录，不要手动跳到登录页哦😊', 'error')
    return '/'
  }
  return true
})
export default router
