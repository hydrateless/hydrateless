<script setup lang="ts">
import { computed, ref } from 'vue';
import { useClipboard } from '../lib/clipboard';

const props = withDefaults(defineProps<{ packages?: string }>(), {
  packages: 'hydrateless @hydrateless/auto',
});

type Manager = 'npm' | 'pnpm' | 'yarn' | 'bun';
const managers: Manager[] = ['npm', 'pnpm', 'yarn', 'bun'];
const active = ref<Manager>('npm');

const commands = computed<Record<Manager, string>>(() => ({
  npm: `npm install ${props.packages}`,
  pnpm: `pnpm add ${props.packages}`,
  yarn: `yarn add ${props.packages}`,
  bun: `bun add ${props.packages}`,
}));

const { status, copy, ready } = useClipboard(() => commands.value[active.value]);
</script>

<template>
  <div class="hl-install">
    <div class="hl-install-tabs" role="group" aria-label="Package manager">
      <button
        v-for="m in managers"
        :key="m"
        type="button"
        :class="{ active: active === m }"
        :aria-pressed="active === m"
        :disabled="!ready"
        @click="active = m"
      >
        {{ m }}
      </button>
      <span class="hl-demo-spacer" />
      <button
        type="button"
        class="hl-install-copy"
        aria-label="Copy install command"
        :disabled="!ready"
        @click="copy"
      >
        {{ status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy' }}
      </button>
    </div>
    <span class="hl-sr-only" role="status">{{
      status === 'copied'
        ? 'Command copied.'
        : status === 'failed'
          ? 'Clipboard unavailable. Select and copy the command manually.'
          : ''
    }}</span>
    <pre
      class="hl-install-cmd"
      tabindex="0"
      aria-label="Install command"
    ><code>{{ commands[active] }}</code></pre>
  </div>
</template>
