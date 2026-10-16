import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getErrorMessage } from '@/api/http-client'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginDto } from '@/types/auth'

const STORAGE_KEY = 'vue-lottery-auth'

interface StoredSession {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
}

function loadSession(): StoredSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as StoredSession
    }
  } catch {
    // пошкоджені дані — починаємо з порожньої сесії
  }
  return { user: null, accessToken: null, refreshToken: null }
}

export const useAuthStore = defineStore('auth', () => {
  const authService = ServiceProvider.getAuthService()
  const session = loadSession()

  const user = ref<AuthUser | null>(session.user)
  const accessToken = ref<string | null>(session.accessToken)
  const refreshToken = ref<string | null>(session.refreshToken)
  const isLoading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  )

  function persist(): void {
    const data: StoredSession = {
      user: user.value,
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  async function login(credentials: LoginDto): Promise<boolean> {
    isLoading.value = true
    error.value = ''
    try {
      const {
        accessToken: access,
        refreshToken: refresh,
        ...profile
      } = await authService.login(credentials)
      user.value = profile
      accessToken.value = access
      refreshToken.value = refresh
      persist()
      return true
    } catch (e) {
      error.value = getErrorMessage(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function refreshTokens(): Promise<boolean> {
    if (!refreshToken.value) {
      return false
    }
    try {
      const tokens = await authService.refresh(refreshToken.value)
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
      persist()
      return true
    } catch {
      return false
    }
  }

  function logout(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    error.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    fullName,
    login,
    refreshTokens,
    logout,
  }
})
