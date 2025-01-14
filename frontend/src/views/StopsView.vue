<template>
  <div>
    <StopsTable />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
import StopsTable from '../components/StopsTable.vue'
</script>
