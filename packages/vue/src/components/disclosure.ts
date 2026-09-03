import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  ref,
  type ComputedRef,
  type ExtractPublicPropTypes,
  type InjectionKey,
  type PropType,
} from 'vue';
import {
  enhanceAccordion,
  enhanceDisclosure,
  type AccordionApi,
  type DisclosureApi,
} from '@hydrateless/enhancers';
import { cx, useApiSync, useControlled } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

interface AccordionContext {
  value: ComputedRef<string[] | undefined>;
  /** Claim the next item index; the enhancer falls back to it too. */
  register: () => number;
}
const AccordionKey: InjectionKey<AccordionContext> = Symbol('hl-accordion');

const accordionProps = {
  allowMultiple: { type: Boolean, default: false },
  /** Controlled list of open item values (`v-model`). */
  modelValue: { type: Array as PropType<string[]>, default: undefined },
  /** Initially open item values for uncontrolled usage. */
  defaultValue: { type: Array as PropType<string[]>, default: undefined },
} as const;

/** Props for {@link Accordion}. */
export type AccordionProps = ExtractPublicPropTypes<typeof accordionProps>;

/**
 * Accordion root of native `<details>` items. Compose with `<AccordionItem>`.
 * Item values come from each `<AccordionItem value>`, defaulting to the index;
 * open state works uncontrolled (`defaultValue`) or with `v-model`.
 */
export const Accordion = defineComponent({
  name: 'HlAccordion',
  inheritAttrs: false,
  props: accordionProps,
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const { value, set } = useControlled<string[] | undefined, 'update:modelValue'>(props, emit, {
      prop: 'modelValue',
      event: 'update:modelValue',
      default: props.defaultValue,
    });
    const api = useEnhancer(
      host,
      enhanceAccordion,
      () => ({
        allowMultiple: props.allowMultiple,
        defaultValue: value.value,
        onValueChange: set,
      }),
      () => props.allowMultiple,
    );
    useApiSync<AccordionApi, string[] | undefined>(
      api,
      value,
      (a) => a.value,
      (a, v) => a.setValue(v),
    );
    let count = 0;
    provide(AccordionKey, { value, register: () => count++ });
    return () => h('div', { ...attrs, 'data-hl-accordion': '', ref: host }, slots.default?.());
  },
});

const accordionItemProps = {
  /** Stable value identifying this item; defaults to its index. */
  value: { type: String, default: undefined },
  /** Header text; the `summary` slot takes precedence. */
  title: { type: String, default: undefined },
} as const;

/** Props for {@link AccordionItem}. */
export type AccordionItemProps = ExtractPublicPropTypes<typeof accordionItemProps>;

/** A `<details>`-based accordion section. Use `title` or the `summary` slot for the header. */
export const AccordionItem = defineComponent({
  name: 'HlAccordionItem',
  inheritAttrs: false,
  props: accordionItemProps,
  setup(props, { slots, attrs }) {
    const ctx = inject(AccordionKey, null);
    const index = ctx?.register();
    // Rendered open state keeps server output right before the enhancer runs.
    const open = computed(() => ctx?.value.value?.includes(props.value ?? String(index)));
    return () =>
      h('details', { ...attrs, 'data-hl-value': props.value, open: open.value || undefined }, [
        h('summary', slots.summary?.() ?? props.title),
        h('div', { class: 'hl-accordion-panel' }, slots.default?.()),
      ]);
  },
});

const disclosureProps = {
  /** Controlled open state (`v-model:open`). */
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  /** Open the disclosure initially for uncontrolled usage. */
  defaultOpen: { type: Boolean, default: false },
  /** Header text; the `summary` slot takes precedence. */
  title: { type: String, default: undefined },
} as const;

/** Props for {@link Disclosure}. */
export type DisclosureProps = ExtractPublicPropTypes<typeof disclosureProps>;

/**
 * A single expandable section built on native `<details>`, which handles
 * open/close (and exclusive groups, via the `name` attribute) on its own.
 * Open state works uncontrolled (`defaultOpen`) or with `v-model:open`.
 */
export const Disclosure = defineComponent({
  name: 'HlDisclosure',
  inheritAttrs: false,
  props: disclosureProps,
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const { value: open, set } = useControlled<boolean | undefined, 'update:open'>(props, emit, {
      prop: 'open',
      event: 'update:open',
      default: props.defaultOpen,
    });
    const api = useEnhancer(host, enhanceDisclosure, () => ({
      defaultOpen: open.value,
      onOpenChange: set,
    }));
    useApiSync<DisclosureApi, boolean | undefined>(
      api,
      open,
      (a) => a.open,
      (a, v) => a.setOpen(v),
    );
    return () =>
      h(
        'details',
        {
          ...attrs,
          class: cx('hl-disclosure', attrs.class as string),
          'data-hl-disclosure': '',
          open: open.value || undefined,
          ref: host,
        },
        [
          h('summary', slots.summary?.() ?? props.title),
          h('div', { class: 'hl-disclosure-panel' }, slots.default?.()),
        ],
      );
  },
});
