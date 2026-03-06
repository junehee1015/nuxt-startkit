<script setup lang="ts">
const menuItems = [
  { label: '대시보드', to: '/dashboard', icon: 'i-lucide-layout-dashboard', exact: true },
  { label: '사용자 가이드', to: '/guide', icon: 'i-lucide-book-open' }
]
</script>

<template>
  <aside class="w-64 border-r bg-white h-screen flex flex-col fixed left-0 top-0 z-30">
    <div class="h-14 flex items-center px-6 border-b shrink-0">
      <UIcon
        name="i-lucide-box"
        class="h-6 w-6 text-primary mr-2"
      />
      <span class="font-bold text-lg tracking-tight">Nuxt Startkit</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <UNavigationMenu
        :items="menuItems"
        orientation="vertical"
        class="w-full"
      />
    </nav>
  </aside>
</template>
