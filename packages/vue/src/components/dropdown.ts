import {
  defineComponent,
  h,
  inject,
  provide,
  ref,
  useId,
  type ComputedRef,
  type ExtractPublicPropTypes,
  type InjectionKey,
  type PropType,
} from 'vue';
import {
  enhanceDropdown,
  type DropdownApi,
  type EnhanceDropdownOptions,
} from '@hydrateless/enhancers';
import { cx, useApiSync, useControlled } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

interface DropdownContext {
  menuId: string;
  open: ComputedRef<boolean | undefined>;
}
const DropdownKey: InjectionKey<DropdownContext> = Symbol('hl-dropdown');

const dropdownProps = {
  placement: { type: String as PropType<EnhanceDropdownOptions['placement']>, default: undefined },
  /** Close the menu after an item is activated. Defaults to `true`. */
  closeOnSelect: { type: Boolean, default: true },
  /** Controlled open state (`v-model:open`). */
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  /** Open the menu initially for uncontrolled usage. */
  defaultOpen: { type: Boolean, default: false },
} as const;

/** Props for {@link Dropdown}. */
export type DropdownProps = ExtractPublicPropTypes<typeof dropdownProps>;

/**
 * Button-triggered menu (WAI-ARIA menu-button pattern). Compose with
 * `<DropdownTrigger>`, `<DropdownMenu>`, `<DropdownItem>`, `<DropdownGroup>`,
 * and `<DropdownSeparator>`. The menu is a native `popover` toggled through
 * `popovertarget`, so it opens before hydration; open state works
 * uncontrolled or with `v-model:open`, and activating an item emits `select`
 * with `(value, item, checked?)`.
 */
export const Dropdown = defineComponent({
  name: 'HlDropdown',
  inheritAttrs: false,
  props: dropdownProps,
  emits: ['update:open', 'select'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const { value: open, set } = useControlled<boolean | undefined, 'update:open'>(props, emit, {
      prop: 'open',
      event: 'update:open',
      default: props.defaultOpen,
    });
    const api = useEnhancer(
      host,
      enhanceDropdown,
      () => ({
        placement: props.placement,
        closeOnSelect: props.closeOnSelect,
        defaultOpen: open.value,
        onOpenChange: set,
        onSelect: (value, item, checked) => emit('select', value, item, checked),
      }),
      () => [props.placement, props.closeOnSelect],
    );
    useApiSync<DropdownApi, boolean | undefined>(
      api,
      open,
      (a) => a.open,
      (a, v) => a.setOpen(v),
    );
    provide(DropdownKey, { menuId: useId(), open });
    return () => h('div', { ...attrs, 'data-hl-dropdown': '', ref: host }, slots.default?.());
  },
});

/** Props for {@link DropdownTrigger}. */
export type DropdownTriggerProps = Record<never, never>;

/** The button that opens the menu (`popovertarget` points at the menu). */
export const DropdownTrigger = defineComponent({
  name: 'HlDropdownTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = inject(DropdownKey, null);
    return () =>
      h(
        'button',
        {
          type: 'button',
          ...attrs,
          'data-hl-dropdown-trigger': '',
          popovertarget: ctx?.menuId,
          'aria-haspopup': 'menu',
          'aria-expanded': String(!!ctx?.open.value),
        },
        slots.default?.(),
      );
  },
});

/** Props for {@link DropdownMenu}. */
export type DropdownMenuProps = Record<never, never>;

/** The menu surface: a `popover` list of items. */
export const DropdownMenu = defineComponent({
  name: 'HlDropdownMenu',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = inject(DropdownKey, null);
    return () =>
      h(
        'ul',
        { ...attrs, id: ctx?.menuId, popover: 'auto', role: 'menu', 'data-hl-dropdown-menu': '' },
        slots.default?.(),
      );
  },
});

const dropdownItemProps = {
  /** Value reported on selection; defaults to the item's text. */
  value: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  /** `menuitemcheckbox` toggles, `menuitemradio` checks one per group. */
  role: {
    type: String as PropType<'menuitem' | 'menuitemcheckbox' | 'menuitemradio'>,
    default: 'menuitem',
  },
  /** Checked state for checkable roles (sets `aria-checked`). */
  checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
} as const;

/** Props for {@link DropdownItem}. */
export type DropdownItemProps = ExtractPublicPropTypes<typeof dropdownItemProps>;

/**
 * A menu item button. Emits both `click` (the native event) and `select`
 * (`value`, plus the new `checked` state for checkable roles).
 */
export const DropdownItem = defineComponent({
  name: 'HlDropdownItem',
  inheritAttrs: false,
  props: dropdownItemProps,
  emits: ['click', 'select'],
  setup(props, { slots, attrs, emit }) {
    return () => {
      const checkable = props.role !== 'menuitem';
      return h('li', [
        h(
          'button',
          {
            type: 'button',
            ...attrs,
            role: props.role,
            'data-hl-value': props.value,
            disabled: props.disabled || undefined,
            'aria-checked': checkable ? String(!!props.checked) : undefined,
            onClick: (e: MouseEvent) => {
              emit('click', e);
              const el = e.currentTarget as HTMLElement;
              const value = props.value ?? el.textContent?.trim() ?? '';
              // The enhancer flips `aria-checked` after this handler runs, so
              // report the state the activation is about to produce.
              const checked =
                props.role === 'menuitemcheckbox'
                  ? el.getAttribute('aria-checked') !== 'true'
                  : props.role === 'menuitemradio' || undefined;
              // Same shape as the root `select` event: (value, item, checked).
              emit('select', value, el, checked);
            },
          },
          slots.default?.(),
        ),
      ]);
    };
  },
});

const dropdownGroupProps = {
  /** Accessible name of the group. */
  label: { type: String, default: undefined },
} as const;

/** Props for {@link DropdownGroup}. */
export type DropdownGroupProps = ExtractPublicPropTypes<typeof dropdownGroupProps>;

/** A labelled `role="group"` of items; `menuitemradio` items check per group. */
export const DropdownGroup = defineComponent({
  name: 'HlDropdownGroup',
  inheritAttrs: false,
  props: dropdownGroupProps,
  setup(props, { slots, attrs }) {
    return () =>
      h('li', [h('ul', { ...attrs, role: 'group', 'aria-label': props.label }, slots.default?.())]);
  },
});

/** Props for {@link DropdownSeparator}. */
export type DropdownSeparatorProps = Record<never, never>;

/** A visual divider between groups of items. */
export const DropdownSeparator = defineComponent({
  name: 'HlDropdownSeparator',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h('li', {
        ...attrs,
        role: 'separator',
        class: cx('hl-dropdown-separator', attrs.class as string),
      });
  },
});
