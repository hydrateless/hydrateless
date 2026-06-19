<script setup lang="ts">
import { computed } from 'vue';
import { getComponent } from '../../data/registry';

const props = defineProps<{ slug: string }>();
const rows = computed(() => getComponent(props.slug)?.tokens ?? []);
</script>

<template>
  <table v-if="rows.length" class="hl-api-table">
    <thead>
      <tr>
        <th>CSS variable</th>
        <th>Used for</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.name">
        <td>
          <code>{{ row.name }}</code>
        </td>
        <td>{{ row.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
