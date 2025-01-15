<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold">Stops</h1>
    <div class="my-6"/>
    <StopsTable />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
import StopsTable from '../components/StopsTable.vue'
</script>
