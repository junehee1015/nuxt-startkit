import type { RouterConfig } from '@nuxt/schema'

export default {
  linkActiveClass: 'nav-active',
  linkExactActiveClass: 'nav-exact-active',

  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    // 1. 뒤로/앞으로 가기 시 브라우저가 기억하는 위치로 즉시 복원
    if (savedPosition) {
      return savedPosition
    }

    // 2. 해시(#) 앵커 이동 시에만 부드러운 스크롤 적용 (헤더 높이 고려)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80 // Sticky 헤더를 위한 오프셋
      }
    }

    // 3. 페이지네이션/필터링 등 특정 쿼리 변경 시 스크롤 방지 로직 (Meta 태그 기반 위임)
    // 전역으로 막지 않고, 개별 페이지 컴포넌트에서 `definePageMeta({ keepScroll: true })`로 제어하도록 설계
    if (to.path === from.path && to.meta.keepScroll) {
      return
    }

    // 4. 일반 페이지 이동 (Nuxt Transition/Suspense 대응)
    // 새로운 페이지의 DOM이 완전히 준비된 후 최상단으로 즉시이동시킵니다.
    return new Promise((resolve) => {
      nuxtApp.hook('page:finish', () => {
        resolve({
          top: 0,
          behavior: 'auto'
        })
      })
    })
  }
} satisfies RouterConfig
