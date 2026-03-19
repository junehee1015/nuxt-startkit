<template>
  <div class="space-y-12 max-w-5xl pb-32">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">
        API & Data Fetching 아키텍처 (Nuxt)
      </h2>
      <p class="mt-2 text-gray-600">
        본 스타터킷은 <strong>Key Factory Pattern</strong>과 <strong>Composable 비즈니스 로직 분리</strong>를 통해 유지보수성을 극대화합니다.<br>
        <code class="bg-gray-100 px-1 rounded text-red-500">401 에러</code> 발생 시 컴포넌트 모르게 <strong>투명하게 토큰을 갱신하고 재요청</strong>하는 api 인스턴스가 내장되어 있습니다.
      </p>
    </div>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm">STEP 1</span>
        <h3 class="text-xl font-bold text-gray-800">
          API 통신 정의 (api/ 디렉토리)
        </h3>
      </div>
      <p class="text-gray-600 text-sm">
        이 계층은 오직 네트워크 요청만 담당하며, 상태(Ref)를 가지지 않는 순수 Promise를 반환해야 합니다.<br>
        플러그인에 주입된 순수 비동기 래퍼인 <code>useNuxtApp().$api</code>를 사용합니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
        <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
          <div class="flex gap-1.5 mr-4">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div class="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span class="text-gray-400">app/api/users.ts</span>
        </div>
        <pre
          v-pre
          class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
        ><code><span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">fetchUsers</span> = (<span class="text-[#9cdcfe]">page</span>: <span class="text-[#4ec9b0]">number</span>) <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#c586c0]">return</span> <span class="text-[#dcdcaa]">useNuxtApp</span>().<span class="text-[#9cdcfe]">$api</span>&lt;<span class="text-[#4ec9b0]">User</span>[]&gt;(<span class="text-[#ce9178]">'/users'</span>, {
    <span class="text-[#9cdcfe]">query</span>: { <span class="text-[#9cdcfe]">page</span> }
  })
}

<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">createUser</span> = (<span class="text-[#9cdcfe]">body</span>: <span class="text-[#4ec9b0]">Partial</span>&lt;<span class="text-[#4ec9b0]">User</span>&gt;) <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#c586c0]">return</span> <span class="text-[#dcdcaa]">useNuxtApp</span>().<span class="text-[#9cdcfe]">$api</span>&lt;<span class="text-[#4ec9b0]">User</span>&gt;(<span class="text-[#ce9178]">'/users'</span>, {
    <span class="text-[#9cdcfe]">method</span>: <span class="text-[#ce9178]">'POST'</span>,
    <span class="text-[#9cdcfe]">body</span>,
  })
}</code></pre>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm">STEP 2</span>
        <h3 class="text-xl font-bold text-gray-800">
          비즈니스 로직 및 Lazy 전략 (composables/)
        </h3>
      </div>
      <p class="text-gray-600 text-sm">
        캐시 키(Key Factory)는 비즈니스 로직(useAsyncData)이 위치한 곳과 <strong>코로케이션(Co-location)</strong> 하여 응집도를 높입니다.<br>
        핵심 데이터는 <code>useAsyncData</code>로 블로킹하고, 무거운 부가 데이터는 <code>useLazyAsyncData</code>를 사용합니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
        <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
          <div class="flex gap-1.5 mr-4">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]" /><div class="w-3 h-3 rounded-full bg-[#ffbd2e]" /><div class="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span class="text-gray-400">app/composables/useUsers.ts</span>
        </div>
        <pre
          v-pre
          class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
        ><code><span class="text-[#6a9955]">// Key Factory Pattern (캐시 키 중앙 관리)</span>
<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">userKeys</span> = {
  <span class="text-[#9cdcfe]">all</span>: <span class="text-[#ce9178]">'users'</span>,
  <span class="text-[#9cdcfe]">stats</span>: <span class="text-[#ce9178]">'user-stats'</span>,
  <span class="text-[#dcdcaa]">detail</span>: (<span class="text-[#9cdcfe]">id</span>: <span class="text-[#4ec9b0]">number</span>) <span class="text-[#569cd6]">=&gt;</span> <span class="text-[#ce9178]">`</span><span class="text-[#4fc1ff]">${</span><span class="text-[#9cdcfe]">userKeys.all</span><span class="text-[#4fc1ff]">}</span><span class="text-[#ce9178]">-detail-</span><span class="text-[#4fc1ff]">${</span><span class="text-[#9cdcfe]">id</span><span class="text-[#4fc1ff]">}</span><span class="text-[#ce9178]">`</span>,
}

