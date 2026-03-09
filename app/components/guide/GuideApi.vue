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
          UI 컴포넌트 렌더링
        </h3>
      </div>
      <p class="text-gray-600 text-sm">
        컴포넌트는 오직 가져다 쓰고 렌더링하는 역할만 담당합니다.<br>
        블로킹 데이터는 즉시 렌더링하고, Lazy 데이터는 <code>status</code>로 스켈레톤 UI를 처리합니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
        <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
          <div class="flex gap-1.5 mr-4">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]" /><div class="w-3 h-3 rounded-full bg-[#ffbd2e]" /><div class="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span class="text-gray-400">app/pages/users/index.vue</span>
        </div>
        <pre
          v-pre
          class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
        ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">script</span> <span class="text-[#9cdcfe]">setup</span> <span class="text-[#9cdcfe]">lang</span>=<span class="text-[#ce9178]">"ts"</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#6a9955]">// page 상태를 컴포넌트에서 직접 변경하면 watch에 의해 자동으로 API가 재호출됩니다.</span>
<span class="text-[#569cd6]">const</span> { <span class="text-[#4fc1ff]">page</span>, <span class="text-[#4fc1ff]">users</span>, <span class="text-[#4fc1ff]">errorUsers</span>, <span class="text-[#4fc1ff]">stats</span>, <span class="text-[#4fc1ff]">statsStatus</span>, <span class="text-[#4fc1ff]">errorStats</span> } = <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">useUsers</span>()
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">script</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex gap-8"</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#6a9955]">&lt;!-- 1. 블로킹 데이터 (users) --&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">section</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"flex-1"</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">h2</span><span class="text-[#808080]">&gt;</span>핵심 유저 목록<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">h2</span><span class="text-[#808080]">&gt;</span>

      <span class="text-[#6a9955]">&lt;!-- 에러 처리 방어 코드 추가 --&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-if</span>="<span class="text-[#9cdcfe]">errorUsers</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-red-500"</span><span class="text-[#808080]">&gt;</span>유저 목록을 불러오지 못했습니다.<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">ul</span> <span class="text-[#c586c0]">v-else</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">li</span> <span class="text-[#c586c0]">v-for</span>="<span class="text-[#4fc1ff]">user</span> <span class="text-[#569cd6]">in</span> <span class="text-[#9cdcfe]">users</span>" :<span class="text-[#9cdcfe]">key</span>="<span class="text-[#4fc1ff]">user</span>.<span class="text-[#9cdcfe]">id</span>"<span class="text-[#808080]">&gt;</span><span class="text-[#dcdcaa]">&#123;&#123;</span> <span class="text-[#4fc1ff]">user</span>.<span class="text-[#9cdcfe]">name</span> <span class="text-[#dcdcaa]">&#125;&#125;</span><span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">li</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">ul</span><span class="text-[#808080]">&gt;</span>

      <span class="text-[#6a9955]">&lt;!-- 컴포넌트에서의 page 변수 조작 예시 --&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">button</span> <span class="text-[#c586c0]">@click</span>="<span class="text-[#9cdcfe]">page</span>++" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"mt-4 px-4 py-2 bg-blue-500 text-white rounded"</span><span class="text-[#808080]">&gt;</span>
        다음 페이지 (현재: <span class="text-[#dcdcaa]">&#123;&#123;</span> <span class="text-[#4fc1ff]">page</span> <span class="text-[#dcdcaa]">&#125;&#125;</span>)
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">button</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">section</span><span class="text-[#808080]">&gt;</span>

    <span class="text-[#6a9955]">&lt;!-- 2. Lazy 데이터 (stats) --&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">aside</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"w-64"</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-if</span>="<span class="text-[#9cdcfe]">statsStatus</span> === <span class="text-[#ce9178]">'pending'</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"h-32 bg-gray-200 animate-pulse"</span><span class="text-[#808080]">&gt;</span>
        통계 집계 중...
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#6a9955]">&lt;!-- 에러 처리 방어 코드 추가 --&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-else-if</span>="<span class="text-[#9cdcfe]">errorStats</span>" <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-red-500"</span><span class="text-[#808080]">&gt;</span>
        통계 데이터를 불러올 수 없습니다.
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#c586c0]">v-else</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#6a9955]">&lt;!-- 데이터가 확실히 있을 때 접근하도록 Optional Chaining(?) 사용 --&gt;</span>
        전체 가입자: <span class="text-[#dcdcaa]">&#123;&#123;</span> <span class="text-[#4fc1ff]">stats</span>?.<span class="text-[#9cdcfe]">totalCount</span> <span class="text-[#dcdcaa]">&#125;&#125;</span>명
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">aside</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span></code></pre>
      </div>
    </section>
  </div>
</template>
