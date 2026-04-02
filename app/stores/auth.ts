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

    const setAuthData = (token: string, userData = user.value) => {
      accessToken.value = token
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
      pick: ['user']
    }
  }
)