<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">useUsers</span> = () <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">page</span> = <span class="text-[#dcdcaa]">ref</span>(<span class="text-[#b5cea8]">1</span>)

  <span class="text-[#6a9955]">// 핵심 데이터 (STEP 1의 순수 API 함수 호출)</span>
  <span class="text-[#569cd6]">const</span> { <span class="text-[#9cdcfe]">data</span>: <span class="text-[#4fc1ff]">users</span>, <span class="text-[#9cdcfe]">refresh</span>: <span class="text-[#4fc1ff]">refreshUsers</span>, <span class="text-[#9cdcfe]">error</span>: <span class="text-[#4fc1ff]">errorUsers</span> } = <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">useAsyncData</span>(
    <span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#9cdcfe]">all</span>,
    () <span class="text-[#569cd6]">=&gt;</span> <span class="text-[#dcdcaa]">fetchUsers</span>(<span class="text-[#4fc1ff]">page</span>.value),
    { <span class="text-[#9cdcfe]">watch</span>: [<span class="text-[#4fc1ff]">page</span>] }
  )

  <span class="text-[#6a9955]">// 부가 데이터 (비차단 렌더링)</span>
  <span class="text-[#569cd6]">const</span> { <span class="text-[#9cdcfe]">data</span>: <span class="text-[#4fc1ff]">stats</span>, <span class="text-[#9cdcfe]">status</span>: <span class="text-[#4fc1ff]">statsStatus</span>, <span class="text-[#9cdcfe]">error</span>: <span class="text-[#4fc1ff]">errorStats</span> } = <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">useLazyAsyncData</span>(
    <span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#9cdcfe]">stats</span>,
    <span class="text-[#dcdcaa]">fetchUserStats</span>
  )

  <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">addUser</span> = <span class="text-[#c586c0]">async</span> (<span class="text-[#9cdcfe]">payload</span>: <span class="text-[#4ec9b0]">Partial</span><span class="text-[#c586c0]">&lt;</span><span class="text-[#4ec9b0]">User</span><span class="text-[#c586c0]">&gt;</span>) <span class="text-[#569cd6]">=&gt;</span> {
    <span class="text-[#c586c0]">try</span> {
      <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">createUser</span>(<span class="text-[#9cdcfe]">payload</span>)
      <span class="text-[#dcdcaa]">clearNuxtData</span>(<span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#9cdcfe]">all</span>) <span class="text-[#6a9955]">// 캐시 삭제</span>
      <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">refreshUsers</span>() <span class="text-[#6a9955]">// 데이터 리프레시</span>
    } <span class="text-[#c586c0]">catch</span> (<span class="text-[#9cdcfe]">error</span>) {
      <span class="text-[#c586c0]">throw</span> <span class="text-[#9cdcfe]">error</span>
    }
  }

  <span class="text-[#c586c0]">return</span> { <span class="text-[#4fc1ff]">page</span>, <span class="text-[#4fc1ff]">users</span>, <span class="text-[#4fc1ff]">errorUsers</span>, <span class="text-[#4fc1ff]">stats</span>, <span class="text-[#4fc1ff]">statsStatus</span>, <span class="text-[#4fc1ff]">errorStats</span>, <span class="text-[#dcdcaa]">addUser</span> }
}</code></pre>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm">STEP 3</span>
        <h3 class="text-xl font-bold text-gray-800">
          컴포넌트 렌더링 (Suspense & ErrorBoundary)
        </h3>
      </div>
      <p class="text-gray-600 text-sm">
        Vue 3의 <code>&lt;Suspense&gt;</code>와 Nuxt의 <code>&lt;NuxtErrorBoundary&gt;</code>를 조합하여,
        <strong>로딩(Fallback)</strong>과 <strong>에러(Error)</strong> UI를 선언적으로 완벽하게 분리합니다.
      </p>

      <div class="mt-6">
        <h4 class="text-lg font-bold text-gray-700 mb-2">
          📌 Case A: 부모에게 위임 (NuxtErrorBoundary + Suspense 사용)
        </h4>
        <p class="text-sm text-gray-500 mb-4">
          자식 컴포넌트는 오직 정상 데이터 렌더링에만 집중합니다. 로딩과 에러 복구(캐시 리셋 후 재요청)는 모두 부모가 책임집니다.
        </p>
        <div class="grid grid-cols-1 gap-6">
          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
            <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
              <span class="text-gray-400 font-bold">Child (Case A)</span>
              <span class="text-gray-500 ml-2">| app/components/UserList.vue</span>
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">script</span> <span class="text-[#9cdcfe]">setup</span> <span class="text-[#9cdcfe]">lang</span>=<span class="text-[#ce9178]">"ts"</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#569cd6]">const</span> { <span class="text-[#4fc1ff]">users</span>, <span class="text-[#4fc1ff]">errorUsers</span> } = <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">useUsers</span>()

<span class="text-[#c586c0]">if</span> (<span class="text-[#4fc1ff]">errorUsers</span>.<span class="text-[#9cdcfe]">value</span>) <span class="text-[#c586c0]">throw</span> <span class="text-[#4fc1ff]">errorUsers</span>.<span class="text-[#9cdcfe]">value</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">script</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">ul</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">li</span> <span class="text-[#c586c0]">v-for</span>="<span class="text-[#4fc1ff]">user</span> <span class="text-[#569cd6]">in</span> <span class="text-[#4fc1ff]">users</span>" :<span class="text-[#9cdcfe]">key</span>="<span class="text-[#4fc1ff]">user</span>.<span class="text-[#9cdcfe]">id</span>"<span class="text-[#808080]">&gt;</span><span class="text-[#dcdcaa]">&#123;&#123;</span> <span class="text-[#4fc1ff]">user</span>.<span class="text-[#9cdcfe]">name</span> <span class="text-[#dcdcaa]">&#125;&#125;</span><span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">li</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">ul</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>

          <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
            <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
              <span class="text-gray-400 font-bold">Parent Page</span>
              <span class="text-gray-500 ml-2">| app/pages/users/index.vue</span>
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
            ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">script</span> <span class="text-[#9cdcfe]">setup</span> <span class="text-[#9cdcfe]">lang</span>=<span class="text-[#ce9178]">"ts"</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">handleRetry</span> = (<span class="text-[#9cdcfe]">clearError</span>: () <span class="text-[#569cd6]">=&gt;</span> <span class="text-[#4ec9b0]">void</span>) <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#dcdcaa]">clearNuxtData</span>(<span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#9cdcfe]">all</span>)
  <span class="text-[#dcdcaa]">clearError</span>()
}
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">script</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">NuxtErrorBoundary</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">Suspense</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UserList</span> <span class="text-[#808080]">/&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">fallback</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-blue-500 animate-pulse"</span><span class="text-[#808080]">&gt;</span>로딩 중...<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">Suspense</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> #<span class="text-[#9cdcfe]">error</span>="<span class="text-[#dcdcaa]">{</span> <span class="text-[#9cdcfe]">error</span>, <span class="text-[#9cdcfe]">clearError</span> <span class="text-[#dcdcaa]">}</span>"<span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-red-500"</span><span class="text-[#808080]">&gt;</span>
        에러 발생: <span class="text-[#dcdcaa]">&#123;&#123;</span> <span class="text-[#9cdcfe]">error</span>.<span class="text-[#9cdcfe]">message</span> <span class="text-[#dcdcaa]">&#125;&#125;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">button</span> @<span class="text-[#9cdcfe]">click</span>="<span class="text-[#dcdcaa]">handleRetry</span>(<span class="text-[#9cdcfe]">clearError</span>)" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"underline ml-2"</span><span class="text-[#808080]">&gt;</span>다시 시도<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">button</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">NuxtErrorBoundary</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span></code></pre>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <h4 class="text-lg font-bold text-gray-700 mb-2">
          📌 Case B: 자식 내부에서 직접 처리 (Lazy Data)
        </h4>
        <p class="text-sm text-gray-500 mb-4">
          사이드바 위젯처럼 실패해도 페이지 전체가 깨지면 안 되는 경우, <strong>컴포저블이 반환한 상태</strong>를 활용해
          자체 스켈레톤 및 에러 UI를 그립니다. (이 경우 부모의 Suspense나 ErrorBoundary에 의존하지 않습니다.)
        </p>
        <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
          <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
            <span class="text-gray-400 font-bold">Child (Case B)</span>
            <span class="text-gray-500 ml-2">| app/components/UserStats.vue</span>
          </div>
          <pre
            v-pre
            class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
          ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">script</span> <span class="text-[#9cdcfe]">setup</span> <span class="text-[#9cdcfe]">lang</span>=<span class="text-[#ce9178]">"ts"</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#569cd6]">const</span> { <span class="text-[#4fc1ff]">stats</span>, <span class="text-[#4fc1ff]">statsStatus</span>, <span class="text-[#4fc1ff]">errorStats</span> } = <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">useUsers</span>()
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">script</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-if</span>="<span class="text-[#9cdcfe]">statsStatus</span> === <span class="text-[#ce9178]">'pending'</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"h-32 bg-gray-200 animate-pulse"</span><span class="text-[#808080]">&gt;</span>
    통계 집계 중...
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>

  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-else-if</span>="<span class="text-[#9cdcfe]">errorStats</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-red-500 text-sm"</span><span class="text-[#808080]">&gt;</span>
    통계 정보를 불러올 수 없습니다.
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>

  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-else</span><span class="text-[#808080]">&gt;</span>
    전체 가입자: <span class="text-[#dcdcaa]">&#123;&#123;</span> <span class="text-[#4fc1ff]">stats</span>?.<span class="text-[#9cdcfe]">totalCount</span> <span class="text-[#dcdcaa]">&#125;&#125;</span>명
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span></code></pre>
        </div>
      </div>
    </section>
  </div>
</template>
