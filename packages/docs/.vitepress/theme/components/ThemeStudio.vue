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

// Choose the higher-contrast foreground using relative luminance.
function foreground(hex: string): string {
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

const vars = computed<Record<string, string>>(() => {
  const [h, s, l] = hexToHsl(state.primary);
  const dark = state.mode === 'dark';
  const r = state.radius;
  const primaryFg = foreground(state.primary);
  const hoverDirection = primaryFg === '#000000' ? 1 : -1;
  return {
    '--hl-primary': hsl(h, s, l),
    '--hl-primary-hover': hsl(h, s, clamp(l + hoverDirection * 8)),
    '--hl-primary-active': hsl(h, s, clamp(l + hoverDirection * 16)),
    '--hl-primary-fg': primaryFg,
    '--hl-primary-subtle': dark ? hsl(h, clamp(s - 20), 22, 0.5) : hsl(h, clamp(s + 10), 95),
    '--hl-primary-subtle-fg': dark ? hsl(h, clamp(s - 10), 80) : hsl(h, s, 20),
    '--hl-ring': hsl(h, s, l),
    '--hl-focus-ring': 'var(--hl-border-width-2) solid var(--hl-ring)',
    '--hl-focus-shadow': '0 0 0 3px color-mix(in oklab, var(--hl-ring) 30%, transparent)',
    '--hl-border': state.border,
    '--hl-border-strong': state.border,
    '--hl-radius-xs': `${Math.round(r * 0.25)}px`,
    '--hl-radius-sm': `${Math.round(r * 0.5)}px`,
    '--hl-radius-md': `${r}px`,
    '--hl-radius-lg': `${Math.round(r * 1.5)}px`,
    '--hl-radius-xl': `${Math.round(r * 2)}px`,
    '--hl-radius-2xl': `${Math.round(r * 2.5)}px`,
    '--hl-text-base': `${state.size}px`,
    '--hl-text-xs': `${state.size * 0.75}px`,
    '--hl-text-sm': `${state.size * 0.875}px`,
    '--hl-text-lg': `${state.size * 1.125}px`,
    '--hl-text-xl': `${state.size * 1.25}px`,
    '--hl-font-sans': FONTS[state.font],
  };
});

const cssText = computed(() => {
  const lines = Object.entries(vars.value).map(([k, v]) => `  ${k}: ${v};`);
  return `:root {\n  color-scheme: ${state.mode};\n${lines.join('\n')}\n}`;
});

const previewEl = ref<HTMLElement | null>(null);
let disposer: Disposer | undefined;
const revision = ref(0);
const mounted = ref(false);
function enhance() {
  if (previewEl.value) disposer = enhanceDemo(previewEl.value);
}
onMounted(() => {
  enhance();
  mounted.value = true;
});
onBeforeUnmount(() => disposer?.());
watch(revision, () => disposer?.(), { flush: 'pre' });
watch(revision, enhance, { flush: 'post' });

function reset() {
  Object.assign(state, defaults());
  revision.value += 1;
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
      <label class="hl-label" for="studio-workspace">Workspace name</label>
      <input id="studio-workspace" class="hl-input" value="Hydrateless" />
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
      <div role="tablist" aria-label="Project">
        <button role="tab" id="studio-overview" aria-controls="studio-overview-panel" aria-selected="true">Overview</button>
        <button role="tab" id="studio-activity" aria-controls="studio-activity-panel" aria-selected="false" tabindex="-1">Activity</button>
      </div>
      <div role="tabpanel" id="studio-overview-panel" aria-labelledby="studio-overview" tabindex="0">Tabs, accordions, and the rest pick up your tokens too.</div>
      <div role="tabpanel" id="studio-activity-panel" aria-labelledby="studio-activity" tabindex="0" hidden>Second panel.</div>
    </div>
  </div>
</div>`;
</script>

<template>
  <div class="hl-studio">
    <div class="hl-studio-controls">
      <label class="hl-knob">
        <span class="hl-knob-label">Primary color</span>
        <input
          :disabled="!mounted"
          type="color"
          aria-label="Primary color"
          v-model="state.primary"
        />
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Border color</span>
        <input :disabled="!mounted" type="color" aria-label="Border color" v-model="state.border" />
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Radius</span>
        <span class="hl-knob-range">
          <input
            :disabled="!mounted"
            type="range"
            min="0"
            max="24"
            step="1"
            aria-label="Radius"
            v-model.number="state.radius"
          />
          <output>{{ state.radius }}px</output>
        </span>
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Base size</span>
        <span class="hl-knob-range">
          <input
            :disabled="!mounted"
            type="range"
            min="14"
            max="18"
            step="1"
            aria-label="Base size"
            v-model.number="state.size"
          />
          <output>{{ state.size }}px</output>
        </span>
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Font</span>
        <select :disabled="!mounted" class="hl-knob-select" aria-label="Font" v-model="state.font">
          <option v-for="(_, name) in FONTS" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>
      <label class="hl-knob">
        <span class="hl-knob-label">Mode</span>
        <select :disabled="!mounted" class="hl-knob-select" aria-label="Mode" v-model="state.mode">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <button :disabled="!mounted" type="button" class="hl-demo-btn" @click="reset">Reset</button>
    </div>

    <div
      :key="revision"
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
