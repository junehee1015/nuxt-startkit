import type { FetchError } from 'ofetch'

let refreshPromise: Promise<string> | null = null

export default defineEventHandler(async (event) => {
  const method = (event.node.req.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

  const config = useRuntimeConfig()

  const path = event.context.params?.path || ''
  const targetUrl = `${config.public.apiUrl}/${path}`

  const accessToken = getCookie(event, 'accessToken')
  const proxyHeaders = new Headers()
  const requestHeaders = getHeaders(event)

  if (requestHeaders['content-type']) proxyHeaders.set('Content-Type', requestHeaders['content-type'])
  if (requestHeaders['accept']) proxyHeaders.set('Accept', requestHeaders['accept'])

  if (accessToken) proxyHeaders.set('Authorization', `Bearer ${accessToken}`)

  const hasBody = !['GET', 'HEAD'].includes(method)
  const body = hasBody ? await readRawBody(event) : undefined

  const sendRequest = (currentHeaders: Headers) => {
    return $fetch.raw(targetUrl, {
      method,
      headers: currentHeaders,
      body,
      query: getQuery(event),
      ignoreResponseError: true
    })
  }

  let response = await sendRequest(proxyHeaders)

  if (response.status === 401) {
    const refreshToken = getCookie(event, 'refreshToken')

    if (refreshToken) {
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            // const refreshResponse = await $fetch<{ accessToken: string }>(`${config.public.apiUrl}/auth/refresh`, {
            //   method: 'POST',
            //   headers: { Cookie: `refreshToken=${refreshToken}` }
            // })
            // return refreshResponse.accessToken
            await new Promise(resolve => setTimeout(resolve, 500))
            return 'mock-new-access-token-' + Date.now()
          })().finally(() => {
            refreshPromise = null
          })
        }

        const newAccessToken = await refreshPromise

        setCookie(event, 'accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 15,
          path: '/'
        })

        proxyHeaders.set('Authorization', `Bearer ${newAccessToken}`)
        response = await sendRequest(proxyHeaders)
      } catch (e: unknown) {
        const error = e as FetchError

        deleteCookie(event, 'accessToken')
        deleteCookie(event, 'refreshToken')

        throw createError({
          statusCode: error.response?.status || 401,
          statusMessage: error.data?.message || 'Session Expired'
        })
      }
    } else {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  }

  setResponseStatus(event, response.status)

  return response._data
})
