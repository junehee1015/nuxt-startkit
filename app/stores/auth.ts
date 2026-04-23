export interface User {
  name: string
  email: string
  role: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    const setAuthData = (token: string, userData?: User) => {
      accessToken.value = token

      if (userData)
        user.value = userData
    }

    const clearAuthData = () => {
      accessToken.value = null
      user.value = null
    }

    const clearSession = () => {
      clearAuthData()
      clearNuxtData()
    }

    let logoutPromise: Promise<void> | null = null

    const logout = async () => {
      if (logoutPromise) return logoutPromise

      const nuxtApp = useNuxtApp()

      logoutPromise = (async () => {
        try {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
          })
        } catch {
          console.warn('Server logout failed.')
        } finally {
          clearSession()

          await nuxtApp.runWithContext(async () => {
            if (useRoute().path !== '/login') await navigateTo('/login', { replace: true })
          })

          logoutPromise = null
        }
      })()

      return logoutPromise
    }

    return {
      user,
      accessToken,
      setAuthData,
      clearSession,
      logout
    }
  }, {
    persist: {
      pick: ['user'],
      storage: piniaPluginPersistedstate.cookies({
        maxAge: 60 * 60 * 24, // 24시간 유지
        sameSite: 'lax',
        secure: import.meta.env.PROD
      })
    }
  }
)
