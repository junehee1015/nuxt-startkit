<script setup lang="ts">
// --- 1. Form State ---
const form = reactive({
  email: '',
  role: '',
  description: '',
  notifications: false,
  marketing: true
})

const roleOptions = [
  { label: '관리자 (Admin)', value: 'admin' },
  { label: '매니저 (Manager)', value: 'manager' },
  { label: '일반 사용자 (User)', value: 'user' },
  { label: '게스트 (Guest)', value: 'guest', disabled: true }
]

// --- 2. Dialog State ---
const isDialogOpen = ref(false)

// --- 3. Confirm & Toast ---
const handleConfirmTest = async () => {
  const result = await useConfirm({
    title: '정말 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.',
    confirmText: '삭제하기',
    variant: 'danger'
  })

  if (result) {
    useToast().add({ title: '삭제되었습니다!', color: 'success' })
  }
}

// --- 4. Table Data ---
const tableColumns = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'email', header: '이메일' },
  { accessorKey: 'role', header: '권한' },
  { accessorKey: 'status', header: '상태' }
]

const tableData = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? 'Admin' : 'User',
  status: i % 3 === 0 ? 'inactive' : 'active'
}))

// --- 5. Dropdown Items ---
const dropdownItems = [
  [
    { label: '프로필', icon: 'i-lucide-user', onSelect: () => alert('Profile') },
    { label: '설정', icon: 'i-lucide-settings' }
  ],
  [
    { label: '로그아웃', icon: 'i-lucide-log-out', onSelect: () => alert('Logout') }
  ]
]

// --- 6. Tabs Demo ---
const tabItems = [
  { label: '계정 설정', value: 'account' },
  { label: '비밀번호 변경', value: 'password' }
]

// --- 7. Pagination State ---
const currentPage = ref(1)
const totalItems = ref(120)

// --- 8. Accordion Items ---
const accordionItems = [
  { label: '스타트킷의 목적은 무엇인가요?', content: '반복되는 초기 세팅 시간을 줄이고 일관된 아키텍처를 제공하기 위함입니다.', icon: 'i-lucide-help-circle' },
  { label: '상태 관리는 어떻게 하나요?', content: 'Pinia를 사용하여 전역 상태를 관리하며, 서버 데이터는 Vue Query 또는 Nuxt useAsyncData를 권장합니다.', icon: 'i-lucide-database' }
]

