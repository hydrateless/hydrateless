<script setup lang="ts">
import { FRAMEWORKS, FRAMEWORK_LABELS, useFramework, type Framework } from '../../shared/framework';

withDefaults(defineProps<{ only?: Framework[] }>(), { only: undefined });

const { framework, setFramework } = useFramework();
</script>

<template>
  <div class="hl-fw-switch" role="tablist" aria-label="Code language">
    <button
      v-for="fw in only ?? FRAMEWORKS"
      :key="fw"
      type="button"
      role="tab"
      :aria-selected="framework === fw"
      :class="{ active: framework === fw }"
      @click="setFramework(fw)"
    >
      {{ FRAMEWORK_LABELS[fw] }}
    </button>
  </div>
</template>
