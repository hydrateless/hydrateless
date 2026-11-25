<script setup lang="ts">
import { computed } from 'vue';
import { getComponent } from '../../data/registry';
import { renderInline } from '../lib/inline';

const props = defineProps<{ slug: string }>();
const rows = computed(() => getComponent(props.slug)?.tokens ?? []);
</script>

<template>
  <div
    v-if="rows.length"
    class="hl-api-table-wrap"
    role="region"
    tabindex="0"
    aria-label="CSS variables"
  >
    <table class="hl-api-table hl-api-table--tokens">
      <colgroup>
        <col class="hl-col-token" />
        <col class="hl-col-desc" />
      </colgroup>
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
          <td v-html="renderInline(row.description)" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
