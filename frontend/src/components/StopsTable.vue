<template>
  <div class="stops-table">
    <!-- VueGoodTable component rendering the stops data -->
    <vue-good-table :columns="columns" :rows="stops" :pagination-options="{
      enabled: true,
      mode: 'records',
      perPage: 15
    }" :search-options="{
          enabled: true,
          trigger: 'enter',
          }">
      <template #table-row="props">
        <span v-if="props.column.field == 'actions'">
          <span v-if="isUserStop(props.row.stopId)">
<button
  type="button"
  class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-24"
  v-on:click="handleRemove(props.row)"
>
  Remove
</button>
          </span>
          <span v-else>
<button
  type="button"
  class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-24"
  v-on:click="handleAdd(props.row)"
>
  Add
</button>
          </span>
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from 'vue';
import { ApiService } from "../plugins/api/api"
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'StopsTable',
  components: {
    VueGoodTable
  },
  setup() {
    const api = inject<ApiService>('$api');
    const router = useRouter()
    const authStore = useAuthStore()

    const stops = ref([]);
    const pagination = ref({
      currentPage: 1,
      pageSize: 20,
    });
    const columns = ref([
      {
        label: 'Stop ID',
        field: 'stopId',
      },
      {
        label: 'Stop Code',
        field: 'stopCode',
      },
      {
        label: 'Stop Name',
        field: 'stopName',
      },
      {
        label: 'Type',
        field: 'type',
      },
      {
        label: 'Actions',
        field: 'actions',
      },
    ]);

    onMounted(async () => {
      const response = await api.getStops();
      stops.value = response.stops;
    });

    const handleAdd = async (row) => {
      await api.addStopToUser(row.stopId)
    };
    const handleRemove = async (row) => {
      await api.removeStopFromUser(row.stopId)
    };

    const isUserStop = (stopId) => {
      return authStore.getUser.stops.includes(stopId.toString())
    }

    return {
      stops,
      columns,
      pagination,
      handleAdd,
      handleRemove,
      isUserStop
    };
  }
});
</script>
