export interface User {
  name: string
  email: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useCookie<string | null>('accessToken', {
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  const setAuthData = (token: string, userData: User) => {
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
    isAuthenticated,
    setAuthData,
    clearAuthData
  }
})
