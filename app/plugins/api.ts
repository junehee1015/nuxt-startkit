import type { FetchError } from 'ofetch'

type FetchRequest = Parameters<typeof $fetch>[0]
type FetchOptions = Parameters<typeof $fetch>[1]

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  let refreshPromise: Promise<void> | null = null

  const _apiInstance = $fetch.create({
    baseURL: config.public.api as string,
    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
      }
    }
  })

  const refreshAccessToken = async () => {
    try {
      const { accessToken } = await $fetch<{ accessToken: string }>('/api/auth/refresh', {
        method: 'POST'
      })
      authStore.accessToken = accessToken
    } finally {
      refreshPromise = null
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API failed, but forcing local logout', error)
    } finally {
      authStore.clearAuthData()
      await nuxtApp.runWithContext(async () => {
        const route = useRoute()
        if (route.path !== '/login') {
          await navigateTo('/login', { replace: true })
        }
      })
    }
  }

  const api = async <T = unknown>(request: FetchRequest, options?: FetchOptions): Promise<T> => {
    try {
      return await _apiInstance<T>(request, options)
    } catch (e: unknown) {
      const error = e as FetchError

      const requestUrl = request instanceof Request ? request.url : request.toString()
      const isAuthPath = requestUrl.includes('/login') || requestUrl.includes('/refresh')

      if (error.response?.status === 401 && !isAuthPath) {
        if (import.meta.server) throw error

        if (!refreshPromise) refreshPromise = refreshAccessToken()

        try {
          await refreshPromise
          return await _apiInstance<T>(request, options)
        } catch (refreshError) {
          await logout()

          throw refreshError
        }
      }

      throw error
    }
  }

  return {
    provide: {
      api
    }
  }
})
