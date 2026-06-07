import { defineComponent, h, onMounted, ref, watch } from 'vue';
import { enhanceAccordion } from '@hydrateless/enhancers';
import { useHostEnhancer } from '../internal.js';

/**
 * Accordion root. Compose with `<AccordionItem>`. The enhancer enforces
 * single-open behavior (unless `allowMultiple`) and ARIA wiring.
 */
export const Accordion = defineComponent({
  name: 'HlAccordion',
  inheritAttrs: false,
  props: {
    allowMultiple: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const host = useHostEnhancer((el) =>
      enhanceAccordion(el, { allowMultiple: props.allowMultiple }),
    );
    return () => h('div', { ...attrs, 'data-hl-accordion': '', ref: host }, slots.default?.());
  },
});

/** A `<details>`-based accordion section. Use the `summary` slot for the trigger. */
export const AccordionItem = defineComponent({
  name: 'HlAccordionItem',
  inheritAttrs: false,
  props: {
    defaultOpen: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const el = ref<HTMLDetailsElement | null>(null);
    onMounted(() => {
      if (el.value && props.defaultOpen) el.value.open = true;
    });
    watch(
      () => props.defaultOpen,
      (open) => {
        if (el.value) el.value.open = open;
      },
    );
    return () =>
      h('details', { ...attrs, ref: el }, [
        h('summary', slots.summary?.()),
        h('div', { class: 'accordion-panel' }, slots.default?.()),
      ]);
  },
});

/**
 * A single expandable section. Native `<details>` handles open/close; the
 * enhancer only matters for a mutually-exclusive group.
 */
export const Disclosure = defineComponent({
  name: 'HlDisclosure',
  inheritAttrs: false,
  props: {
    defaultOpen: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const el = ref<HTMLDetailsElement | null>(null);
    onMounted(() => {
      if (el.value && props.defaultOpen) el.value.open = true;
    });
    return () =>
      h(
        'details',
        { ...attrs, class: 'hydrateless-disclosure', 'data-hl-disclosure': '', ref: el },
        [
          h('summary', slots.summary?.()),
          h('div', { class: 'disclosure-panel' }, slots.default?.()),
        ],
      );
  },
});
