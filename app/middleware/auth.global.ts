export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const { $refreshAccessToken } = useNuxtApp()

  if (!authStore.accessToken && authStore.user) {
    try {
      await $refreshAccessToken()
    } catch {
      authStore.clearAuthData()
      clearNuxtData()
    }
  }

  const isAuthenticated = !!authStore.accessToken // 토큰 보유 여부
  const isPublic = to.meta.isPublic === true // 로그인 & 비로그인 모두 접근 가능
  const isGuestOnly = to.meta.isGuestOnly === true // 비로그인만 접근 가능

  if (isGuestOnly) {
    if (isAuthenticated) return navigateTo({ name: ROUTE_NAMES.HOME })
    return
  }

  if (isPublic) return

  if (!isAuthenticated) return navigateTo({ name: ROUTE_NAMES.LOGIN })
})
