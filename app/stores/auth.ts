interface User {
  name: string
  email: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useCookie<string | null>('accessToken', { maxAge: 60 * 60 })
  const refreshToken = useCookie<string | null>('refreshToken', { maxAge: 60 * 60 * 24 * 7 })
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  const login = async (values: LoginPayload) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (values.email !== 'admin@example.com' || values.password !== '1234') {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
    }

    accessToken.value = 'mock-access-token-' + Date.now()
    refreshToken.value = 'mock-refresh-token-' + Date.now()

    user.value = {
      name: 'Juny Jo',
      email: values.email,
      role: 'Admin'
    }
  }

  const logout = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
  }

  const refreshAccessToken = async (): Promise<void> => {
    if (!refreshToken.value) throw new Error('No refresh token')

    try {
      // 실제 구현은 useRefreshApi(순수 instance)를 사용합니다.
      await new Promise(resolve => setTimeout(resolve, 300))
      accessToken.value = 'new-access-token-' + Date.now()
    } catch (error) {
      logout()
      throw error
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    refreshAccessToken,
    logout
  }
})
