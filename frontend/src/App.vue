<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import NavigationBar from './components/NavigationBar.vue'
</script>

<template>
  <header>
    <NavigationBar />
  </header>

  <RouterView />
</template>
