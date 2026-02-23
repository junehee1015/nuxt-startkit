<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const breadcrumbs = computed(() => {
  const matchedLinks = route.matched
    .filter(r => r.meta?.breadcrumb)
    .map(r => ({
      label: r.meta.breadcrumb as string,
      to: r.path !== route.path ? r.path : undefined
    }))

  return [
    { icon: 'i-lucide-home', to: '/guide' },
    ...matchedLinks
  ]
})

const userMenuItems = [
  [
    { label: '프로필', icon: 'i-lucide-user', onSelect: () => alert('Profile') },
    { label: '설정', icon: 'i-lucide-settings' }
  ],
  [
    { label: '로그아웃', icon: 'i-lucide-log-out', onSelect: () => logout() }
  ]
]

const logout = async () => {
  const isConfirmed = await useConfirm({
    title: '로그아웃 하시겠습니까?',
    variant: 'danger',
    confirmText: '로그아웃',
    cancelText: '취소'
  })

  if (!isConfirmed) return

  authStore.logout()
  await navigateTo({ name: ROUTE_NAMES.LOGIN })

  toast.add({ title: '로그아웃 되었습니다.', color: 'error', progress: false })
}
</script>

<template>
  <header class="h-14 border-b bg-white flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-20">
    <div>
      <UBreadcrumb :items="breadcrumbs" />
    </div>

    <div class="flex items-center gap-4">
      <UDropdownMenu :items="userMenuItems">
        <div class="flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors hover:bg-gray-100 cursor-pointer min-w-32">
          <div class="h-8 w-8 shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
            JS
          </div>
          <div class="flex flex-col text-left">
            <span class="text-sm text-gray-700 font-medium leading-none">Juny Jo</span>
            <span class="text-[10px] text-gray-400 leading-none mt-0.5">Admin</span>
          </div>
        </div>
      </UDropdownMenu>
    </div>
  </header>
</template>
