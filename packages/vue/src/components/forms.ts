import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  type InjectionKey,
  type PropType,
} from 'vue';
import { cx } from '../internal.js';

type Size = 'sm' | 'md' | 'lg';

/* ------------------------------------------------------------------ Field -- */

interface FieldContext {
  id: string;
  helpId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
}

const FieldKey: InjectionKey<FieldContext> = Symbol('hl-field');
let fieldCounter = 0;

/**
 * Layout + accessibility wrapper for a control. Provides a shared id so
 * `<FieldLabel>`, `<FieldHelp>`, and `<FieldError>` wire up automatically.
 * Bind the control with `v-bind="useField()"` or place an `<Input>` inside.
 */
export const Field = defineComponent({
  name: 'HlField',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    invalid: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const baseId = props.id ?? `hl-field-${(fieldCounter += 1)}`;
    provide(FieldKey, {
      id: baseId,
      helpId: `${baseId}-help`,
      errorId: `${baseId}-error`,
      invalid: props.invalid,
      required: props.required,
    });
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('hl-field', attrs.class as string),
          'data-hl-invalid': props.invalid || undefined,
        },
        slots.default?.(),
      );
  },
});

/** Returns props (`id`, `aria-describedby`, `aria-invalid`) to bind onto a control. */
export function useFieldBindings() {
  const ctx = inject(FieldKey, null);
  if (!ctx) return {};
  const describedBy = [ctx.helpId, ctx.invalid ? ctx.errorId : null].filter(Boolean).join(' ');
  return {
    id: ctx.id,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': ctx.invalid || undefined,
  };
}

/** Label for a {@link Field}'s control, associated with it by id. */
export const FieldLabel = defineComponent({
  name: 'HlFieldLabel',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = inject(FieldKey, null);
    return () =>
      h(
        'label',
        {
          ...attrs,
          for: (attrs.for as string) ?? ctx?.id,
          class: cx('hl-label', attrs.class as string),
          'data-hl-required': ctx?.required || undefined,
        },
        slots.default?.(),
      );
  },
});

/** Help text for a {@link Field}, linked to its control via `aria-describedby`. */
export const FieldHelp = defineComponent({
  name: 'HlFieldHelp',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = inject(FieldKey, null);
    return () =>
      h(
        'p',
        { ...attrs, id: ctx?.helpId, class: cx('hl-help', attrs.class as string) },
        slots.default?.(),
      );
  },
});

/** Validation message for a {@link Field}; renders nothing until it has content. */
export const FieldError = defineComponent({
  name: 'HlFieldError',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = inject(FieldKey, null);
    return () => {
      const content = slots.default?.();
      if (!content || (Array.isArray(content) && content.length === 0)) return null;
      return h(
        'p',
        { ...attrs, id: ctx?.errorId, role: 'alert', class: cx('hl-error', attrs.class as string) },
        content,
      );
    };
  },
});

/** Groups related controls in a native fieldset with an optional `legend` slot. */
export const Fieldset = defineComponent({
  name: 'HlFieldset',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => {
      const children = [];
      if (slots.legend) children.push(h('legend', { class: 'hl-legend' }, slots.legend()));
      if (slots.default) children.push(...(slots.default() as never[]));
      return h('fieldset', { ...attrs, class: cx('hl-fieldset', attrs.class as string) }, children);
    };
  },
});

/* --------------------------------------------------------------- Controls -- */

/** Text input styled with the `hl-input` primitive. Supports `v-model`. */
export const Input = defineComponent({
  name: 'HlInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number], default: undefined },
    size: { type: String as PropType<Size>, default: undefined },
    invalid: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const field = useFieldBindings();
    return () =>
      h('input', {
        ...field,
        ...attrs,
        class: cx('hl-input', attrs.class as string),
        'data-hl-size': props.size,
        'data-hl-invalid': props.invalid || undefined,
        'aria-invalid': props.invalid || (attrs['aria-invalid'] as boolean) || undefined,
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
      });
  },
});

/** Multi-line text input. Supports `v-model`. */
export const Textarea = defineComponent({
  name: 'HlTextarea',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
    size: { type: String as PropType<Size>, default: undefined },
    invalid: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const field = useFieldBindings();
    return () =>
      h('textarea', {
        ...field,
        ...attrs,
        class: cx('hl-textarea', attrs.class as string),
        'data-hl-size': props.size,
        'data-hl-invalid': props.invalid || undefined,
        'aria-invalid': props.invalid || undefined,
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value),
      });
  },
});

