import './assets/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setAuthHandlers } from './api/http-client'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())

const auth = useAuthStore()

setAuthHandlers({
  getAccessToken: () => auth.accessToken,
  refresh: () => auth.refreshTokens(),
  onUnauthorized: () => {
    // refresh-токен теж недійсний — завершуємо сесію
    auth.logout()
    void router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  },
})

app.use(router)

// чекаємо першу навігацію, щоб одразу показати правильний layout
void router.isReady().then(() => app.mount('#app'))
