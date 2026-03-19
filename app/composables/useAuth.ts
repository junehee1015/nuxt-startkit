export const useAuth = () => {
  const authStore = useAuthStore()

  const login = async (values: LoginPayload) => {
    try {
      const response = await $fetch<{ accessToken: string, user: User }>('/api/auth/login', { method: 'POST', body: values })
      authStore.setAuthData(response.accessToken, response.user)
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    authStore.clearAuthData()
  }

  return { login, logout }
}
