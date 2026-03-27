import type { FetchError } from 'ofetch'

type FetchRequest = Parameters<typeof $fetch>[0]
type FetchOptions = Parameters<typeof $fetch>[1]

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  let refreshPromise: Promise<void> | null = null
  let logoutPromise: Promise<void> | null = null

  const ssrCookie = useRequestHeaders(['cookie']).cookie

  const refreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      const headers = new Headers()

      if (import.meta.server && ssrCookie) {
        headers.set('cookie', ssrCookie)
      }

      try {
        const response = await $fetch<{ accessToken: string }>('/auth/refresh', {
          // baseURL: config.public.apiUrl as string,
          baseURL: config.public.mockUrl as string, // Mock URL
          method: 'POST',
          credentials: 'include',
          headers
        })

        authStore.setAuthData(response.accessToken)
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  const logout = async () => {
    if (logoutPromise) return logoutPromise

    logoutPromise = (async () => {
      try {
        await api('/auth/logout', { method: 'POST', credentials: 'include' })
      } catch (error) {
        console.error('Logout API failed, but forcing local logout', error)
      } finally {
        authStore.clearAuthData()
      }
    })()

    return logoutPromise
  }

  const redirectToLogin = async () => {
    try {
      await nuxtApp.runWithContext(async () => {
        if (useRoute().path !== '/login') await navigateTo('/login', { replace: true })
      })
    } catch {
      location.href = '/login'
    }
  }

  const _api = $fetch.create({
    // baseURL: config.public.apiUrl as string,
    baseURL: config.public.mockUrl as string, // Mock URL
    onRequest({ options }) {
      if (import.meta.server && ssrCookie) {
        options.headers = new Headers(options.headers)
        options.headers.set('cookie', ssrCookie)
      }

      if (authStore.accessToken) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
      }
    }
  })

  const api = async <T = unknown>(request: FetchRequest, options?: FetchOptions): Promise<T> => {
    try {
      return await _api<T>(request, options)
    } catch (e: unknown) {
      const error = e as FetchError

      const requestUrl = request instanceof Request ? request.url : request.toString()
      const isAuthPath = requestUrl.includes('/login') || requestUrl.includes('/refresh')

      if (error.response?.status === 401 && !isAuthPath) {
        try {
          await refreshAccessToken()
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)

          await logout()
          await redirectToLogin()

          throw refreshError
        }

        return await _api<T>(request, options)
      }

      throw error
    }
  }

  return {
    provide: {
      refreshAccessToken,
      logout,
      api: api as typeof $fetch
    }
  }
})
