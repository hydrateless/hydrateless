<script setup lang="ts">
import { computed, ref } from 'vue';
import { highlight } from '../lib/highlight';

const props = defineProps<{
  code: string;
  lang?: string;
  filename?: string;
}>();

const highlighted = computed(() => highlight(props.code.trimEnd(), props.lang));

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code.trimEnd());
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1600);
  } catch {
    // Clipboard can be blocked; fail quietly.
  }
}
</script>

<template>
  <div class="hl-code" :class="{ 'has-filename': filename }">
    <div v-if="filename" class="hl-code-filename">{{ filename }}</div>
    <button
      class="hl-code-copy"
      type="button"
      :aria-label="copied ? 'Copied' : 'Copy code'"
      @click="copy"
    >
      {{ copied ? 'Copied' : 'Copy' }}
    </button>
    <pre><code v-html="highlighted" /></pre>
  </div>
</template>
