<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  name: 'login',
  layout: 'empty',
  requiresAuth: false
})

useSeoMeta({ title: '로그인' })

const authStore = useAuthStore()
const toast = useToast()

const savedEmail = useCookie<string | null>('saved_email', { maxAge: 60 * 60 * 24 * 30 }) // 30일 유지

const schema = z.object({
  email: z.email('올바른 이메일 형식이 아닙니다.').min(1, '이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
  rememberMe: z.boolean().optional()
})

const state = ref({
  email: savedEmail.value || '',
  password: '',
  rememberMe: !!savedEmail.value
})

const isSubmitting = ref(false)

const onSubmit = async () => {
  isSubmitting.value = true
  try {
    await authStore.login({ email: state.value.email, password: state.value.password })

    if (state.value.rememberMe) {
      savedEmail.value = state.value.email
    } else {
      savedEmail.value = null
    }

    toast.add({ title: '로그인되었습니다.', color: 'success', progress: false })
    await navigateTo('/', { replace: true })
  } catch {
    toast.add({ title: '로그인에 실패했습니다.', color: 'error', progress: false })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
        Nuxt Startkit
      </h1>
    </div>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField
        label="이메일"
        name="email"
      >
        <UInput
          v-model="state.email"
          type="email"
          placeholder="admin@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="비밀번호"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <div class="flex items-center justify-between">
        <UCheckbox
          v-model="state.rememberMe"
          name="rememberMe"
          label="아이디 기억하기"
        />
        <NuxtLink
          to="/forgot-password"
          class="text-sm font-medium text-primary hover:text-primary-600"
        >
          비밀번호 찾기
        </NuxtLink>
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        :loading="isSubmitting"
      >
        로그인
      </UButton>
    </UForm>

    <p class="text-center text-sm text-gray-600">
      계정이 없으신가요?
      <NuxtLink
        to="/signup"
        class="font-medium text-primary hover:text-primary-600"
      >
        회원가입
      </NuxtLink>
    </p>
  </div>
</template>
