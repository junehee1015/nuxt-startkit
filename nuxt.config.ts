// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', 'dayjs-nuxt'],

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  imports: {
    dirs: [
      'api/**',
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
      api: process.env.NUXT_PUBLIC_API || 'http://localhost:8080/api'
    }
  },

  routeRules: {
    '/': { prerender: true }
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
