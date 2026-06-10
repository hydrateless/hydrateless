import { defineComponent, h, watch, type PropType } from 'vue';
import {
  enhanceDropdown,
  type DropdownApi,
  type EnhanceDropdownOptions,
} from '@hydrateless/enhancers';
import { useHostEnhancer } from '../internal.js';

/**
 * Button-triggered menu (WAI-ARIA menu-button pattern). Compose with
 * `<DropdownTrigger>`, `<DropdownMenu>`, `<DropdownItem>`, and
 * `<DropdownSeparator>`. Open state works uncontrolled or with
 * `v-model:open`.
 */
export const Dropdown = defineComponent({
  name: 'HlDropdown',
  inheritAttrs: false,
  props: {
    placement: {
      type: String as PropType<EnhanceDropdownOptions['placement']>,
      default: undefined,
    },
    /** Controlled open state (`v-model:open`). */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Open the menu initially for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const { host, api } = useHostEnhancer<DropdownApi>((el) =>
      enhanceDropdown(el, {
        placement: props.placement,
        defaultOpen: props.open ?? props.defaultOpen,
        onOpenChange: (open) => emit('update:open', open),
      }),
    );
    watch(
      () => props.open,
      (open) => {
        if (open != null) api.value?.setOpen(open);
      },
    );
    return () => h('div', { ...attrs, 'data-hl-dropdown': '', ref: host }, slots.default?.());
  },
});

/** The button that opens the menu. */
export const DropdownTrigger = defineComponent({
  name: 'HlDropdownTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('button', { type: 'button', ...attrs, 'data-hl-dropdown-trigger': '' }, slots.default?.());
  },
});

/** The menu surface. */
export const DropdownMenu = defineComponent({
  name: 'HlDropdownMenu',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('ul', { ...attrs, 'data-hl-dropdown-menu': '' }, slots.default?.());
  },
});

/** A selectable menu item (`role="menuitem"`). Emits `select` on click. */
export const DropdownItem = defineComponent({
  name: 'HlDropdownItem',
  inheritAttrs: false,
  emits: ['select'],
  setup(_, { slots, attrs, emit }) {
    return () =>
      h('li', [
        h(
          'button',
          {
            type: 'button',
            ...attrs,
            role: 'menuitem',
            onClick: () => emit('select'),
          },
          slots.default?.(),
        ),
      ]);
  },
});

/** A visual divider between groups of items. */
export const DropdownSeparator = defineComponent({
  name: 'HlDropdownSeparator',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('li', { ...attrs, role: 'separator' });
  },
});
