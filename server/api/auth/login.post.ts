import { defineEventHandler, readBody, setCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password } = body

  await new Promise(resolve => setTimeout(resolve, 500))

  if (email !== 'admin@example.com' || password !== '1234') {
    throw createError({
      statusCode: 401,
      statusMessage: '아이디 또는 비밀번호가 일치하지 않습니다.'
    })
  }

  const accessToken = 'mock-access-token-' + Date.now()
  const refreshToken = 'mock-refresh-token-' + Date.now()
  const user = {
    name: 'Juny Jo',
    email: email,
    role: 'Admin'
  }

  setCookie(event, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24시간 유지
    path: '/'
  })

  return {
    accessToken,
    user
  }
})
