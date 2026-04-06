import { defineEventHandler, getCookie, setCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refreshToken')

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Refresh token is missing'
    })
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newAccessToken = 'mock-new-access-token-' + Date.now()
    const newRefreshToken = 'mock-new-refresh-token-' + Date.now()
    // --------------------------------------------------------

    setCookie(event, 'refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return {
      accessToken: newAccessToken
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired refresh token'
    })
  }
})
