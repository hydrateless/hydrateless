import { defineComponent, h, onBeforeUnmount, onMounted, ref, type PropType } from 'vue';
import { enhanceCombobox, type EnhanceComboboxOptions } from '@hydrateless/enhancers';
import { cx } from '../internal.js';

/**
 * Editable combobox (input + listbox), APG pattern. Compose with
 * `<ComboboxInput>`, `<ComboboxList>`, `<ComboboxOption>`. Emits
 * `update:value` (and `select`) with the committed value.
 */
export const Combobox = defineComponent({
  name: 'HlCombobox',
  inheritAttrs: false,
  props: {
    filter: { type: Boolean as PropType<EnhanceComboboxOptions['filter']>, default: undefined },
    autoHighlight: {
      type: Boolean as PropType<EnhanceComboboxOptions['autoHighlight']>,
      default: undefined,
    },
  },
  emits: ['select', 'update:value'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    let dispose: (() => void) | null = null;
    const onSelect = (e: Event) => {
      const value = (e as CustomEvent).detail.value as string;
      emit('select', value);
      emit('update:value', value);
    };
    onMounted(() => {
      if (!host.value) return;
      dispose = enhanceCombobox(host.value, {
        filter: props.filter,
        autoHighlight: props.autoHighlight,
      });
      host.value.addEventListener('hl:select', onSelect);
    });
    onBeforeUnmount(() => {
      host.value?.removeEventListener('hl:select', onSelect);
      dispose?.();
      dispose = null;
    });
    return () => h('div', { ...attrs, 'data-hl-combobox': '', ref: host }, slots.default?.());
  },
});

/** The combobox text field. */
export const ComboboxInput = defineComponent({
  name: 'HlComboboxInput',
  inheritAttrs: false,
  props: {
    styled: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    return () =>
      h('input', { ...attrs, class: cx(props.styled && 'hl-input', attrs.class as string) });
  },
});

/** The option popup (`role="listbox"`). */
export const ComboboxList = defineComponent({
  name: 'HlComboboxList',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('ul', { ...attrs, role: 'listbox', hidden: true }, slots.default?.());
  },
});

/** A selectable option. The `value` is committed on selection. */
export const ComboboxOption = defineComponent({
  name: 'HlComboboxOption',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'li',
        { ...attrs, role: 'option', 'data-hl-value': props.value },
        slots.default?.() ?? props.value,
      );
  },
});
