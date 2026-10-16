import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export type LayoutName = 'default' | 'auth'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    layout?: LayoutName
  }
}

const APP_TITLE = 'Vue Lottery App'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Головна' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Про автора' },
    },
    {
      path: '/lottery',
      name: 'lottery',
      component: () => import('@/views/LotteryView.vue'),
      meta: { title: 'Лотерея' },
    },
    {
      path: '/users',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'users',
          component: () => import('@/views/UsersView.vue'),
          meta: { title: 'Користувачі' },
        },
        {
          path: 'new',
          name: 'user-create',
          component: () => import('@/views/UserCreateView.vue'),
          meta: { title: 'Новий користувач' },
        },
        {
          path: ':id(\\d+)',
          name: 'user-details',
          component: () => import('@/views/UserDetailsView.vue'),
          props: true,
          meta: { title: 'Профіль користувача' },
          children: [
            {
              path: 'edit',
              name: 'user-edit',
              component: () => import('@/views/UserEditView.vue'),
              props: true,
              meta: { title: 'Редагування користувача' },
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Вхід', layout: 'auth' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Сторінку не знайдено' },
    },
  ],
  scrollBehavior: (to, from, savedPosition) => {
    // при зміні лише query (пагінація, пошук) не стрибаємо нагору
    if (to.path === from.path) {
      return false
    }
    return savedPosition ?? { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // meta батьківського /users зливається в to.meta для всіх дочірніх маршрутів
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
})

export default router
