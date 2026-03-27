import type { UseFetchOptions } from '#app'
import { defu } from 'defu'

export function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const { $api } = useNuxtApp()

  const defaults: UseFetchOptions<T> = { $fetch: $api }

  const params = defu(options, defaults)

  return useFetch(url, params)
}
