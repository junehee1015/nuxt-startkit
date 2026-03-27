import { loginApi } from '~/api/auth'

export const useLogin = () => {
  const authStore = useAuthStore()

  const pending = ref(false)

  const login = async (loginPayload: LoginPayload) => {
    pending.value = true

    try {
      const response = await loginApi(loginPayload)
      authStore.setAuthData(response.accessToken, response.user)
    } finally {
      pending.value = false
    }
  }

  return {
    login,
    pending
  }
}
