import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // const config = useRuntimeConfig()
  // const accessToken = getCookie(event, 'accessToken')

  // if (accessToken) {
  //   try {
  //     await $fetch(`${config.public.apiUrl}/auth/logout`, {
  //       method: 'POST',
  //       headers: { Authorization: `Bearer ${accessToken}` }
  //     })
  //   } catch {
  //     console.warn('logout api failed')
  //   }
  // }

  await new Promise(resolve => setTimeout(resolve, 500))

  deleteCookie(event, 'refreshToken', { path: '/' })
  deleteCookie(event, 'accessToken', { path: '/' })

  return {
    success: true
  }
})
