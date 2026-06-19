<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { getComponent } from '../../data/registry';
import Demo from './Demo.vue';
import ComponentMeta from './ComponentMeta.vue';
import PropsTable from './PropsTable.vue';
import EventsTable from './EventsTable.vue';
import TokensTable from './TokensTable.vue';
import CodeView from './CodeView.vue';

const props = defineProps<{ slug: string }>();
const doc = computed(() => getComponent(props.slug));

const related = computed(() =>
  (doc.value?.related ?? [])
    .map((slug) => getComponent(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c)),
);

const enhancerSnippet = computed(() => {
  const e = doc.value?.enhancer;
  if (!e) return '';
  return `import { ${e.fn} } from '${e.subpath}';\n\nconst handle = ${e.signature ?? `${e.fn}(document)`};\n// handle.api  -> imperative controls\n// handle.destroy()  -> tear everything down`;
});

function renderInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
</script>

<template>
  <div v-if="doc" class="hl-cmp">
    <header class="hl-cmp-head">
      <p class="hl-cmp-cat">{{ doc.category }}</p>
      <h1>{{ doc.name }}</h1>
      <p class="hl-cmp-summary">{{ doc.summary }}</p>
      <ComponentMeta :slug="doc.slug" />
    </header>

    <p class="hl-cmp-desc" v-html="renderInline(doc.description)" />

    <Demo v-for="demo in doc.demos" :key="demo.id" :demo="demo" />

    <section v-if="doc.enhancer" class="hl-section">
      <h2 id="javascript">JavaScript</h2>
      <p>
        This component ships an optional enhancer. With
        <a :href="withBase('/guide/getting-started')">auto-init</a> it loads automatically; to wire
        it yourself, import it directly:
      </p>
      <CodeView :code="enhancerSnippet" lang="ts" />
    </section>

    <section v-if="doc.props?.length" class="hl-section">
      <h2 id="props">Props</h2>
      <p>The framework bindings expose these props (and forward the rest to the root element).</p>
      <PropsTable :slug="doc.slug" />
    </section>

    <section v-if="doc.events?.length" class="hl-section">
      <h2 id="events">Events and callbacks</h2>
      <EventsTable :slug="doc.slug" />
    </section>

    <section v-if="doc.tokens?.length" class="hl-section">
      <h2 id="css-variables">CSS variables</h2>
      <p>
        Override these on any ancestor to theme the component. See the
        <a :href="withBase('/playground/theme')">theme studio</a> to preview changes live.
      </p>
      <TokensTable :slug="doc.slug" />
    </section>

    <section v-if="doc.a11y?.length" class="hl-section">
      <h2 id="accessibility">Accessibility</h2>
      <ul class="hl-a11y">
        <li v-for="(note, i) in doc.a11y" :key="i" v-html="renderInline(note)" />
      </ul>
    </section>

    <section v-if="related.length" class="hl-section hl-related">
      <h2 id="related">Related</h2>
      <div class="hl-related-grid">
        <a
          v-for="r in related"
          :key="r.slug"
          :href="withBase(`/components/${r.slug}`)"
          class="hl-related-card"
        >
          <strong>{{ r.name }}</strong>
          <span>{{ r.summary }}</span>
        </a>
      </div>
    </section>
  </div>
  <div v-else class="hl-cmp-missing">Unknown component: {{ slug }}</div>
</template>
