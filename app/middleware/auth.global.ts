export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  const hasUser = !!authStore.user
  const isPublic = to.meta.isPublic === true // 로그인 & 비로그인 모두 접근 가능
  const isGuestOnly = to.meta.isGuestOnly === true // 비로그인만 접근 가능

  if (isGuestOnly) {
    if (hasUser) return navigateTo({ name: ROUTE_NAMES.HOME })
    return
  }

  if (isPublic) return

  if (!hasUser) return navigateTo({ name: ROUTE_NAMES.LOGIN })
})
