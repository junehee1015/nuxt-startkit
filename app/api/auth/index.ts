interface LoginPayload {
  email: string
  password: string
}

export const loginApi = (loginPayload: LoginPayload) => {
  const { $api } = useNuxtApp()
  return $api<{ accessToken: string, user: User }>('/auth/login', { method: 'POST', body: loginPayload })
}

export const logoutApi = () => {
  const { $api } = useNuxtApp()
  return $api('/auth/logout', { method: 'POST', credentials: 'include' })
}
