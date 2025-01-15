<template>
  <div class="">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Stop Details</h2>

    <div class="space-y-2 mb-4">
      <p><strong class="text-gray-600">Stop ID:</strong> <span class="text-gray-800">{{ stop?.stopId }}</span></p>
      <p><strong class="text-gray-600">Stop:</strong> <span class="text-gray-800">{{ stop?.stopName }} {{ stop?.stopCode
          }}</span></p>
      <p><strong class="text-gray-600">Type:</strong> <span class="text-gray-800">{{ stop?.type }}</span></p>
      <button type="button"
        class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        v-on:click="handleRemove(stop?.stopId)">
        Remove
      </button>
    </div>

    <h3 class="text-xl font-semibold text-gray-700 mb-4">Delays</h3>
    <div v-if="stop?.delays && stop.delays.length > 0">
      <vue-good-table :columns="columns" :rows="stop?.delays" v-if="stop?.delays" />
    </div>
    <p v-else class="text-gray-500">No delays available for this stop.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted, onBeforeUnmount, toRefs } from 'vue';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';

export default defineComponent({
  name: "StopDetails",
  components: {
    VueGoodTable
  },
  props: {
    stopId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const stop = ref(null);
    const api = inject('$api');
    const stopId = props.stopId
    let refreshInterval: ReturnType<typeof setInterval> | null = null;

    const columns = [
      { label: 'Route ID', field: 'routeId' },
      { label: 'Headsign', field: 'headsign' },
      { label: 'Delay (seconds)', field: 'delayInSeconds' },
      { label: 'Theoretical Time', field: 'theoreticalTime' },
      { label: 'Estimated Time', field: 'estimatedTime' },
    ];

    const fetchStopDetails = async () => {
      const response = await api.getStop(stopId);
      stop.value = response.stop
    };

    const handleRemove = async (stopId) => {
      await api.removeStopFromUser(stopId)
    };

    onMounted(async () => {
      await fetchStopDetails()
      refreshInterval = setInterval(fetchStopDetails, 30000);
    });

    onBeforeUnmount(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      stop,
      stopId,
      columns,
      handleRemove
    };
  }
});
</script>
