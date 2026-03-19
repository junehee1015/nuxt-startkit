import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // const refreshToken = getCookie(event, 'refreshToken')

  // logout API
  // if (refreshToken) {
  //   await $fetch('api/logout', {
  //     method: 'POST',
  //     body: { refreshToken }
  //   }).catch(() => {}) // 에러가 나도 프론트엔드 로그아웃은 진행되어야 하므로 조용히 넘김
  // }

  deleteCookie(event, 'refreshToken', { path: '/' })

  return {
    success: true,
    message: 'Successfully logged out'
  }
})
