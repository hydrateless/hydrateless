<script setup lang="ts">
import { withBase } from 'vitepress';
import { componentsByCategory, componentCount } from '../../data/registry';

const groups = componentsByCategory();
</script>

<template>
  <div class="hl-gallery">
    <p class="hl-gallery-count">{{ componentCount }} components and primitives</p>
    <section v-for="group in groups" :key="group.category" class="hl-gallery-group">
      <h2 :id="group.category.toLowerCase().replace(/[^a-z]+/g, '-')">{{ group.category }}</h2>
      <div class="hl-gallery-grid">
        <a
          v-for="c in group.items"
          :key="c.slug"
          :href="withBase(`/components/${c.slug}`)"
          class="hl-gallery-card"
        >
          <span class="hl-gallery-name">
            {{ c.name }}
            <span v-if="c.cssOnly" class="hl-dot is-css" title="Works with no JavaScript" />
            <span v-else class="hl-dot is-js" title="Uses an optional JS enhancer" />
          </span>
          <span class="hl-gallery-summary">{{ c.summary }}</span>
        </a>
      </div>
    </section>
  </div>
</template>
