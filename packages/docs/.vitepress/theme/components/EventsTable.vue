<script setup lang="ts">
import { computed } from 'vue';
import { getComponent } from '../../data/registry';
import { renderInline } from '../lib/inline';

const props = defineProps<{ slug: string }>();
const rows = computed(() => getComponent(props.slug)?.events ?? []);
</script>

<template>
  <div
    v-if="rows.length"
    class="hl-api-table-wrap"
    role="region"
    tabindex="0"
    aria-label="Component events"
  >
    <table class="hl-api-table hl-api-table--events">
      <colgroup>
        <col class="hl-col-event" />
        <col class="hl-col-payload" />
        <col class="hl-col-desc" />
      </colgroup>
      <thead>
        <tr>
          <th>Event / Callback</th>
          <th>Payload</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>
            <code v-if="row.detail" class="hl-type">{{ row.detail }}</code>
            <span v-else class="hl-muted">None</span>
          </td>
          <td v-html="renderInline(row.description)" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
