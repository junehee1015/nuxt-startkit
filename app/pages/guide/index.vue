<script setup lang="ts">
definePageMeta({
  name: 'guide',
  breadcrumb: '사용자 가이드'
})

useSeoMeta({ title: '사용자 가이드' })

const tabs = [
  { label: 'API & 상태관리', slot: 'api' },
  { label: '공통 컴포넌트', slot: 'common' }
]
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">
        사용자 가이드
      </h1>
      <p class="mt-2 text-gray-600">
        Nuxt-Startkit의 핵심 기능과 개발 규칙을 확인하는 공간입니다.
      </p>
    </div>

    <UTabs
      :items="tabs"
      class="w-full"
    >
      <template #api>
        <div class="py-6">
          <GuideApi />
        </div>
      </template>

      <template #common>
        <div class="py-6">
          <GuideCommon />
        </div>
      </template>
    </UTabs>
  </div>
</template>
