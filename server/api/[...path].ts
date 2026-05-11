const refreshLocks = new Map<string, Promise<string | null>>()

export default defineEventHandler(async (event) => {
  const method = (event.node.req.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

  const config = useRuntimeConfig()

  const path = event.context.params?.path || ''
  const targetUrl = `${config.public.apiUrl}/${path}`

  const proxyHeaders = new Headers(getHeaders(event) as HeadersInit)
  proxyHeaders.delete('host') // 라우팅 오류 방지
  proxyHeaders.delete('cookie') // 원본 쿠키 유출 방지

  const accessToken = getCookie(event, 'accessToken')
  if (accessToken) proxyHeaders.set('Authorization', `Bearer ${accessToken}`)

  const contentType = proxyHeaders.get('content-type') || ''
  const isMultipart = contentType.includes('multipart/form-data')
  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method)

  let requestBody = null

  if (hasBody) {
    // 파일 업로드는 Node 스트림(req) 그대로 바이패스, 일반 데이터는 재시도를 위해 RAM 버퍼링
    requestBody = isMultipart ? event.node.req : await readRawBody(event)
  }

  const sendRequest = (currentHeaders: Headers) => {
    return $fetch.raw(targetUrl, {
      method,
      headers: currentHeaders,
      body: requestBody,
      query: getQuery(event),
      ignoreResponseError: true,
      duplex: (hasBody && isMultipart) ? 'half' : undefined
    })
  }

  let response = await sendRequest(proxyHeaders)

  if (response.status === 401) {
    const refreshToken = getCookie(event, 'refreshToken')

    if (refreshToken) {
      if (!refreshLocks.has(refreshToken)) {
        const refreshPromise = (async () => {
          try {
            // const refreshResponse = await $fetch<{ accessToken: string }>(`${config.public.apiUrl}/auth/refresh`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: { refreshToken }
            // })
            // return refreshResponse.accessToken
            await new Promise(resolve => setTimeout(resolve, 500))
            return 'mock-new-access-token-' + Date.now()
          } catch {
            return null
          } finally {
            refreshLocks.delete(refreshToken)
          }
        })()

        refreshLocks.set(refreshToken, refreshPromise)
      }

      const newAccessToken = await refreshLocks.get(refreshToken)

      if (newAccessToken) {
        setCookie(event, 'accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 15,
          path: '/'
        })

        proxyHeaders.set('Authorization', `Bearer ${newAccessToken}`)
        response = await sendRequest(proxyHeaders)
      } else {
        deleteCookie(event, 'accessToken', { path: '/' })
        deleteCookie(event, 'refreshToken', { path: '/' })
        throw createError({ statusCode: 401, statusMessage: 'Session Expired' })
      }
    } else {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  }

  setResponseStatus(event, response.status)

  return response._data
})
