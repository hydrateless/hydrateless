import { defineComponent, h, ref, type ExtractPublicPropTypes, type PropType } from 'vue';
import {
  enhanceCombobox,
  type ComboboxApi,
  type EnhanceComboboxOptions,
} from '@hydrateless/enhancers';
import { cx, useApiSync, useControlled } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';
import { useField } from './forms.js';

const comboboxProps = {
  filter: { type: Boolean as PropType<EnhanceComboboxOptions['filter']>, default: undefined },
  autoHighlight: {
    type: Boolean as PropType<EnhanceComboboxOptions['autoHighlight']>,
    default: undefined,
  },
  /** Controlled committed value (`v-model`). */
  modelValue: { type: String, default: undefined },
  /** Initial committed value for uncontrolled usage. */
  defaultValue: { type: String, default: undefined },
  /** Controlled listbox state (`v-model:open`). */
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  /** Expand the listbox initially for uncontrolled usage. */
  defaultOpen: { type: Boolean, default: false },
} as const;

/** Props for {@link Combobox}. */
export type ComboboxProps = ExtractPublicPropTypes<typeof comboboxProps>;

/**
 * Editable combobox (input + listbox), APG pattern. Compose with
 * `<ComboboxInput>`, `<ComboboxList>`, `<ComboboxOption>`. The committed
 * value works uncontrolled (`defaultValue`) or with `v-model`; the listbox
 * state with `defaultOpen` or `v-model:open`.
 */
export const Combobox = defineComponent({
  name: 'HlCombobox',
  inheritAttrs: false,
  props: comboboxProps,
  emits: ['update:modelValue', 'update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const { value, set } = useControlled<string | undefined, 'update:modelValue'>(props, emit, {
      prop: 'modelValue',
      event: 'update:modelValue',
      default: props.defaultValue,
    });
    const { value: open, set: setOpen } = useControlled<boolean | undefined, 'update:open'>(
      props,
      emit,
      { prop: 'open', event: 'update:open', default: props.defaultOpen },
    );
    const api = useEnhancer(
      host,
      enhanceCombobox,
      () => ({
        filter: props.filter,
        autoHighlight: props.autoHighlight,
        defaultValue: value.value,
        onValueChange: set,
        onOpenChange: setOpen,
      }),
      () => [props.filter, props.autoHighlight],
    );
    useApiSync<ComboboxApi, string | undefined>(
      api,
      value,
      (a) => a.value,
      (a, v) => a.setValue(v),
    );
    useApiSync<ComboboxApi, boolean | undefined>(
      api,
      open,
      (a) => a.open,
      (a, v) => a.setOpen(v),
    );
    return () => h('div', { ...attrs, 'data-hl-combobox': '', ref: host }, slots.default?.());
  },
});

const comboboxInputProps = {
  styled: { type: Boolean, default: true },
} as const;

/** Props for {@link ComboboxInput}. */
export type ComboboxInputProps = ExtractPublicPropTypes<typeof comboboxInputProps>;

/** The combobox text field. Wires itself to a surrounding `<Field>`. */
export const ComboboxInput = defineComponent({
  name: 'HlComboboxInput',
  inheritAttrs: false,
  props: comboboxInputProps,
  setup(props, { attrs }) {
    const field = useField();
    return () =>
      h('input', {
        id: field?.id,
        'aria-describedby': field?.describedBy,
        'aria-invalid': field?.invalid || undefined,
        required: field?.required || undefined,
        ...attrs,
        class: cx(props.styled && 'hl-input', attrs.class as string),
      });
  },
});

/** Props for {@link ComboboxList}. */
export type ComboboxListProps = Record<never, never>;

/** The option popup (`role="listbox"`). */
export const ComboboxList = defineComponent({
  name: 'HlComboboxList',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('ul', { ...attrs, role: 'listbox' }, slots.default?.());
  },
});

const comboboxOptionProps = {
  value: { type: String, required: true },
  disabled: { type: Boolean, default: false },
} as const;

/** Props for {@link ComboboxOption}. */
export type ComboboxOptionProps = ExtractPublicPropTypes<typeof comboboxOptionProps>;

/** A selectable option. The `value` is committed on selection; `disabled` options are skipped. */
export const ComboboxOption = defineComponent({
  name: 'HlComboboxOption',
  inheritAttrs: false,
  props: comboboxOptionProps,
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'li',
        {
          ...attrs,
          role: 'option',
          'data-hl-value': props.value,
          'aria-disabled': props.disabled || undefined,
        },
        slots.default?.() ?? props.value,
      );
  },
});
