<script setup lang="ts">
import { computed } from 'vue';
import { highlight } from '../lib/highlight';
import { useClipboard } from '../lib/clipboard';

const props = defineProps<{
  code: string;
  lang?: string;
  filename?: string;
}>();

const highlighted = computed(() => highlight(props.code.trimEnd(), props.lang));

const { status, copy, ready } = useClipboard(() => props.code);
</script>

<template>
  <div class="hl-code" :class="{ 'has-filename': filename }">
    <div v-if="filename" class="hl-code-filename">{{ filename }}</div>
    <button
      class="hl-code-copy"
      type="button"
      aria-label="Copy code"
      :disabled="!ready"
      @click="copy"
    >
      {{ status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy' }}
    </button>
    <span class="hl-sr-only" role="status">{{
      status === 'copied'
        ? 'Code copied.'
        : status === 'failed'
          ? 'Clipboard unavailable. Select and copy the code manually.'
          : ''
    }}</span>
    <pre tabindex="0" aria-label="Code example"><code v-html="highlighted" /></pre>
  </div>
</template>
