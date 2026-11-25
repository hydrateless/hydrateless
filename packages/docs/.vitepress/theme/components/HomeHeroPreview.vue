<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';
import type { Disposer } from '@hydrateless/enhancers';
import { componentCount } from '../../data/registry';
import { enhanceDemo } from '../lib/demo-runtime';

const stageEl = ref<HTMLElement | null>(null);
let disposer: Disposer | undefined;

onMounted(() => {
  if (stageEl.value) disposer = enhanceDemo(stageEl.value);
});
onBeforeUnmount(() => disposer?.());
</script>

<template>
  <div class="hl-hero-card">
    <div class="hl-hero-bar">
      <span class="hl-hero-bar-title">
        <span class="hl-hero-dot" aria-hidden="true" />
        <code>hydrateless.css</code>
      </span>
      <span class="hl-hero-pill">0 B JS baseline</span>
    </div>

    <div class="hl-hero-preview">
      <div ref="stageEl" class="hl-hero-stage">
        <div class="hl-card" style="max-width: none">
          <div class="hl-card-header">
            <div class="hl-hero-card-top">
              <p class="hl-card-title">Semantic HTML first</p>
              <span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Live</span>
            </div>
            <p class="hl-card-description">
              Native elements handle focus and state before any script runs.
            </p>
          </div>

          <div class="hl-card-body hl-hero-body">
            <label class="hl-switch">
              <input type="checkbox" role="switch" checked />
              Lazy-load JS enhancers
            </label>

            <details class="hl-disclosure" data-hl-disclosure>
              <summary>Built on platform primitives</summary>
              <div class="hl-disclosure-panel">
                Uses <code>&lt;details&gt;</code>, <code>&lt;dialog&gt;</code>, Popover API,
                <code>light-dark()</code>, and <code>@layer</code> natively.
              </div>
            </details>

            <div class="hl-hero-actions">
              <a class="hl-button" data-hl-intent="primary" :href="withBase('/components/')">
                Explore {{ componentCount }} primitives
              </a>
              <a class="hl-button" data-hl-variant="outline" :href="withBase('/playground/theme')">
                Try themes
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dl class="hl-hero-stats">
      <div>
        <dt>CSS bundle</dt>
        <dd>&lt; 10 kB</dd>
      </div>
      <div>
        <dt>Auto-loader</dt>
        <dd>&lt; 2 kB</dd>
      </div>
      <div>
        <dt>Primitives</dt>
        <dd>{{ componentCount }}</dd>
      </div>
      <div>
        <dt>Accessibility</dt>
        <dd>WCAG AA</dd>
      </div>
    </dl>
  </div>
</template>
