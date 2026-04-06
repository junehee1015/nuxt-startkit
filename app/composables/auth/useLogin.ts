interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  email: string
  user: User
}

export const useLogin = () => {
  const config = useRuntimeConfig()

  const authStore = useAuthStore()

  const pending = ref(false)

  const login = async (loginPayload: LoginPayload) => {
    pending.value = true

    try {
      const response = await $fetch<LoginResponse>('/auth/login', {
        baseURL: config.public.mockUrl,
        method: 'POST',
        body: loginPayload
      })

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
