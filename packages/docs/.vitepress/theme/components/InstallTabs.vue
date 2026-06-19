<script setup lang="ts">
import { computed, ref } from 'vue';

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

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
async function copy() {
  try {
    await navigator.clipboard.writeText(commands.value[active.value]);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1500);
  } catch {
    // ignore
  }
}
</script>

<template>
  <div class="hl-install">
    <div class="hl-install-tabs">
      <button
        v-for="m in managers"
        :key="m"
        type="button"
        :class="{ active: active === m }"
        @click="active = m"
      >
        {{ m }}
      </button>
      <span class="hl-demo-spacer" />
      <button type="button" class="hl-install-copy" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="hl-install-cmd"><code>{{ commands[active] }}</code></pre>
  </div>
</template>
