<template>
  <div class="login flex justify-center items-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-sm font-semibold text-gray-700">Username:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Enter your username"
            required
            class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-semibold text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
            class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { ApiService } from "../plugins/api/api"
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'LoginForm',
  setup() {
    const username = ref('');
    const password = ref('');
    const authStore = useAuthStore();

    const router = useRouter(); // Initialize router
    const api = inject<ApiService>('$api')

    const handleLogin = async () => {
      let loginResponse = await api.login(username.value, password.value);
      if(!loginResponse) return

      let { token, user } = loginResponse

      authStore.setToken(token)
      authStore.setUser(user)

      router.push({ name: 'home' });
    };

    return {
      username,
      password,
      handleLogin,
    };
  },
});
</script>
