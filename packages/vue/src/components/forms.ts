import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  reactive,
  useId,
  type ExtractPublicPropTypes,
  type InjectionKey,
  type PropType,
} from 'vue';
import { cx, useControlled } from '../internal/index.js';

type Size = 'sm' | 'md' | 'lg';

/* ------------------------------------------------------------------ Field -- */

/** Bindings a control inside a `<Field>` reads through {@link useField}. */
export interface FieldBindings {
  /** Id shared by the control and its `<FieldLabel>`. */
  readonly id: string;
  /** Space-separated ids of the rendered help and error text, if any. */
  readonly describedBy: string | undefined;
  readonly invalid: boolean;
  readonly required: boolean;
}

interface FieldContext extends FieldBindings {
  helpId: string;
  errorId: string;
  /** Whether a help/error part is rendered, so `describedBy` only names real elements. */
  help: boolean;
  error: boolean;
}

const FieldKey: InjectionKey<FieldContext> = Symbol('hl-field');

const fieldProps = {
  id: { type: String, default: undefined },
  /** Renders a `<FieldLabel>`; the `label` slot takes precedence. */
  label: { type: String, default: undefined },
  /** Renders a `<FieldHelp>`. */
  description: { type: String, default: undefined },
  /** Renders a `<FieldError>` and marks the field invalid. */
  error: { type: String, default: undefined },
  invalid: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
} as const;

/** Props for {@link Field}. */
export type FieldProps = ExtractPublicPropTypes<typeof fieldProps>;

/**
 * Layout + accessibility wrapper for a control. Provides a shared id so
 * `<FieldLabel>`, `<FieldHelp>`, and `<FieldError>` (or the `label`,
 * `description`, and `error` props) wire up automatically, and every
 * Hydrateless control placed inside reads its `id`, `aria-describedby`,
 * `aria-invalid`, and `required` through {@link useField}.
 */
export const Field = defineComponent({
  name: 'HlField',
  inheritAttrs: false,
  props: fieldProps,
  setup(props, { slots, attrs }) {
    const id = props.id ?? useId();
    const ctx: FieldContext = reactive({
      id,
      helpId: `${id}-help`,
      errorId: `${id}-error`,
      help: false,
      error: false,
      invalid: computed(() => props.invalid || !!props.error),
      required: computed(() => props.required),
      describedBy: computed(
        () => cx(ctx.help && ctx.helpId, ctx.error && ctx.invalid && ctx.errorId) || undefined,
      ),
    });
    provide(FieldKey, ctx);
    return () => {
      const children = slots.default?.() ?? [];
      // Controls render before their sibling parts mount, so detect the parts
      // here (props or direct slot children) to keep server output complete.
      const has = (part: unknown) => children.some((child) => child.type === part);
      ctx.help = !!props.description || has(FieldHelp);
      ctx.error = !!props.error || has(FieldError);
      return h(
        'div',
        {
          ...attrs,
          class: cx('hl-field', attrs.class as string),
          'data-hl-invalid': ctx.invalid || undefined,
        },
        [
          slots.label
            ? h(FieldLabel, null, slots.label)
            : props.label && h(FieldLabel, () => props.label),
          children,
          props.description && h(FieldHelp, () => props.description),
          props.error && h(FieldError, () => props.error),
        ],
      );
    };
  },
});

/**
 * Bindings for a custom control inside a `<Field>` (`id`, `describedBy`,
 * `invalid`, `required`), live as the field's props change. Returns `null`
 * outside a `<Field>`, so controls can read it unconditionally.
 */
export function useField(): FieldBindings | null {
  return inject(FieldKey, null);
}

/** Attributes a native control derives from {@link useField}. */
function fieldAttrs(field: FieldBindings | null) {
  return {
    id: field?.id,
    'aria-describedby': field?.describedBy,
    'aria-invalid': field?.invalid || undefined,
    required: field?.required || undefined,
  };
}

/** Props for {@link FieldLabel}. */
export type FieldLabelProps = Record<never, never>;
/** Props for {@link FieldHelp}. */
export type FieldHelpProps = Record<never, never>;
/** Props for {@link FieldError}. */
export type FieldErrorProps = Record<never, never>;
/** Props for {@link Fieldset}. */
export type FieldsetProps = Record<never, never>;

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
          for: ctx?.id,
          ...attrs,
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
    return () =>
      h('fieldset', { ...attrs, class: cx('hl-fieldset', attrs.class as string) }, [
        slots.legend && h('legend', { class: 'hl-legend' }, slots.legend()),
        slots.default?.(),
      ]);
  },
});

