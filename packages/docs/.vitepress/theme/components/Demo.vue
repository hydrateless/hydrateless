<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useData } from 'vitepress';
import type { Disposer } from '@hydrateless/enhancers';
import type { DemoDef, KnobValues } from '../../data/types';
import { FRAMEWORK_LANGS, useFramework } from '../../shared/framework';
import { enhanceDemo } from '../lib/demo-runtime';
import Knobs from './Knobs.vue';
import CodeView from './CodeView.vue';
import FrameworkSwitcher from './FrameworkSwitcher.vue';

// `demo` drives the rich, data-driven mode (knobs + per-framework code). With
// no `demo`, the default slot is rendered as the live preview, which lets the
// guide pages wrap raw markup in the same controllable frame.
const props = defineProps<{ demo?: DemoDef; layout?: string }>();

const { isDark } = useData();
const { framework } = useFramework();

const defaults = (): KnobValues => {
  const out: KnobValues = {};
  for (const knob of props.demo?.knobs ?? []) out[knob.id] = knob.default;
  return out;
};

const values = reactive<KnobValues>(defaults());
const theme = ref<'auto' | 'light' | 'dark'>('auto');
const dir = ref<'ltr' | 'rtl'>('ltr');
const jsEnabled = ref(true);
const showCode = ref(false);

const stageEl = ref<HTMLElement | null>(null);
let disposer: Disposer | undefined;

const layout = computed(() => props.demo?.layout ?? props.layout ?? 'row');
const previewHtml = computed(() => (props.demo ? props.demo.render({ ...values }) : ''));

const effectiveTheme = computed(() =>
  theme.value === 'auto' ? (isDark.value ? 'dark' : 'light') : theme.value,
);

const hasFrameworkCode = computed(() => {
  const code = props.demo?.code;
  return Boolean(code && (code.react || code.vue || code.svelte));
});
const displayFramework = computed(() => (hasFrameworkCode.value ? framework.value : 'html'));

const snippet = computed(() => {
  if (!props.demo) return '';
  const fn = props.demo.code?.[displayFramework.value];
  return fn ? fn({ ...values }) : props.demo.render({ ...values });
});
const snippetLang = computed(() => FRAMEWORK_LANGS[displayFramework.value]);

function teardown() {
  disposer?.();
  disposer = undefined;
}

async function applyEnhancers() {
  teardown();
  await nextTick();
  const root = stageEl.value;
  if (!root || !jsEnabled.value) return;
  disposer = enhanceDemo(root);
}

onMounted(() => void applyEnhancers());
watch(previewHtml, () => void applyEnhancers());
watch(jsEnabled, () => void applyEnhancers());
onBeforeUnmount(teardown);

function reset() {
  Object.assign(values, defaults());
  theme.value = 'auto';
  dir.value = 'ltr';
  jsEnabled.value = true;
}
function cycleTheme() {
  theme.value = theme.value === 'auto' ? 'light' : theme.value === 'light' ? 'dark' : 'auto';
}
function renderInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
</script>

<template>
  <section class="hl-demo-block">
    <header v-if="demo?.title || demo?.description" class="hl-demo-head">
      <h3 v-if="demo?.title" :id="`demo-${demo.id}`">{{ demo.title }}</h3>
      <p v-if="demo?.description" v-html="renderInline(demo.description)" />
    </header>

    <div class="hl-demo-frame">
      <div class="hl-demo-toolbar">
        <span class="hl-demo-tag">Live</span>
        <span class="hl-demo-spacer" />
        <button type="button" class="hl-demo-btn" @click="cycleTheme">
          Theme: {{ theme === 'auto' ? 'Auto' : theme === 'light' ? 'Light' : 'Dark' }}
        </button>
        <button
          type="button"
          class="hl-demo-btn"
          :aria-pressed="dir === 'rtl'"
          @click="dir = dir === 'ltr' ? 'rtl' : 'ltr'"
        >
          {{ dir.toUpperCase() }}
        </button>
        <button
          type="button"
          class="hl-demo-btn"
          :class="{ off: !jsEnabled }"
          :aria-pressed="!jsEnabled"
          :title="jsEnabled ? 'Disable JavaScript enhancers' : 'Enable JavaScript enhancers'"
          @click="jsEnabled = !jsEnabled"
        >
          JS: {{ jsEnabled ? 'On' : 'Off' }}
        </button>
        <button type="button" class="hl-demo-btn" @click="reset">Reset</button>
      </div>

      <div class="hl-demo-preview" :data-theme="effectiveTheme" :dir="dir">
        <div
          v-if="demo"
          ref="stageEl"
          class="hl-demo-stage"
          :class="`is-${layout}`"
          v-html="previewHtml"
        />
        <div v-else ref="stageEl" class="hl-demo-stage" :class="`is-${layout}`"><slot /></div>
      </div>

      <Knobs
        v-if="demo?.knobs?.length"
        :knobs="demo.knobs"
        :values="values"
        @change="(id, val) => (values[id] = val)"
      />
    </div>

    <div v-if="demo" class="hl-demo-code">
      <div class="hl-demo-code-bar">
        <button type="button" class="hl-demo-btn" @click="showCode = !showCode">
          {{ showCode ? 'Hide code' : 'Show code' }}
        </button>
        <FrameworkSwitcher v-if="showCode && hasFrameworkCode" />
      </div>
      <CodeView v-if="showCode" :code="snippet" :lang="snippetLang" />
    </div>
  </section>
</template>
