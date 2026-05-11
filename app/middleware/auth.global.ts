export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (import.meta.server) {
    const accessToken = useCookie('accessToken')
    const refreshToken = useCookie('refreshToken')
    const userCookie = useCookie('auth')

    if ((!accessToken.value && !refreshToken.value) || !userCookie.value) {
      authStore.user = null
      accessToken.value = null
      refreshToken.value = null
      userCookie.value = null
      clearNuxtData()
    }

    if (userCookie.value) {
      authStore.user = typeof userCookie.value === 'string'
        ? JSON.parse(decodeURIComponent(userCookie.value))
        : userCookie.value
    } else {
      authStore.user = null
      accessToken.value = null
      refreshToken.value = null
      userCookie.value = null
      clearNuxtData()
    }

    if (!accessToken.value && refreshToken.value && authStore.user) {
      try {
        // const headers = useRequestHeaders(['cookie']) as Record<string, string>
        // await $fetch('/api/refresh', { method: 'POST', headers })
        await new Promise(resolve => setTimeout(resolve, 500))
        accessToken.value = 'mock-new-access-token-' + Date.now()
      } catch {
        authStore.user = null
        accessToken.value = null
        refreshToken.value = null
        userCookie.value = null
        clearNuxtData()
      }
    }
  }

  const hasUser = !!authStore.user
  const isPublic = to.meta.isPublic === true // 로그인 & 비로그인 모두 접근 가능
  const isGuestOnly = to.meta.isGuestOnly === true // 비로그인만 접근 가능

  if (isGuestOnly) {
    if (hasUser) return navigateTo({ name: ROUTE_NAMES.HOME })
    return
  }

  if (isPublic) return

  if (!hasUser) return navigateTo({ name: ROUTE_NAMES.LOGIN, replace: true })
})
