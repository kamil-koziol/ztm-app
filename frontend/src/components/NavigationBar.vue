<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <nav class="flex gap-2 p-4 font-medium bg-slate-900 text-slate-100">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/stops">Stops</RouterLink>
    <RouterLink to="/my/stops">My stops</RouterLink>

    <div class="ml-auto flex gap-2">
      <RouterLink v-if="!authStore.isAuthenticated" to="/login">Login</RouterLink>
      <RouterLink v-if="!authStore.isAuthenticated" to="/register">Register</RouterLink>
      <RouterLink v-if="authStore.isAuthenticated" to="/logout">Logout</RouterLink>
    </div>
  </nav>
</template>