/* --------------------------------------------------------------- Controls -- */

const textProps = {
  size: { type: String as PropType<Size>, default: undefined },
  invalid: { type: Boolean, default: false },
} as const;

/** Read a native control's value on input/change. */
const target = (e: Event) => e.target as HTMLInputElement;

const inputProps = {
  ...textProps,
  modelValue: { type: [String, Number] as PropType<string | number>, default: undefined },
} as const;

/** Props for {@link Input}. */
export type InputProps = ExtractPublicPropTypes<typeof inputProps>;

/** Text input styled with the `hl-input` primitive. Supports `v-model` and `<Field>` wiring. */
export const Input = defineComponent({
  name: 'HlInput',
  inheritAttrs: false,
  props: inputProps,
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const field = useField();
    return () =>
      h('input', {
        ...fieldAttrs(field),
        ...attrs,
        class: cx('hl-input', attrs.class as string),
        'data-hl-size': props.size,
        'data-hl-invalid': props.invalid || undefined,
        'aria-invalid': props.invalid || field?.invalid || undefined,
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', target(e).value),
      });
  },
});

const textareaProps = {
  ...textProps,
  modelValue: { type: String, default: undefined },
  /** Grow with the content (`field-sizing: content`). */
  autosize: { type: Boolean, default: false },
} as const;

/** Props for {@link Textarea}. */
export type TextareaProps = ExtractPublicPropTypes<typeof textareaProps>;

/** Multi-line text input. Supports `v-model` and `<Field>` wiring. */
export const Textarea = defineComponent({
  name: 'HlTextarea',
  inheritAttrs: false,
  props: textareaProps,
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const field = useField();
    return () =>
      h('textarea', {
        ...fieldAttrs(field),
        ...attrs,
        class: cx('hl-textarea', attrs.class as string),
        'data-hl-size': props.size,
        'data-hl-invalid': props.invalid || undefined,
        'data-hl-autosize': props.autosize || undefined,
        'aria-invalid': props.invalid || field?.invalid || undefined,
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', target(e).value),
      });
  },
});

const selectProps = {
  ...textProps,
  modelValue: { type: String, default: undefined },
} as const;

/** Props for {@link Select}. */
export type SelectProps = ExtractPublicPropTypes<typeof selectProps>;

/** Native `<select>` styled with `hl-select`. Supports `v-model` and `<Field>` wiring. */
export const Select = defineComponent({
  name: 'HlSelect',
  inheritAttrs: false,
  props: selectProps,
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const field = useField();
    return () =>
      h('span', { class: 'hl-select-wrapper' }, [
        h(
          'select',
          {
            ...fieldAttrs(field),
            ...attrs,
            class: cx('hl-select', attrs.class as string),
            'data-hl-size': props.size,
            'data-hl-invalid': props.invalid || undefined,
            'aria-invalid': props.invalid || field?.invalid || undefined,
            value: props.modelValue,
            onChange: (e: Event) => emit('update:modelValue', target(e).value),
          },
          slots.default?.(),
        ),
      ]);
  },
});

const checkedProps = {
  modelValue: { type: Boolean, default: undefined },
} as const;

/** Props for {@link Checkbox}. */
export type CheckboxProps = ExtractPublicPropTypes<typeof checkedProps>;
/** Props for {@link Switch}. */
export type SwitchProps = ExtractPublicPropTypes<typeof checkedProps>;

/** A label-wrapped native checkbox; `role` distinguishes the switch. */
function checkable(name: string, wrapper: Record<string, string>, role?: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: checkedProps,
    emits: ['update:modelValue'],
    setup(props, { slots, attrs, emit }) {
      const field = useField();
      return () =>
        h('label', { ...wrapper, class: cx(wrapper.class, attrs.class as string) }, [
          h('input', {
            ...fieldAttrs(field),
            ...attrs,
            class: undefined,
            type: 'checkbox',
            role,
            checked: props.modelValue,
            onChange: (e: Event) => emit('update:modelValue', target(e).checked),
          }),
          slots.default && h('span', slots.default()),
        ]);
    },
  });
}

/** Checkbox built on a native input, label-wrapped. Supports `v-model` and `<Field>` wiring. */
export const Checkbox = checkable('HlCheckbox', { class: 'hl-checkbox' });

/** Toggle switch built on a native checkbox. Supports `v-model` and `<Field>` wiring. */
export const Switch = checkable('HlSwitch', { 'data-hl-switch': '' }, 'switch');

const sliderProps = {
  modelValue: { type: [String, Number] as PropType<string | number>, default: undefined },
} as const;

