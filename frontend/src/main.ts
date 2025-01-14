import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ApiServicePlugin from "./plugins/api/api.ts"

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(ApiServicePlugin, { baseURL: 'http://localhost:3000' })
app.use(router)

app.mount('#app')
