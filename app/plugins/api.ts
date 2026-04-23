export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: '/api',
    credentials: 'include',
    onRequest({ options }) {
      if (import.meta.server) {
        const headers = useRequestHeaders(['cookie'])

        if (headers.cookie) {
          options.headers = new Headers(options.headers)
          options.headers.set('cookie', headers.cookie)
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const authStore = useAuthStore()
        const nuxtApp = useNuxtApp()

        authStore.clearSession()
        nuxtApp.runWithContext(async () => {
          if (useRoute().path !== '/login') await navigateTo('/login', { replace: true })
        })
      }
    }
  })

  return { provide: { api } }
})
