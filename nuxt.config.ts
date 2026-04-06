export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', 'dayjs-nuxt', 'pinia-plugin-persistedstate/nuxt'],

  components: [
    { path: '~/components/common', pathPrefix: false },
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components', pathPrefix: true }
  ],
  imports: {
    dirs: [
      'composables/**',
      'constants/**'
    ]
  },

  devtools: {
    enabled: true
  },

  app: {
    head: {
      title: 'Nuxt Startkit',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8080',
      mockUrl: process.env.NUXT_PUBLIC_MOCK_URL || '/api'
    }
  },

  routeRules: {
    // '/admin/**': { ssr: false },      // CSR Only (백오피스 등에 적합)
    // '/landing/**': { prerender: true }, // SSG (정적 랜딩 페이지에 적합)
    // '/**': { isr: 60 } // ISR (60초마다 캐시 갱신, 블로그 등에 적합)
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: 'latest',

  dayjs: {
    locales: ['ko'],
    defaultLocale: 'ko',
    defaultTimezone: 'Asia/Seoul',
    plugins: [
      'relativeTime',
      'timezone',
      'utc'
    ]
  },

  eslint: {
    config: {
      stylistic: true
    }
  }
})
