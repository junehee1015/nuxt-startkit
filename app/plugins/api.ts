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

  const redirectToLogin = async () => {
    try {
      await nuxtApp.runWithContext(async () => {
        if (useRoute().path !== '/login') await navigateTo('/login', { replace: true })
      })
    } catch (error) {
      if (import.meta.server) throw error
      if (import.meta.client) window.location.href = '/login'
    }
  }

  const logout = async () => {
    if (logoutPromise) return logoutPromise

    logoutPromise = (async () => {
      try {
        await _api('/auth/logout', { method: 'POST', credentials: 'include' })
      } catch (error) {
        console.error('Logout API failed, but forcing local logout', error)
      } finally {
        authStore.clearAuthData()
        clearNuxtData()
        await nextTick()
        localStorage.removeItem('auth')

        await redirectToLogin()
        logoutPromise = null
      }
    })()

    return logoutPromise
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
    const requestToPerform = request instanceof Request ? request.clone() : request

    try {
      return await _api<T>(requestToPerform, options)
    } catch (e: unknown) {
      const error = e as FetchError

      const requestUrl = request instanceof Request ? request.url : request.toString()
      const isAuthPath = requestUrl.includes('/login') || requestUrl.includes('/logout') || requestUrl.includes('/refresh')

      if (error.response?.status === 401 && !isAuthPath) {
        try {
          await refreshAccessToken()
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          await logout()
          throw refreshError
        }

        const retryRequest = request instanceof Request ? request.clone() : request
        return await _api<T>(retryRequest, options)
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
