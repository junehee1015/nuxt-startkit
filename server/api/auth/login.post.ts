import { defineEventHandler, readBody, setCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)

  const { email, password } = body

  // const response = await $fetch('api/login', {
  //   method: 'POST',
  //   body: { email, password }
  // })

  await new Promise(resolve => setTimeout(resolve, 500))

  if (email !== 'admin@example.com' || password !== '1234') {
    throw createError({
      statusCode: 401,
      statusMessage: '아이디 또는 비밀번호가 일치하지 않습니다.'
    })
  }

  const newAccessToken = 'mock-access-token-' + Date.now()
  const newRefreshToken = 'mock-refresh-token-' + Date.now()
  const user = {
    name: 'Juny Jo',
    email: email,
    role: 'Admin'
  }

  setCookie(event, 'refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7일 유지
    path: '/'
  })

  return {
    accessToken: newAccessToken,
    user: user
  }
})
