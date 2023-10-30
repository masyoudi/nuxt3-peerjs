// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  serverHandlers: [
    {
      route: '/express/**',
      handler: '~~/server/express'
    }
  ],
  modules: ['@nuxt/ui'],
  ui: {
    global: true,
    icons: ['simple-icons', 'ph']
  },
  colorMode: {
    preference: 'light'
  },
  devtools: {
    enabled: false
  },
  telemetry: false
});
