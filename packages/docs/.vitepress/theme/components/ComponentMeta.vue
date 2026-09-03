<script setup lang="ts">
import { computed } from 'vue';
import { getComponent } from '../../data/registry';

const props = defineProps<{ slug: string }>();
const doc = computed(() => getComponent(props.slug));
</script>

<template>
  <div v-if="doc" class="hl-meta">
    <span v-if="doc.status" class="hl-chip" :class="`is-${doc.status}`">{{ doc.status }}</span>
    <!-- A component can be fully usable with CSS alone and still ship an
         optional enhancer (e.g. Disclosure), so both chips can appear. -->
    <span v-if="doc.cssOnly" class="hl-chip is-css">CSS only</span>
    <span v-if="doc.enhancer" class="hl-chip is-js">Enhancer: {{ doc.enhancer.fn }}</span>
    <span v-if="doc.native" class="hl-chip">Built on {{ doc.native }}</span>
    <span class="hl-chip is-file"
      ><code>hydrateless/{{ doc.cssFile }}</code></span
    >
  </div>
</template>
