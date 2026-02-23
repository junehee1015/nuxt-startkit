import type { RouterConfig } from '@nuxt/schema'

// Vue Router의 내부 옵션을 오버라이딩합니다.
export default <RouterConfig>{
  // 라우트 매칭 동작 설정
  // 파일 시스템 라우트 외에 커스텀 라우트를 추가하고 싶을 때 사용
  routes: (_routes) => {
    // 예: 랜딩 페이지를 별도 마케팅 페이지로 리다이렉트하거나
    // 특정 패턴을 가로채는 로직을 여기에 작성할 수 있습니다.
    return _routes
  },

  // Tailwind CSS 호환 설정
  // 기본 'router-link-active' 대신 Tailwind 유틸리티와 충돌 없는 설정
  linkActiveClass: 'nav-active',
  linkExactActiveClass: 'nav-exact-active',

  // 스크롤 동작 제어 (Smooth Scrolling & Restore)
  scrollBehavior(to, from, savedPosition) {
    // 브라우저 뒤로/앞으로 가기 시 저장된 위치로 복원
    if (savedPosition) {
      return savedPosition
    }

    // URL에 #hash가 있다면 해당 위치로 부드럽게 스크롤
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80 // 헤더 높이(Sticky Header)만큼 여백을 줌
      }
    }

    // 페이지 이동 시 항상 최상단으로 이동 (기본 동작)
    // 단, 쿼리 파라미터만 바뀌는 경우(필터링 등)는 스크롤 유지
    if (to.path === from.path && to.query !== from.query) {
      return
    }

    return { top: 0, behavior: 'smooth' }
  }
}
