export interface User {
  name: string
  email: string
  role: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref<string | null>(null)
    const user = ref<User | null>(null)

    const setAuthData = (token: string, userData?: User) => {
      accessToken.value = token

      if (userData)
        user.value = userData
    }

    const clearAuthData = () => {
      accessToken.value = null
      user.value = null
    }

    return {
      user,
      accessToken,
      setAuthData,
      clearAuthData
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
