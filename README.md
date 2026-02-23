# 🚀 Nuxt Startkit

**확장성** 과 **유지보수성** 을 고려한 Nuxt 4 기반의 프로젝트 템플릿입니다.  
최신 Nuxt 생태계의 Best Practice와 **Nuxt 4 디렉토리 구조**가 적용되어 있으며, 복잡한 초기 설정 없이 바로 비즈니스 로직 개발에 집중할 수 있습니다.

## ✨ Key Features

- **Architecture**:
  - **FSD Lite**: 도메인 주도 설계를 위한 API 모듈화 및 Composable 패턴
  - **3-Layer Fetching**: `API Definition` -> `Composable (Blocking/Lazy)` -> `View Component`
- **Developer Experience**:
  - **Nuxt 4 Compatibility**: `app/` 디렉토리 기반의 깔끔한 폴더 구조
  - **Auto Import**: Vue, Nuxt, Pinia, UI Components 등 자동 임포트
- **Robust UI**: Nuxt UI v3 (Native) 기반의 고품질 컴포넌트 렌더링

---

## 🛠 Tech Stack

| Category          | Technology                                                                      | Description                               |
| :---------------- | :------------------------------------------------------------------------------ | :---------------------------------------- |
| **Core** | [Nuxt 4](https://nuxt.com/)                                                     | Vue Framework (Nuxt 4)     |
| **State** | [Pinia](https://pinia.vuejs.org/)                                               | Global State Management                   |
| **Data Fetching** | Nuxt Data Fetching                                                              | `useAsyncData`, `useLazyAsyncData`        |
| **HTTP** | [Ofetch](https://github.com/unjs/ofetch)                                        | Fetch API Wrapper (Nuxt 내장 `$fetch`)  |
| **UI Components** | [Nuxt UI v3](https://ui.nuxt.com/)                                              | Native Vue Components                     |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/)                                     | Utility-first CSS framework               |
| **Validation** | [Zod](https://zod.dev/)                                                         | Type-safe Schema Validation               |
| **Utilities** | [VueUse](https://vueuse.org/), [Day.js](https://day.js.org/)                    | Essential Composition Utilities & Dates   |

---

## 📂 Project Structure (Nuxt 4 Mode)

기존 루트 디렉토리가 아닌 `app/` 디렉토리 내부에 핵심 소스코드를 위치시켜, 설정 파일과 비즈니스 로직을 완벽하게 분리합니다.

```text
NUXT-STARTKIT/
├── app/
│   ├── api/            # 순수 API 네트워크 통신 함수 (Auto-imported)
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── composables/    # 비즈니스 로직 & Data Fetching (Key Factory 코로케이션)
│   ├── constants/      # 전역 상수 (routes.ts 등) (Auto-imported)
│   ├── layouts/        # 전역 레이아웃 (default, empty)
│   ├── middleware/     # 라우터 미들웨어 (auth.global.ts)
│   ├── pages/          # 파일 기반 라우팅 페이지
│   ├── stores/         # Pinia 전역 스토어
│   ├── utils/          # 공통 유틸리티 함수
│   └── app.vue         # 최상위 Root Component
├── public/             # 정적 리소스 (Images, Fonts)
├── .env                # 환경 변수 (로컬)
└── nuxt.config.ts      # Nuxt 전역 환경 설정
```

## 🚀 Getting Started

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정 (.env)

루트 경로에 `.env` 파일을 생성하고 API 주소를 설정하세요.

```env
NUXT_PUBLIC_API=http://localhost:8080/api
```

### 3. 개발 서버 실행

```bash
pnpm run dev
```

### 4. 빌드 및 배포

```bash
pnpm run build
```

---

## 📖 Architecture Guide


### 1. API & Data Fetching (3-Layer Pattern)

데이터 흐름을 명확히 하기 위해 API 호출을 3단계로 분리합니다.

**Step 1: API 통신 정의 (`app/api/*.ts`)**
이 계층은 오직 네트워크 요청만 담당합니다.

```typescript
// app/api/users.ts
export const fetchUsers = (page: number) => {
  return useApi<User[]>('/users', {
    query: { page }
  })
}

export const createUser = (body: Partial<User>) => {
  return useApi<User>('/users', {
    method: 'POST',
    body,
  })
}
```

**Step 2: 비즈니스 로직 및 Lazy 전략 (`app/composables/*.ts`)**
캐시 키(Key Factory)는 비즈니스 로직(`useAsyncData`)이 위치한 곳과 코로케이션(Co-location)하여 응집도를 높입니다.
핵심 데이터는 `useAsyncData`로 블로킹하고, 무거운 부가 데이터는 `useLazyAsyncData`를 사용합니다.

```typescript
// app/composables/useUsers.ts

// Key Factory Pattern (캐시 키 중앙 관리 - Composable과 Co-location)
export const userKeys = {
  all: 'users',
  stats: 'user-stats',
  detail: (id: number) => `${userKeys.all}-detail-${id}`,
}

export const useUsers = () => {
  const page = ref(1)

  // 핵심 데이터 (useAsyncData)
  const { data: users, refresh: refreshUsers, error: errorUsers } = await useAsyncData(
    userKeys.all,
    () => fetchUsers(page.value),
    { watch: [page] }
  )

  // 부가 데이터 (useLazyAsyncData)
  const { data: stats, status: statsStatus, error: errorStats } = await useLazyAsyncData(
    userKeys.stats,
    fetchUserStats
  )

  // 에러 처리
  // 컴포넌트에서 에러 UI를 처리하지 않고, 백그라운드에서 감지하여 Toast를 띄웁니다.
  watch([errorUsers, errorStats], ([errUsers, errStats]) => {
    // Toast는 브라우저(Client)에서만 동작해야 하므로 환경을 체크합니다.
    if (import.meta.client) {
      if (errUsers) useToast().add({ title: '유저 목록을 불러오지 못했습니다.', color: 'red' })
      if (errStats) useToast().add({ title: '통계 데이터를 불러오지 못했습니다.', color: 'red' })
    }
  }, { immediate: true }) // immediate: true로 초기 렌더링 시 발생한 에러도 즉시 잡습니다.

  // 액션 로직 (생성 후 캐시 무효화 및 에러 핸들링)
  const addUser = async (payload: Partial<User>) => {
    try {
      await createUser(payload)
      clearNuxtData(userKeys.all) // 캐시 삭제
      await refreshUsers() // 수동으로 데이터 다시 가져오기
    } catch (error) {
      throw error
    }
  }

  // errorUsers, errorStats를 더 이상 컴포넌트로 내보낼 필요가 없으므로 반환 객체에서 제거합니다.
  return { page, users, stats, statsStatus, addUser }
}
```

**Step 3: 컴포넌트 렌더링 (`app/pages/*.vue`)**
에러 처리가 Composable로 위임되었으므로, 컴포넌트는 오직 정상 데이터 렌더링에만 집중합니다.

```html
<script setup lang="ts">
// page 상태를 컴포넌트에서 직접 변경하면 watch에 의해 자동으로 API가 재호출됩니다.
const { page, users, errorUsers, stats, statsStatus, errorStats } = await useUsers()
</script>

<template>
  <div class="flex gap-8">
    <!-- 1. 블로킹 데이터 (users) -->
    <section class="flex-1">
      <h2>핵심 유저 목록</h2>

      <!-- 에러 처리 방어 코드 추가 -->
      <div v-if="errorUsers" class="text-red-500">유저 목록을 불러오지 못했습니다.</div>
      <ul v-else>
        <li v-for="user in users" :key="user.id">{{ user.name }}</li>
      </ul>

      <!-- 컴포넌트에서의 page 변수 조작 예시 -->
      <button @click="page++" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        다음 페이지 (현재: {{ page }})
      </button>
    </section>

    <!-- 2. Lazy 데이터 (stats) -->
    <aside class="w-64">
      <div v-if="statsStatus === 'pending'" class="h-32 bg-gray-200 animate-pulse">
        통계 집계 중...
      </div>
      <!-- 에러 처리 방어 코드 추가 -->
      <div v-else-if="errorStats" class="text-red-500">
        통계 데이터를 불러올 수 없습니다.
      </div>
      <div v-else>
        <!-- 데이터가 확실히 있을 때 접근하도록 Optional Chaining(?) 사용 -->
        전체 가입자: {{ stats?.totalCount }}명
      </div>
    </aside>
  </div>
</template>
```

### 2. Auto Imports

Nuxt의 강력한 Auto-import 기능을 활용하여 개발 생산성을 극대화합니다.  
`nuxt.config.ts` 설정에 따라 `app/` 하위 폴더의 파일들이 자동으로 import 됩니다.

### 3. Routing (`app/pages/`)

파일 기반 라우팅을 사용하며, 페이지 메타데이터는 `definePageMeta`를 통해 명시적으로 선언합니다.

```vue
<script setup lang="ts">
definePageMeta({
  name: 'login', // 라우트 이름
  layout: 'empty', // 레이아웃 지정 (기본값: default)
  title: '로그인',
})
</script>
```

---

## ✅ Naming Convention

| Type                  | Case       | Example                             |
| :-------------------- | :--------- | :---------------------------------- |
| **Component File** | PascalCase | `ConfirmDialog.vue`, `UserProfile.vue`|
| **Page File** | kebab-case | `index.vue`, `[id].vue`             |
| **Composable** | camelCase  | `useUsers.ts`, `useApi.ts`          |
| **API Module** | camelCase  | `users.ts`, `auth.ts`               |
| **Variable/Function** | camelCase  | `handleSubmit`, `isLoading`         |
| **Interface/Type** | PascalCase | `User`, `LoginPayload`              |

---

## 📝 License

MIT License