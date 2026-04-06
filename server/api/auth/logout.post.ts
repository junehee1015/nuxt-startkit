import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  deleteCookie(event, 'refreshToken', { path: '/' })

  return {
    success: true,
    message: 'Successfully logged out'
  }
})