/** Props for {@link Slider}. */
export type SliderProps = ExtractPublicPropTypes<typeof sliderProps>;

/** Range slider primitive. Supports `v-model` and `<Field>` wiring. */
export const Slider = defineComponent({
  name: 'HlSlider',
  inheritAttrs: false,
  props: sliderProps,
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const field = useField();
    return () =>
      h('input', {
        ...fieldAttrs(field),
        ...attrs,
        type: 'range',
        class: cx('hl-slider', attrs.class as string),
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', target(e).value),
      });
  },
});

/* ------------------------------------------------------------ Radio group -- */

interface RadioGroupContext {
  readonly name: string | undefined;
  readonly value: string | undefined;
  select: (value: string) => void;
}
const RadioGroupKey: InjectionKey<RadioGroupContext> = Symbol('hl-radio-group');

const radioGroupProps = {
  /** Controlled selected value (`v-model`). */
  modelValue: { type: String, default: undefined },
  /** Initially selected value for uncontrolled usage. */
  defaultValue: { type: String, default: undefined },
  /** Shared `name` for the radios; generated when omitted. */
  name: { type: String, default: undefined },
  /** Layout direction; sets `data-hl-orientation` and `aria-orientation`. */
  orientation: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: undefined,
  },
} as const;

/** Props for {@link RadioGroup}. */
export type RadioGroupProps = ExtractPublicPropTypes<typeof radioGroupProps>;

/**
 * Groups radios under `role="radiogroup"`, sharing a name and managing the
 * selected value (uncontrolled via `defaultValue` or controlled via `v-model`).
 */
export const RadioGroup = defineComponent({
  name: 'HlRadioGroup',
  inheritAttrs: false,
  props: radioGroupProps,
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const name = props.name ?? useId();
    const { value, set } = useControlled<string | undefined, 'update:modelValue'>(props, emit, {
      prop: 'modelValue',
      event: 'update:modelValue',
      default: props.defaultValue,
    });
    provide(RadioGroupKey, {
      get name() {
        return name;
      },
      get value() {
        return value.value;
      },
      select: set,
    });
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'radiogroup',
          class: cx('hl-radio-group', attrs.class as string),
          'data-hl-orientation': props.orientation,
          'aria-orientation': props.orientation,
        },
        slots.default?.(),
      );
  },
});

const radioProps = {
  value: { type: String, required: true },
} as const;

/** Props for {@link Radio}. */
export type RadioProps = ExtractPublicPropTypes<typeof radioProps>;

/** A single radio. Inside a `<RadioGroup>` it binds to the shared value. */
export const Radio = defineComponent({
  name: 'HlRadio',
  inheritAttrs: false,
  props: radioProps,
  setup(props, { slots, attrs }) {
    const group = inject(RadioGroupKey, null);
    return () =>
      h('label', { class: cx('hl-radio', attrs.class as string) }, [
        h('input', {
          name: group?.name,
          ...attrs,
          class: undefined,
          type: 'radio',
          value: props.value,
          checked: group ? group.value === props.value : undefined,
          onChange: () => group?.select(props.value),
        }),
        slots.default && h('span', slots.default()),
      ]);
  },
});

/** One choice in a {@link SegmentedControl}. */
export interface SegmentedOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const segmentedControlProps = {
  options: { type: Array as PropType<SegmentedOption[]>, default: () => [] },
  /** Controlled selected value (`v-model`). */
  modelValue: { type: String, default: undefined },
  /** Initially selected value for uncontrolled usage; defaults to the first option. */
  defaultValue: { type: String, default: undefined },
  name: { type: String, default: undefined },
  size: { type: String as PropType<Size>, default: undefined },
} as const;

/** Props for {@link SegmentedControl}. */
export type SegmentedControlProps = ExtractPublicPropTypes<typeof segmentedControlProps>;

/**
 * Segmented control: a styled radiogroup. The selected value works
 * uncontrolled (`defaultValue`, else the first option) or with `v-model`.
 */
export const SegmentedControl = defineComponent({
  name: 'HlSegmentedControl',
  inheritAttrs: false,
  props: segmentedControlProps,
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const name = props.name ?? useId();
    const { value, set } = useControlled<string | undefined, 'update:modelValue'>(props, emit, {
      prop: 'modelValue',
      event: 'update:modelValue',
      default: props.defaultValue ?? props.options[0]?.value,
    });
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
              name,
              value: option.value,
              checked: value.value === option.value,
              disabled: option.disabled,
              onChange: () => set(option.value),
            }),
            h('span', option.label),
          ]),
        ),
      );
  },
});
