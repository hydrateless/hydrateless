import { defineComponent, h, onMounted, ref, watch, type PropType } from 'vue';
import {
  enhanceAccordion,
  enhanceDisclosure,
  type AccordionApi,
  type DisclosureApi,
} from '@hydrateless/enhancers';
import { cx } from '../internal.js';
import { useEnhancer } from '../useEnhancer.js';

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
    const { host, api } = useEnhancer<AccordionApi>(
      (el) =>
        enhanceAccordion(el, {
          allowMultiple: props.allowMultiple,
          defaultValue: props.modelValue ?? props.defaultValue,
          onValueChange: (value) => emit('update:modelValue', value),
        }),
      () => props.allowMultiple,
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
 * A single expandable section built on native `<details>`, which handles
 * open/close (and exclusive groups, via the `name` attribute) on its own.
 * Open state works uncontrolled (`defaultOpen`) or with `v-model:open`.
 */
export const Disclosure = defineComponent({
  name: 'HlDisclosure',
  inheritAttrs: false,
  props: {
    /** Controlled open state (`v-model:open`). */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Open the disclosure initially for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const { host, api } = useEnhancer<DisclosureApi>((el) =>
      enhanceDisclosure(el, {
        defaultOpen: props.open ?? props.defaultOpen,
        onOpenChange: (open) => emit('update:open', open),
      }),
    );
    watch(
      () => props.open,
      (open) => {
        if (open != null) api.value?.setOpen(open);
      },
    );
    return () =>
      h(
        'details',
        {
          ...attrs,
          class: cx('hl-disclosure', attrs.class as string),
          'data-hl-disclosure': '',
          ref: host,
        },
        [
          h('summary', slots.summary?.()),
          h('div', { class: 'hl-disclosure-panel' }, slots.default?.()),
        ],
      );
  },
});
