<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold">My stops</h1>
    <div class="my-6"/>
    <MyStopsList />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
import MyStopsList from '../components/MyStopsList.vue'
</script>
