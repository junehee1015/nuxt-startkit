export default defineNuxtRouteMiddleware((to, _from) => {
  const authStore = useAuthStore()
  const isPublic = to.meta.requiresAuth === false
  const isAuthenticated = authStore.isAuthenticated

  if (!isPublic && !isAuthenticated) {
    return navigateTo({ name: ROUTE_NAMES.LOGIN })
  }

  if (isAuthenticated && to.name === ROUTE_NAMES.LOGIN) {
    return navigateTo({ name: ROUTE_NAMES.HOME })
  }
})
