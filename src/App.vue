<script setup>
import { inject, ref, onMounted } from 'vue'

const error = ref('')
const token = ref('')

const login = async function () {
  // get global axios instance for backend requests and save token in there
  const http = inject('backend_instance')

  try {
    const { data } = await http.post(
      import.meta.env.VITE_BACKEND_URL.split('/').slice(0, -2).join('/') + '/api-token-auth/',
      {
        username: import.meta.env.VITE_BACKEND_USERNAME,
        password: import.meta.env.VITE_BACKEND_PASSWORD
      }
    )
    token.value = data.token
    http.defaults.headers.common['Authorization'] = `Token ${token.value}`
    error.value = null
    console.log('Login in', http.defaults.headers.common['Authorization'])
  } catch (error) {
    error.value = error
    token.value = null
    console.log('Login failed')
    delete http.defaults.headers.common['Authorization']
  }
}

onMounted(() => {
  login()
})
</script>

<template>
  <v-app>
    <v-app-bar density="compact" color="primary">
      <RouterLink to="/">
        <v-app-bar-nav-icon icon="mdi-bank" color="white"></v-app-bar-nav-icon>
      </RouterLink>
      <v-app-bar-title>{{ this.$route.meta.title }} </v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

    <v-alert v-if="error" type="error" title="API Authentication Error" :text="error.msg"></v-alert>

    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>
