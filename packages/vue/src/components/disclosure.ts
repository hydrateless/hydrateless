import { defineComponent, h, onMounted, ref, watch, type PropType } from 'vue';
import { enhanceAccordion, type AccordionApi } from '@hydrateless/enhancers';
import { cx, useHostEnhancer } from '../internal.js';

/**
 * Accordion root of native `<details>` items. Compose with `<AccordionItem>`.
 * Item values come from each `<AccordionItem value>`, defaulting to the index;
 * open state works uncontrolled (`defaultValue` or `defaultOpen` on items) or
 * with `v-model`.
 */
export const Accordion = defineComponent({
  name: 'HlAccordion',
  inheritAttrs: false,
  props: {
    allowMultiple: { type: Boolean, default: false },
    /** Controlled list of open item values (`v-model`). */
    modelValue: { type: Array as PropType<string[]>, default: undefined },
    /** Initially open item values for uncontrolled usage. */
    defaultValue: { type: Array as PropType<string[]>, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const { host, api } = useHostEnhancer<AccordionApi>((el) =>
      enhanceAccordion(el, {
        allowMultiple: props.allowMultiple,
        defaultValue: props.modelValue ?? props.defaultValue,
        onValueChange: (value) => emit('update:modelValue', value),
      }),
    );
    watch(
      () => props.modelValue,
      (value) => {
        if (value != null) api.value?.setValue(value);
      },
    );
    return () => h('div', { ...attrs, 'data-hl-accordion': '', ref: host }, slots.default?.());
  },
});

/** A `<details>`-based accordion section. Use the `summary` slot for the trigger. */
export const AccordionItem = defineComponent({
  name: 'HlAccordionItem',
  inheritAttrs: false,
  props: {
    /** Stable value identifying this item; defaults to its index. */
    value: { type: String, default: undefined },
    defaultOpen: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const el = ref<HTMLDetailsElement | null>(null);
    onMounted(() => {
      if (el.value && props.defaultOpen) el.value.open = true;
    });
    return () =>
      h('details', { ...attrs, 'data-hl-value': props.value, ref: el }, [
        h('summary', slots.summary?.()),
        h('div', { class: 'hl-accordion-panel' }, slots.default?.()),
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
        {
          ...attrs,
          class: cx('hl-disclosure', attrs.class as string),
          'data-hl-disclosure': '',
          ref: el,
        },
        [
          h('summary', slots.summary?.()),
          h('div', { class: 'hl-disclosure-panel' }, slots.default?.()),
        ],
      );
  },
});
