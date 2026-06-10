import { defineComponent, h, type PropType } from 'vue';
import { enhanceMenu, type EnhanceMenuOptions } from '@hydrateless/enhancers';
import { useHostEnhancer } from '../internal.js';

/**
 * Menubar / navigation menu with single-level submenus. Compose with
 * `<MenuItem>`; nest a flyout via the `submenu` slot.
 */
export const Menu = defineComponent({
  name: 'HlMenu',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String as PropType<EnhanceMenuOptions['orientation']>,
      default: 'horizontal',
    },
  },
  setup(props, { slots, attrs }) {
    const { host } = useHostEnhancer((el) => enhanceMenu(el, { orientation: props.orientation }));
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
  },
  emits: ['select'],
  setup(props, { slots, attrs, emit }) {
    return () => {
      const hasSubmenu = !!slots.submenu;
      const label =
        props.href && !hasSubmenu
          ? h('a', { ...attrs, role: 'menuitem', href: props.href }, slots.default?.())
          : h(
              'button',
              { type: 'button', ...attrs, role: 'menuitem', onClick: () => emit('select') },
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
