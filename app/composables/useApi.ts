import type { FetchError } from 'ofetch'

type FetchRequestOptions = NonNullable<Parameters<typeof $fetch>[1]>

export interface CustomFetchOptions extends FetchRequestOptions {
  _retry?: boolean
}

let refreshPromise: Promise<void> | null = null

// 순수 인스턴스
export const useRefreshApi = <T>(url: string, options: FetchRequestOptions = {}) => {
  const config = useRuntimeConfig()

  return $fetch<T>(url, {
    baseURL: config.public.api as string,
    ...options
  })
}

// 외부로 내보낼 Wrapper 함수
export const useApi = async <T>(
  url: string,
  options: CustomFetchOptions = {}
): Promise<T> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const route = useRoute()

  const { _retry, ...fetchOptions } = options

  const _apiInstance = $fetch.create({
    baseURL: config.public.api as string,
    async onRequest({ options: interceptorOptions }) {
      if (authStore.accessToken) {
        interceptorOptions.headers = new Headers(interceptorOptions.headers)
        interceptorOptions.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
      }
    }
  })

  try {
    return await _apiInstance<T>(url, fetchOptions as FetchRequestOptions)
  } catch (e) {
    const error = e as FetchError
    const isAuthPath = url.toString().includes('/login') || url.toString().includes('/refresh')

    if (error.response?.status === 401 && !_retry && !isAuthPath) {
      if (import.meta.server) throw error

      if (!refreshPromise) {
        refreshPromise = authStore.refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      try {
        await refreshPromise

        const retryOptions = { ...fetchOptions, _retry: true } as unknown as FetchRequestOptions
        return await _apiInstance<T>(url, retryOptions)
      } catch (refreshError) {
        authStore.logout()

        if (import.meta.client && route.name !== ROUTE_NAMES.LOGIN) {
          await navigateTo({ name: ROUTE_NAMES.LOGIN }, { replace: true })
        }
        throw refreshError
      }
    }

    throw error
  }
}
