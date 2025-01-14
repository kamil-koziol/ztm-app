<template>
  <div class="register">
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          required
        />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
    Already registered? <RouterLink to="/login">Log in</RouterLink>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { ApiService } from "../plugins/api/api"
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'RegisterForm',
  setup() {
    const username = ref('');
    const password = ref('');

    const authStore = useAuthStore();

    const router = useRouter();
    const api = inject<ApiService>('$api')

    const handleRegister = async () => {
      let register = await api.register(username.value, password.value)
      console.log(register)

      let loginResponse = await api.login(username.value, password.value);
      if(!loginResponse) return

      let token = loginResponse.token

      authStore.setToken(token)
      authStore.setUser(loginResponse.user)
      router.push({ name: 'home' });
    };

    return {
      username,
      password,
      handleRegister,
    };
  },
});
</script>
