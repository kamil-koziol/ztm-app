<template>
  <div class="w-full">
    <div v-if="myStops.length > 0">
      <StopDetails v-for="stopId in myStops" :key="stopId" :stopId="stopId" class="py-12"/>
    </div>
    <div v-else>
      <p>No stops available.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import StopDetails from './StopDetails.vue';
import { ApiService } from "../plugins/api/api";
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'MyStopsList',
  components: { StopDetails },
  setup() {
    const authStore = useAuthStore();

    const user = authStore.getUser;
    const myStops = ref(user.stops || []);

    return {
      myStops
    };
  }
});
</script>
