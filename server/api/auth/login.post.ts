import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import type { FetchError } from 'ofetch'

export default defineEventHandler(async (event) => {
  // const config = useRuntimeConfig()
  const { email, password } = await readBody(event)

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (email !== 'admin@example.com' || password !== '1234') {
      throw createError({
        statusCode: 401,
        statusMessage: '아이디 또는 비밀번호가 일치하지 않습니다.'
      })
    }

    // const response = await $fetch<{
    //   accessToken: string
    //   refreshToken: string
    //   user: { id: string, name: string }
    // }>(`${config.public.apiUrl}/auth/login`, {
    //   method: 'POST',
    //   body
    // })

    const accessToken = 'mock-access-token-' + Date.now()
    const refreshToken = 'mock-refresh-token-' + Date.now()
    const user = {
      name: 'Juny Jo',
      email: email,
      role: 'Admin'
    }

    setCookie(event, 'accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15분
      path: '/'
    })

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
  } catch (e: unknown) {
    const error = e as FetchError
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.data?.message || 'Login Failed'
    })
  }
})
