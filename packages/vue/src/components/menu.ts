import { defineComponent, h, watch, type PropType } from 'vue';
import { enhanceMenu, type EnhanceMenuOptions, type MenuApi } from '@hydrateless/enhancers';
import { useEnhancer } from '../useEnhancer.js';

/**
 * Menubar / navigation menu with single-level submenus rendered in the top
 * layer. Compose with `<MenuItem>`; nest a flyout via the `submenu` slot. The
 * open submenu works uncontrolled or with `v-model:open` (a submenu value or
 * `null`), and activating a leaf item emits `select` with its value.
 */
export const Menu = defineComponent({
  name: 'HlMenu',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String as PropType<EnhanceMenuOptions['orientation']>,
      default: 'horizontal',
    },
    /** Controlled open submenu value (`v-model:open`), or `null` for none. */
    open: { type: String as PropType<string | null | undefined>, default: undefined },
  },
  emits: ['update:open', 'select'],
  setup(props, { slots, attrs, emit }) {
    const { host, api } = useEnhancer<MenuApi>(
      (el) =>
        enhanceMenu(el, {
          orientation: props.orientation,
          onOpenChange: (value) => emit('update:open', value),
          onSelect: (value) => emit('select', value),
        }),
      () => props.orientation,
    );
    watch(
      () => props.open,
      (open) => {
        if (open !== undefined) api.value?.setOpen(open);
      },
    );
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

/**
 * A menu entry. Default slot is the label; the `submenu` slot nests a flyout.
 * With `href` it renders an anchor, otherwise a button. Emits `select`.
 */
export const MenuItem = defineComponent({
  name: 'HlMenuItem',
  inheritAttrs: false,
  props: {
    href: { type: String, default: undefined },
    /** Stable value identifying this item; defaults to its label text. */
    value: { type: String, default: undefined },
  },
  emits: ['select'],
  setup(props, { slots, attrs, emit }) {
    return () => {
      const hasSubmenu = !!slots.submenu;
      const label =
        props.href && !hasSubmenu
          ? h(
              'a',
              { ...attrs, role: 'menuitem', href: props.href, 'data-hl-value': props.value },
              slots.default?.(),
            )
          : h(
              'button',
              {
                type: 'button',
                ...attrs,
                role: 'menuitem',
                'data-hl-value': props.value,
                onClick: () => emit('select'),
              },
              slots.default?.(),
            );
      const children = [label];
      if (hasSubmenu) {
        children.push(
          h('ul', { role: 'menu', 'data-hl-menu-submenu': '', hidden: true }, slots.submenu?.()),
        );
      }
      return h('li', { role: 'none' }, children);
    };
  },
});
