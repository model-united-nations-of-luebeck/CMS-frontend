import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
// eslint-disable-next-line no-unused-vars
import { VDateInput } from 'vuetify/labs/VDateInput' //currently still in labs

import VueClipboard from 'vue3-clipboard'
import Vue3Toastify from 'vue3-toastify'
import axios from 'axios'

// phone number input field
import 'flag-icons/css/flag-icons.min.css';
import 'v-phone-input/dist/v-phone-input.css';
import { createVPhoneInput } from 'v-phone-input';


const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  icons: {
    defaultSet: 'mdi' // This is already the default value - only for display purposes
  },
  font: {
    family: 'Roboto'
  },
  theme: {
    defaultTheme: 'light',
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
})
app.use(Vue3Toastify, {
  autoClose: 3000,
})

// create phone number input component
const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg',
  displayFormat: 'e164',
});
app.use(vPhoneInput);

// create global axios instance for backend requests
const backend_instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});
app.provide('backend_instance', backend_instance)

app.mount('#app')

