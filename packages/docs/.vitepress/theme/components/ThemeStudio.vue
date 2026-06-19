<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import type { Disposer } from '@hydrateless/enhancers';
import { enhanceDemo } from '../lib/demo-runtime';
import CodeView from './CodeView.vue';

interface ThemeState {
  primary: string;
  border: string;
  radius: number;
  size: number;
  font: string;
  mode: 'light' | 'dark';
}

const FONTS: Record<string, string> = {
  System: `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', roboto, helvetica, arial, sans-serif`,
  Geometric: `'Avenir Next', 'Segoe UI', system-ui, sans-serif`,
  Serif: `Georgia, 'Times New Roman', serif`,
  Mono: `ui-monospace, sfmono-regular, 'SF Mono', menlo, consolas, monospace`,
};

const defaults = (): ThemeState => ({
  primary: '#3b82f6',
  border: '#e2e8f0',
  radius: 8,
  size: 16,
  font: 'System',
  mode: 'light',
});

const state = reactive<ThemeState>(defaults());

function hexToHsl(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));
function hsl(h: number, s: number, l: number, a = 1): string {
  return a === 1 ? `hsl(${h}deg ${s}% ${l}%)` : `hsl(${h}deg ${s}% ${l}% / ${a})`;
}

const vars = computed<Record<string, string>>(() => {
  const [h, s, l] = hexToHsl(state.primary);
  const dark = state.mode === 'dark';
  const r = state.radius;
  return {
    '--hl-primary': hsl(h, s, l),
    '--hl-primary-hover': hsl(h, s, clamp(l + (dark ? 8 : -8))),
    '--hl-primary-active': hsl(h, s, clamp(l + (dark ? 16 : -16))),
    '--hl-primary-fg': l > 60 ? hsl(h, 30, 12) : 'hsl(0deg 0% 100%)',
    '--hl-primary-subtle': dark ? hsl(h, clamp(s - 20), 22, 0.5) : hsl(h, clamp(s + 10), 95),
    '--hl-primary-subtle-fg': dark ? hsl(h, clamp(s - 10), 80) : hsl(h, s, clamp(l - 12)),
    '--hl-ring': hsl(h, s, l),
    '--hl-border': state.border,
    '--hl-border-strong': state.border,
    '--hl-radius-xs': `${Math.round(r * 0.25)}px`,
    '--hl-radius-sm': `${Math.round(r * 0.5)}px`,
    '--hl-radius-md': `${r}px`,
    '--hl-radius-lg': `${Math.round(r * 1.5)}px`,
    '--hl-radius-xl': `${Math.round(r * 2)}px`,
    '--hl-radius-2xl': `${Math.round(r * 2.5)}px`,
    '--hl-text-base': `${state.size}px`,
    '--hl-font-sans': FONTS[state.font],
  };
});

const cssText = computed(() => {
  const lines = Object.entries(vars.value).map(([k, v]) => `  ${k}: ${v};`);
  return `:root {\n${lines.join('\n')}\n}`;
});

const previewEl = ref<HTMLElement | null>(null);
let disposer: Disposer | undefined;
onMounted(() => {
  if (previewEl.value) disposer = enhanceDemo(previewEl.value);
});
onBeforeUnmount(() => disposer?.());

// Re-enhance if the markup ever changes (it does not today, but keeps the tabs
// demo robust against future edits).
watch(
  () => state.mode,
  () => {
    /* mode only flips data-theme; no re-enhance needed */
  },
);

function reset() {
  Object.assign(state, defaults());
}

const preview = `
<div class="hl-card" style="max-width:none">
  <div class="hl-card-header">
    <h3 class="hl-card-title">Project settings</h3>
    <p class="hl-card-description">Preview your theme across real components.</p>
  </div>
  <div class="hl-card-body" style="display:grid;gap:1rem">
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
      <button class="hl-button" data-hl-intent="primary">Save</button>
      <button class="hl-button" data-hl-intent="primary" data-hl-variant="soft">Soft</button>
      <button class="hl-button" data-hl-variant="outline">Outline</button>
      <span class="hl-badge" data-hl-intent="primary">New</span>
      <span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Active</span>
    </div>
    <div class="hl-field">
      <label class="hl-label">Workspace name</label>
      <input class="hl-input" value="Hydrateless" />
    </div>
    <label data-hl-switch>
      <input type="checkbox" role="switch" checked />
      Enable notifications
    </label>
    <div class="hl-alert" data-hl-intent="info" role="status">
      <div class="hl-alert-body">
        <p style="margin:0">Your changes preview live as you edit tokens.</p>
      </div>
    </div>
    <div data-hl-tabs>
      <div role="tablist">
        <button role="tab">Overview</button>
        <button role="tab">Activity</button>
      </div>
      <div role="tabpanel">Tabs, accordions, and the rest pick up your tokens too.</div>
      <div role="tabpanel">Second panel.</div>
    </div>
  </div>
</div>`;
</script>

<template>
  <div class="hl-studio">
    <div class="hl-studio-controls">
      <label class="hl-knob">
        <span class="hl-knob-label">Primary color</span>
        <input type="color" v-model="state.primary" />
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Border color</span>
        <input type="color" v-model="state.border" />
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Radius</span>
        <span class="hl-knob-range">
          <input type="range" min="0" max="24" step="1" v-model.number="state.radius" />
          <output>{{ state.radius }}px</output>
        </span>
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Base size</span>
        <span class="hl-knob-range">
          <input type="range" min="14" max="18" step="1" v-model.number="state.size" />
          <output>{{ state.size }}px</output>
        </span>
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Font</span>
        <select class="hl-knob-select" v-model="state.font">
          <option v-for="(_, name) in FONTS" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Mode</span>
        <select class="hl-knob-select" v-model="state.mode">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <button type="button" class="hl-demo-btn" @click="reset">Reset</button>
    </div>

    <div
      ref="previewEl"
      class="hl-studio-preview"
      :data-theme="state.mode"
      :style="vars"
      v-html="preview"
    />

    <div class="hl-studio-output">
      <p>Drop this into your global stylesheet to apply the theme:</p>
      <CodeView :code="cssText" lang="css" />
    </div>
  </div>
</template>