/** Native `<select>` styled with `hl-select`. Supports `v-model`. */
export const Select = defineComponent({
  name: 'HlSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
    size: { type: String as PropType<Size>, default: undefined },
    invalid: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const field = useFieldBindings();
    return () =>
      h('span', { class: 'hl-select-wrapper' }, [
        h(
          'select',
          {
            ...field,
            ...attrs,
            class: cx('hl-select', attrs.class as string),
            'data-hl-size': props.size,
            'data-hl-invalid': props.invalid || undefined,
            'aria-invalid': props.invalid || undefined,
            value: props.modelValue,
            onChange: (e: Event) =>
              emit('update:modelValue', (e.target as HTMLSelectElement).value),
          },
          slots.default?.(),
        ),
      ]);
  },
});

/** Checkbox built on a native input, label-wrapped. Supports `v-model`. */
export const Checkbox = defineComponent({
  name: 'HlCheckbox',
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    return () =>
      h('label', { class: cx('hl-checkbox', attrs.class as string) }, [
        h('input', {
          ...attrs,
          class: undefined,
          type: 'checkbox',
          checked: props.modelValue,
          onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).checked),
        }),
        slots.default ? h('span', slots.default()) : null,
      ]);
  },
});

/** Toggle switch built on a native checkbox. Supports `v-model`. */
export const Switch = defineComponent({
  name: 'HlSwitch',
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    return () =>
      h('label', { 'data-hl-switch': '', class: attrs.class as string }, [
        h('input', {
          ...attrs,
          class: undefined,
          type: 'checkbox',
          role: 'switch',
          checked: props.modelValue,
          onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).checked),
        }),
        slots.default?.(),
      ]);
  },
});

/** Range slider primitive. Supports `v-model`. */
export const Slider = defineComponent({
  name: 'HlSlider',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number], default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        type: 'range',
        class: cx('hl-slider', attrs.class as string),
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
      });
  },
});

/* ------------------------------------------------------------ Radio group -- */

interface RadioGroupContext {
  name?: string;
  value?: string;
  select: (value: string) => void;
}
const RadioGroupKey: InjectionKey<RadioGroupContext> = Symbol('hl-radio-group');

/** Groups radios under `role="radiogroup"`. Supports `v-model`. */
export const RadioGroup = defineComponent({
  name: 'HlRadioGroup',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
    name: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    provide(RadioGroupKey, {
      get name() {
        return props.name;
      },
      get value() {
        return props.modelValue;
      },
      select: (value: string) => emit('update:modelValue', value),
    } as RadioGroupContext);
    return () =>
      h(
        'div',
        { ...attrs, role: 'radiogroup', class: cx('hl-radio-group', attrs.class as string) },
        slots.default?.(),
      );
  },
});

/** A single radio. Inside a `<RadioGroup>` it binds to the shared value. */
export const Radio = defineComponent({
  name: 'HlRadio',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
  },
  setup(props, { slots, attrs }) {
    const group = inject(RadioGroupKey, null);
    const checked = computed(() => (group ? group.value === props.value : undefined));
    return () =>
      h('label', { class: cx('hl-radio', attrs.class as string) }, [
        h('input', {
          ...attrs,
          class: undefined,
          type: 'radio',
          name: (attrs.name as string) ?? group?.name,
          value: props.value,
          checked: checked.value,
          onChange: () => group?.select(props.value),
        }),
        slots.default ? h('span', slots.default()) : null,
      ]);
  },
});

/** Segmented control: a styled radiogroup. Supports `v-model`. */
export const SegmentedControl = defineComponent({
  name: 'HlSegmentedControl',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
    options: {
      type: Array as PropType<Array<{ label: string; value: string; disabled?: boolean }>>,
      default: () => [],
    },
    name: { type: String, default: undefined },
    size: { type: String as PropType<Size>, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const groupName = props.name ?? `hl-seg-${(fieldCounter += 1)}`;
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'radiogroup',
          class: cx('hl-segmented', attrs.class as string),
          'data-hl-size': props.size,
        },
        props.options.map((option) =>
          h('label', { class: 'hl-segmented-item', key: option.value }, [
            h('input', {
              type: 'radio',
              name: groupName,
              value: option.value,
              checked: props.modelValue === option.value,
              disabled: option.disabled,
              onChange: () => emit('update:modelValue', option.value),
            }),
            h('span', option.label),
          ]),
        ),
      );
  },
});
