export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore()
  const { $refreshAccessToken } = useNuxtApp()

  if (!authStore.accessToken && authStore.user) {
    try {
      await $refreshAccessToken()
    } catch {
      authStore.clearAuthData()
      clearNuxtData()
      await nextTick()
      localStorage.removeItem('auth')
    }
  }

  const isAuthenticated = !!authStore.accessToken
  const isPublic = to.meta.isPublic === true

  if (!isAuthenticated && !isPublic) {
    return navigateTo({ name: ROUTE_NAMES.LOGIN })
  }

  if (isAuthenticated && to.name === ROUTE_NAMES.LOGIN) {
    return navigateTo({ name: ROUTE_NAMES.HOME })
  }
})