// --- Utils: Scroll ---
const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="flex gap-12 relative items-start">
    <div class="flex-1 space-y-24 min-w-0 pb-32">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">
          Nuxt UI 컴포넌트 가이드
        </h2>
        <p class="my-3 text-lg text-gray-600 leading-relaxed">
          Base 래퍼 컴포넌트 없이 <strong>Nuxt UI v3</strong> 네이티브 컴포넌트를 직접 사용합니다.<br>
          아래 Usage의 코드를 복사하여 IDE에 바로 붙여넣어 사용하세요.
        </p>
        <a
          href="https://ui.nuxt.com/docs/components"
          target="_blank"
          class="underline"
        >Vue Components - Nuxt UI</a>
      </div>

      <section
        id="actions"
        class="space-y-6 scroll-mt-24"
      >
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Actions
          </h3>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-4">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Preview
            </h4>

            <div class="flex flex-wrap gap-3 items-center">
              <UButton color="primary">
                Primary
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
              >
                Outline
              </UButton>
              <UButton
                color="neutral"
                variant="ghost"
              >
                Ghost
              </UButton>
              <UButton color="error">
                Danger
              </UButton>
              <div class="w-px h-8 bg-gray-200 mx-2" />
              <UButton loading>
                Loading
              </UButton>
              <UButton disabled>
                Disabled
              </UButton>
              <UButton
                to="/login"
                color="neutral"
                variant="outline"
              >
                Link
              </UButton>
            </div>
          </div>

          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm h-fit">
            <div class="px-4 py-2 bg-[#252526] border-b border-gray-800 text-gray-400">
              Usage (Copy & Paste)
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex flex-wrap gap-3 items-center"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"primary"</span><span class="text-[#808080]">&gt;</span>Primary<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"neutral"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"outline"</span><span class="text-[#808080]">&gt;</span>Outline<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"neutral"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"ghost"</span><span class="text-[#808080]">&gt;</span>Ghost<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"error"</span><span class="text-[#808080]">&gt;</span>Danger<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-px h-8 bg-gray-200 mx-2"</span><span class="text-[#808080]">&gt;&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">loading</span><span class="text-[#808080]">&gt;</span>Loading<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">disabled</span><span class="text-[#808080]">&gt;</span>Disabled<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">to</span>=<span class="text-[#ce9178]">"/login"</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"neutral"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"outline"</span><span class="text-[#808080]">&gt;</span>Link<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>
        </div>
      </section>

      <section
        id="forms"
        class="space-y-6 scroll-mt-24"
      >
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Form Inputs
          </h3>
        </div>

        <div class="space-y-4">
          <div class="space-y-6 p-6 border rounded-xl bg-white">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Preview
            </h4>

            <UForm
              :state="form"
              class="space-y-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField
                  label="이메일"
                  name="email"
                  required
                >
                  <UInput
                    v-model="form.email"
                    placeholder="example@email.com"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="사용자 역할"
                  name="role"
                >
                  <USelect
                    v-model="form.role"
                    :items="roleOptions"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField
                label="자기소개"
                name="description"
                help="최대 100자까지 입력 가능합니다."
              >
                <UTextarea
                  v-model="form.description"
                  placeholder="내용을 입력하세요"
                  class="w-full"
                />
              </UFormField>

              <div class="space-y-3 pt-2">
                <UCheckbox
                  v-model="form.notifications"
                  label="알림 받기"
                />
                <USwitch
                  v-model="form.marketing"
                  label="마케팅 정보 수신"
                />
              </div>
            </UForm>
          </div>

          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm h-fit">
            <div class="px-4 py-2 bg-[#252526] border-b border-gray-800 text-gray-400">
              Usage (Copy & Paste)
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UForm</span> :<span class="text-[#9cdcfe]">state</span>="<span class="text-[#9cdcfe]">form</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"space-y-6"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"grid grid-cols-1 md:grid-cols-2 gap-6"</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UFormField</span> <span class="text-[#9cdcfe]">label</span>=<span class="text-[#ce9178]">"이메일"</span> <span class="text-[#9cdcfe]">name</span>=<span class="text-[#ce9178]">"email"</span> <span class="text-[#9cdcfe]">required</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UInput</span> <span class="text-[#9cdcfe]">v-model</span>="<span class="text-[#9cdcfe]">form.email</span>" <span class="text-[#9cdcfe]">placeholder</span>=<span class="text-[#ce9178]">"example@email.com"</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-full"</span> <span class="text-[#808080]">/&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UFormField</span><span class="text-[#808080]">&gt;</span>

    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UFormField</span> <span class="text-[#9cdcfe]">label</span>=<span class="text-[#ce9178]">"사용자 역할"</span> <span class="text-[#9cdcfe]">name</span>=<span class="text-[#ce9178]">"role"</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">USelect</span> <span class="text-[#9cdcfe]">v-model</span>="<span class="text-[#9cdcfe]">form.role</span>" :<span class="text-[#9cdcfe]">items</span>="<span class="text-[#9cdcfe]">roleOptions</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-full"</span> <span class="text-[#808080]">/&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UFormField</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>

  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UFormField</span> <span class="text-[#9cdcfe]">label</span>=<span class="text-[#ce9178]">"자기소개"</span> <span class="text-[#9cdcfe]">name</span>=<span class="text-[#ce9178]">"description"</span> <span class="text-[#9cdcfe]">help</span>=<span class="text-[#ce9178]">"최대 100자까지 입력 가능합니다."</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UTextarea</span> <span class="text-[#9cdcfe]">v-model</span>="<span class="text-[#9cdcfe]">form.description</span>" <span class="text-[#9cdcfe]">placeholder</span>=<span class="text-[#ce9178]">"내용을 입력하세요"</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-full"</span> <span class="text-[#808080]">/&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UFormField</span><span class="text-[#808080]">&gt;</span>

  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"space-y-3 pt-2"</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UCheckbox</span> <span class="text-[#9cdcfe]">v-model</span>="<span class="text-[#9cdcfe]">form.notifications</span>" <span class="text-[#9cdcfe]">label</span>=<span class="text-[#ce9178]">"알림 받기"</span> <span class="text-[#808080]">/&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">USwitch</span> <span class="text-[#9cdcfe]">v-model</span>="<span class="text-[#9cdcfe]">form.marketing</span>" <span class="text-[#9cdcfe]">label</span>=<span class="text-[#ce9178]">"마케팅 정보 수신"</span> <span class="text-[#808080]">/&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UForm</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>
        </div>
      </section>

      <section
        id="layout"
        class="space-y-6 scroll-mt-24"
      >
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Layout & Containers
          </h3>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-4">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Preview
            </h4>

            <UTabs
              default-value="account"
              :items="tabItems"
              class="w-full"
            >
              <template #content="{ item }">
                <UCard
                  v-if="item.value === 'account'"
                  class="mt-4 ring-0 divide-y divide-gray-100"
                >
                  <template #header>
                    <div>
                      <h3 class="font-bold text-gray-900">
                        계정 정보
                      </h3>
                      <p class="text-sm text-gray-500">
                        정보를 수정합니다.
                      </p>
                    </div>
                  </template>
                  <div class="space-y-4">
                    <UFormField label="닉네임">
                      <UInput class="w-full" />
                    </UFormField>
                  </div>
                  <template #footer>
                    <div class="flex justify-end">
                      <UButton>저장하기</UButton>
                    </div>
                  </template>
                </UCard>
                <div
                  v-else
                  class="p-4 text-gray-500"
                >
                  비밀번호 탭 내용...
                </div>
              </template>
            </UTabs>
          </div>

          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm h-fit">
            <div class="px-4 py-2 bg-[#252526] border-b border-gray-800 text-gray-400">
              Usage (Copy & Paste)
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UTabs</span> <span class="text-[#9cdcfe]">default-value</span>=<span class="text-[#ce9178]">"account"</span> :<span class="text-[#9cdcfe]">items</span>="<span class="text-[#9cdcfe]">tabItems</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-full"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">content</span>="<span class="text-[#dcdcaa]">{ </span><span class="text-[#9cdcfe]">item</span><span class="text-[#dcdcaa]"> }</span>"<span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UCard</span> <span class="text-[#c586c0]">v-if</span>="<span class="text-[#9cdcfe]">item.value</span> === <span class="text-[#ce9178]">'account'</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"mt-4 ring-0 divide-y divide-gray-100"</span><span class="text-[#808080]">&gt;</span>

      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">header</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
          <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">h3</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"font-bold text-gray-900"</span><span class="text-[#808080]">&gt;</span>계정 정보<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">h3</span><span class="text-[#808080]">&gt;</span>
          <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">p</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-sm text-gray-500"</span><span class="text-[#808080]">&gt;</span>정보를 수정합니다.<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">p</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>

      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"space-y-4"</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UFormField</span> <span class="text-[#9cdcfe]">label</span>=<span class="text-[#ce9178]">"닉네임"</span><span class="text-[#808080]">&gt;&lt;</span><span class="text-[#4ec9b0]">UInput</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-full"</span> <span class="text-[#808080]">/&gt;&lt;/</span><span class="text-[#4ec9b0]">UFormField</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>

      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">footer</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex justify-end"</span><span class="text-[#808080]">&gt;</span>
          <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>저장하기<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>

    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UCard</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-else</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"p-4 text-gray-500"</span><span class="text-[#808080]">&gt;</span>비밀번호 탭 내용...<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UTabs</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>
        </div>
      </section>

      <section
        id="data"
        class="space-y-6 scroll-mt-24"
      >
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Data Display
          </h3>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-6">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Preview
            </h4>

            <div class="flex flex-wrap gap-2">
              <UBadge
                color="neutral"
                variant="soft"
              >
                Default
              </UBadge>
              <UBadge
                color="success"
                variant="soft"
              >
                Success
              </UBadge>
              <UBadge
                color="warning"
                variant="soft"
              >
                Warning
              </UBadge>
              <UBadge
                color="error"
                variant="soft"
              >
                Error
              </UBadge>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-sm">
                  User List
                </h4>
                <UDropdownMenu :items="dropdownItems">
                  <UButton
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-more-horizontal"
                  >
                    Options
                  </UButton>
                </UDropdownMenu>
              </div>

              <UTable
                :data="tableData"
                :columns="tableColumns"
                class="w-full"
              >
                <template #status-cell="{ row }">
                  <UBadge
                    :color="row.original.status === 'active' ? 'success' : 'neutral'"
                    variant="soft"
                  >
                    {{ row.original.status === 'active' ? 'Active' : 'Inactive' }}
                  </UBadge>
                </template>
              </UTable>
            </div>
          </div>

          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm h-fit">
            <div class="px-4 py-2 bg-[#252526] border-b border-gray-800 text-gray-400">
              Usage (Copy & Paste)
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex flex-wrap gap-2"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UBadge</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"neutral"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"soft"</span><span class="text-[#808080]">&gt;</span>Default<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UBadge</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UBadge</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"success"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"soft"</span><span class="text-[#808080]">&gt;</span>Success<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UBadge</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UBadge</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"warning"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"soft"</span><span class="text-[#808080]">&gt;</span>Warning<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UBadge</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UBadge</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"error"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"soft"</span><span class="text-[#808080]">&gt;</span>Error<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UBadge</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"space-y-4 mt-6"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex justify-between items-center"</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">h4</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"font-bold text-sm"</span><span class="text-[#808080]">&gt;</span>User List<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">h4</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UDropdownMenu</span> :<span class="text-[#9cdcfe]">items</span>="<span class="text-[#9cdcfe]">dropdownItems</span>"<span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"neutral"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"outline"</span> <span class="text-[#9cdcfe]">icon</span>=<span class="text-[#ce9178]">"i-lucide-more-horizontal"</span><span class="text-[#808080]">&gt;</span>Options<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UDropdownMenu</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>

  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UTable</span> :<span class="text-[#9cdcfe]">data</span>="<span class="text-[#9cdcfe]">tableData</span>" :<span class="text-[#9cdcfe]">columns</span>="<span class="text-[#9cdcfe]">tableColumns</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-full"</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">status-cell</span>="<span class="text-[#dcdcaa]">{ </span><span class="text-[#9cdcfe]">row</span><span class="text-[#dcdcaa]"> }</span>"<span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UBadge</span> :<span class="text-[#9cdcfe]">color</span>="<span class="text-[#9cdcfe]">row.original.status</span> === <span class="text-[#ce9178]">'active'</span> ? <span class="text-[#ce9178]">'success'</span> : <span class="text-[#ce9178]">'neutral'</span>" <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"soft"</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#dcdcaa]">&#123;&#123;</span> <span class="text-[#9cdcfe]">row.original.status</span> === <span class="text-[#ce9178]">'active'</span> ? <span class="text-[#ce9178]">'Active'</span> : <span class="text-[#ce9178]">'Inactive'</span> <span class="text-[#dcdcaa]">&#125;&#125;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UBadge</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UTable</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>
        </div>
      </section>

      <section
        id="navigation"
        class="space-y-6 scroll-mt-24"
      >
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Navigation
          </h3>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-6">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Preview
            </h4>

            <div class="space-y-4">
              <h4 class="font-bold text-sm text-gray-700">
                Pagination
              </h4>
              <UPagination
                v-model="currentPage"
                :total="totalItems"
                :page-count="10"
                class="justify-center"
              />
            </div>

            <UDivider />

            <div class="space-y-4">
              <h4 class="font-bold text-sm text-gray-700">
                Accordion
              </h4>
              <UAccordion
                :items="accordionItems"
                class="w-full"
              />
            </div>
          </div>

          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm h-fit">
            <div class="px-4 py-2 bg-[#252526] border-b border-gray-800 text-gray-400">
              Usage (Copy & Paste)
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">script</span> <span class="text-[#9cdcfe]">setup</span> <span class="text-[#9cdcfe]">lang</span>=<span class="text-[#ce9178]">"ts"</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#6a9955]">// Pagination State</span>
<span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">currentPage</span> = <span class="text-[#dcdcaa]">ref</span>(<span class="text-[#b5cea8]">1</span>)
<span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">totalItems</span> = <span class="text-[#dcdcaa]">ref</span>(<span class="text-[#b5cea8]">120</span>)

<span class="text-[#6a9955]">// Accordion Items</span>
<span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">accordionItems</span> = [
  { <span class="text-[#9cdcfe]">label</span>: <span class="text-[#ce9178]">'스타트킷의 목적은?'</span>, <span class="text-[#9cdcfe]">content</span>: <span class="text-[#ce9178]">'초기 세팅 시간을 줄입니다.'</span>, <span class="text-[#9cdcfe]">icon</span>: <span class="text-[#ce9178]">'i-lucide-help-circle'</span> },
  { <span class="text-[#9cdcfe]">label</span>: <span class="text-[#ce9178]">'상태 관리는?'</span>, <span class="text-[#9cdcfe]">content</span>: <span class="text-[#ce9178]">'Pinia와 Vue Query를 사용합니다.'</span>, <span class="text-[#9cdcfe]">icon</span>: <span class="text-[#ce9178]">'i-lucide-database'</span> }
]
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">script</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#6a9955]">&lt;!-- Pagination --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UPagination</span> <span class="text-[#9cdcfe]">v-model</span>="<span class="text-[#9cdcfe]">currentPage</span>" :<span class="text-[#9cdcfe]">total</span>="<span class="text-[#9cdcfe]">totalItems</span>" :<span class="text-[#9cdcfe]">page-count</span>="<span class="text-[#b5cea8]">10</span>" <span class="text-[#808080]">/&gt;</span>

  <span class="text-[#6a9955]">&lt;!-- Accordion --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UAccordion</span> :<span class="text-[#9cdcfe]">items</span>="<span class="text-[#9cdcfe]">accordionItems</span>" <span class="text-[#808080]">/&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>
        </div>
      </section>

      <section
        id="feedback"
        class="space-y-6 scroll-mt-24"
      >
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Feedback & Overlays
          </h3>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-4">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Preview
            </h4>
            <div class="flex flex-wrap gap-4 items-center">
              <UButton
                color="neutral"
                variant="outline"
                @click="isDialogOpen = true"
              >
                Open Modal
              </UButton>
              <UButton
                color="error"
                @click="handleConfirmTest"
              >
                Confirm Hook
              </UButton>

              <UButton
                color="success"
                variant="outline"
                icon="i-lucide-check-circle"
                @click="useToast().add({ title: '저장 완료', description: '데이터가 성공적으로 저장되었습니다.', color: 'success' })"
              >
                Success Toast
              </UButton>
              <UButton
                color="warning"
                variant="outline"
                icon="i-lucide-alert-triangle"
                @click="useToast().add({ title: '경고', description: '입력값을 다시 확인해주세요.', color: 'warning' })"
              >
                Warning Toast
              </UButton>

              <UTooltip text="알림 설정으로 이동합니다">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-bell"
                />
              </UTooltip>
            </div>

            <UModal v-model:open="isDialogOpen">
              <template #content>
                <UCard class="ring-0 divide-y divide-gray-100">
                  <template #header>
                    <h3 class="font-bold">
                      제목
                    </h3>
                  </template>
                  <p class="text-sm text-gray-600">
                    모달 컨텐츠 영역
                  </p>
                  <template #footer>
                    <div class="flex justify-end">
                      <UButton @click="isDialogOpen = false">
                        Close
                      </UButton>
                    </div>
                  </template>
                </UCard>
              </template>
            </UModal>
          </div>

          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm h-fit">
            <div class="px-4 py-2 bg-[#252526] border-b border-gray-800 text-gray-400">
              Usage (Copy & Paste)
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex flex-wrap gap-4 items-center"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> @<span class="text-[#9cdcfe]">click</span>="<span class="text-[#9cdcfe]">isDialogOpen</span> = <span class="text-[#569cd6]">true</span>" <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"neutral"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"outline"</span><span class="text-[#808080]">&gt;</span>Open Modal<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> @<span class="text-[#9cdcfe]">click</span>="<span class="text-[#dcdcaa]">handleConfirmTest</span>" <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"error"</span><span class="text-[#808080]">&gt;</span>Confirm Hook<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>

  <span class="text-[#6a9955]">&lt;!-- Toast (Global Notification) --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> @<span class="text-[#9cdcfe]">click</span>="<span class="text-[#dcdcaa]">useToast</span>().<span class="text-[#dcdcaa]">add</span>({ <span class="text-[#9cdcfe]">title</span>: <span class="text-[#ce9178]">'성공'</span>, <span class="text-[#9cdcfe]">color</span>: <span class="text-[#ce9178]">'success'</span> })"<span class="text-[#808080]">&gt;</span>Success Toast<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>

  <span class="text-[#6a9955]">&lt;!-- Tooltip --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UTooltip</span> <span class="text-[#9cdcfe]">text</span>=<span class="text-[#ce9178]">"알림 설정으로 이동합니다"</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> <span class="text-[#9cdcfe]">color</span>=<span class="text-[#ce9178]">"neutral"</span> <span class="text-[#9cdcfe]">variant</span>=<span class="text-[#ce9178]">"ghost"</span> <span class="text-[#9cdcfe]">icon</span>=<span class="text-[#ce9178]">"i-lucide-bell"</span> <span class="text-[#808080]">/&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UTooltip</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UModal</span> <span class="text-[#9cdcfe]">v-model</span>:<span class="text-[#9cdcfe]">open</span>="<span class="text-[#9cdcfe]">isDialogOpen</span>"<span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">content</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UCard</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"ring-0 divide-y divide-gray-100"</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">header</span><span class="text-[#808080]">&gt;&lt;</span><span class="text-[#569cd6]">h3</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"font-bold"</span><span class="text-[#808080]">&gt;</span>제목<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">h3</span><span class="text-[#808080]">&gt;&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">p</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-sm text-gray-600"</span><span class="text-[#808080]">&gt;</span>모달 컨텐츠 영역<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">p</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">footer</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex justify-end"</span><span class="text-[#808080]">&gt;</span>
          <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UButton</span> @<span class="text-[#9cdcfe]">click</span>="<span class="text-[#9cdcfe]">isDialogOpen</span> = <span class="text-[#569cd6]">false</span>"<span class="text-[#808080]">&gt;</span>Close<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UButton</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UCard</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">UModal</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>
        </div>
      </section>
    </div>

    <aside class="hidden 2xl:block w-64 shrink-0">
      <div class="sticky top-24">
        <h4 class="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4 px-4">
          Contents
        </h4>
        <nav class="space-y-1">
          <button
            v-for="item in ['actions', 'forms', 'layout', 'data', 'navigation', 'feedback']"
            :key="item"
            class="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors capitalize"
            @click="scrollTo(item)"
          >
            {{ item }}
          </button>
        </nav>
      </div>
    </aside>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
