<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/stops">Stops</RouterLink>

    <RouterLink v-if="!authStore.isAuthenticated" to="/login">Login</RouterLink>
    <RouterLink v-if="!authStore.isAuthenticated" to="/register">Register</RouterLink>
    <RouterLink v-if="authStore.isAuthenticated" to="/logout">Logout</RouterLink>
  </nav>
</template>
