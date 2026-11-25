<script setup lang="ts">
import { computed } from 'vue';
import { getComponent } from '../../data/registry';
import { renderInline } from '../lib/inline';

const props = defineProps<{ slug: string }>();
const rows = computed(() => getComponent(props.slug)?.props ?? []);
</script>

<template>
  <div
    v-if="rows.length"
    class="hl-api-table-wrap"
    role="region"
    tabindex="0"
    aria-label="Component props"
  >
    <table class="hl-api-table hl-api-table--props">
      <colgroup>
        <col class="hl-col-name" />
        <col class="hl-col-type" />
        <col class="hl-col-default" />
        <col class="hl-col-desc" />
      </colgroup>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
            <span v-if="row.required" class="hl-req" title="Required">*</span>
          </td>
          <td>
            <code class="hl-type">{{ row.type }}</code>
          </td>
          <td>
            <code v-if="row.default">{{ row.default }}</code>
            <span v-else class="hl-muted">Not set</span>
          </td>
          <td v-html="renderInline(row.description)" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
