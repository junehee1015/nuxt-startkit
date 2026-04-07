import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refreshToken')

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Refresh token is missing'
    })
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  const newAccessToken = 'mock-new-access-token-' + Date.now()

  return {
    accessToken: newAccessToken
  }
})
