import {
  defineComponent,
  h,
  inject,
  provide,
  ref,
  type ExtractPublicPropTypes,
  type InjectionKey,
  type PropType,
} from 'vue';
import { enhanceMenu, type EnhanceMenuOptions, type MenuApi } from '@hydrateless/enhancers';
import { useApiSync, useControlled } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

interface MenuContext {
  /** Claim the next top-level index; the enhancer falls back to it too. */
  register: () => number;
}
const MenuKey: InjectionKey<MenuContext | null> = Symbol('hl-menu');

const menuProps = {
  orientation: {
    type: String as PropType<EnhanceMenuOptions['orientation']>,
    default: 'horizontal',
  },
  /** Controlled value of the open submenu (`v-model`), or `null` for none. */
  modelValue: { type: String as PropType<string | null | undefined>, default: undefined },
  /** Submenu to open initially for uncontrolled usage. */
  defaultValue: { type: String as PropType<string | null>, default: null },
} as const;

/** Props for {@link Menu}. */
export type MenuProps = ExtractPublicPropTypes<typeof menuProps>;

/**
 * Menubar / navigation menu with single-level submenus rendered in the top
 * layer. Compose with `<MenuItem>` leaves and `<MenuSubmenu>` flyouts. The
 * open submenu's value (from `<MenuSubmenu value>`) works uncontrolled
 * or with `v-model` (a submenu value or `null`), and activating a leaf item
 * emits `select` with `(value, item, checked?)`.
 */
export const Menu = defineComponent({
  name: 'HlMenu',
  inheritAttrs: false,
  props: menuProps,
  emits: ['update:modelValue', 'select'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const { value, set } = useControlled<string | null | undefined, 'update:modelValue'>(
      props,
      emit,
      { prop: 'modelValue', event: 'update:modelValue', default: props.defaultValue },
    );
    const api = useEnhancer(
      host,
      enhanceMenu,
      () => ({
        orientation: props.orientation,
        defaultValue: value.value,
        onValueChange: set,
        onSelect: (v, item, checked) => emit('select', v, item, checked),
      }),
      () => props.orientation,
    );
    useApiSync<MenuApi, string | null | undefined>(
      api,
      value,
      (a) => a.value,
      (a, v) => a.setValue(v),
    );
    let count = 0;
    provide(MenuKey, { register: () => count++ });
    return () =>
      h(
        'ul',
        {
          ...attrs,
          'data-hl-menu': '',
          role: props.orientation === 'vertical' ? 'menu' : 'menubar',
          'aria-orientation': props.orientation,
          ref: host,
        },
        slots.default?.(),
      );
  },
});

const menuItemProps = {
  /** Render a link instead of a button. */
  href: { type: String, default: undefined },
  /** Value reported to `select`; defaults to the item's text. */
  value: { type: String, default: undefined },
  /** `menuitemcheckbox` toggles; `menuitemradio` is exclusive within its menu. Defaults to `menuitem`. */
  role: {
    type: String as PropType<'menuitem' | 'menuitemcheckbox' | 'menuitemradio'>,
    default: 'menuitem',
  },
  /** Checked state for checkable roles (rendered as `aria-checked`). */
  checked: { type: Boolean, default: undefined },
  /** Skip the item in keyboard navigation and ignore activation. */
  disabled: { type: Boolean, default: false },
} as const;

/** Props for {@link MenuItem}. */
export type MenuItemProps = ExtractPublicPropTypes<typeof menuItemProps>;

/**
 * A leaf menu entry. Default slot is the label. With `href` it renders an
 * anchor, otherwise a button. Emits `click` on activation; the owning `Menu`
 * emits `select` with the item's value.
 */
export const MenuItem = defineComponent({
  name: 'HlMenuItem',
  inheritAttrs: false,
  props: menuItemProps,
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    // Top-level items claim an index so an enhancer-side default value lines
    // up with the DOM order; nested items (inside a submenu) must not.
    inject(MenuKey, null)?.register();
    return () => {
      const common = {
        ...attrs,
        role: props.role,
        'aria-checked': props.role === 'menuitem' ? undefined : String(props.checked ?? false),
        'aria-disabled': props.disabled || undefined,
        'data-hl-value': props.value,
        onClick: (e: MouseEvent) => emit('click', e),
      };
      const label = props.href
        ? h('a', { ...common, href: props.href }, slots.default?.())
        : h('button', { type: 'button', disabled: props.disabled || undefined, ...common }, [
            slots.default?.(),
          ]);
      return h('li', { role: 'none' }, [label]);
    };
  },
});

const menuSubmenuProps = {
  /** Plain-text label of the trigger item. Use the `trigger` slot for rich content. */
  label: { type: String, default: undefined },
  /** Value the Menu reports while this submenu is open; defaults to the top-level index. */
  value: { type: String, default: undefined },
  /** Skip the trigger in keyboard navigation and keep the submenu closed. */
  disabled: { type: Boolean, default: false },
} as const;

/** Props for {@link MenuSubmenu}. */
export type MenuSubmenuProps = ExtractPublicPropTypes<typeof menuSubmenuProps>;

/**
 * A top-level menu entry that opens a flyout of `<MenuItem>`s. Attrs go to
 * the submenu list (`role="menu"`). No `hidden` is rendered: before the
 * enhancer runs, the stylesheet shows the submenu on hover and focus-within so
 * the navigation stays usable.
 */
export const MenuSubmenu = defineComponent({
  name: 'HlMenuSubmenu',
  inheritAttrs: false,
  props: menuSubmenuProps,
  setup(props, { slots, attrs }) {
    inject(MenuKey, null)?.register();
    // Nested items aren't top-level triggers, so they must not claim an index.
    provide(MenuKey, null);
    return () =>
      h('li', { role: 'none' }, [
        h(
          'button',
          {
            type: 'button',
            role: 'menuitem',
            'data-hl-value': props.value,
            'aria-disabled': props.disabled || undefined,
            disabled: props.disabled || undefined,
          },
          slots.trigger ? slots.trigger() : props.label,
        ),
        h('ul', { ...attrs, role: 'menu', 'data-hl-submenu': '' }, slots.default?.()),
      ]);
  },
});
