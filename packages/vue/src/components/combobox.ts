import { defineComponent, h, watch, type PropType } from 'vue';
import {
  enhanceCombobox,
  type ComboboxApi,
  type EnhanceComboboxOptions,
} from '@hydrateless/enhancers';
import { cx, useHostEnhancer } from '../internal.js';

/**
 * Editable combobox (input + listbox), APG pattern. Compose with
 * `<ComboboxInput>`, `<ComboboxList>`, `<ComboboxOption>`. The committed
 * value works uncontrolled (`defaultValue`) or with `v-model`; selection also
 * emits `select`.
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
    /** Controlled committed value (`v-model`). */
    modelValue: { type: String, default: undefined },
    /** Initial committed value for uncontrolled usage. */
    defaultValue: { type: String, default: undefined },
  },
  emits: ['select', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const { host, api } = useHostEnhancer<ComboboxApi>((el) =>
      enhanceCombobox(el, {
        filter: props.filter,
        autoHighlight: props.autoHighlight,
        defaultValue: props.modelValue ?? props.defaultValue,
        onValueChange: (value) => {
          emit('select', value);
          emit('update:modelValue', value);
        },
      }),
    );
    watch(
      () => props.modelValue,
      (value) => {
        if (value != null) api.value?.setValue(value);
      },
    );
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
