import { defineComponent, h } from 'vue';

/**
 * Semantic breadcrumb navigation (`<nav> > <ol>`). CSS-only. Compose with
 * `<BreadcrumbItem>`.
 */
export const Breadcrumb = defineComponent({
  name: 'HlBreadcrumb',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'nav',
        {
          ...attrs,
          'data-hl-breadcrumb': '',
          'aria-label': (attrs['aria-label'] as string) ?? 'Breadcrumb',
        },
        [h('ol', slots.default?.())],
      );
  },
});

/** A single crumb. Renders a link unless `current` (or no `href`) is set. */
export const BreadcrumbItem = defineComponent({
  name: 'HlBreadcrumbItem',
  inheritAttrs: false,
  props: {
    href: { type: String, default: undefined },
    current: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h('li', { ...attrs }, [
        props.current || !props.href
          ? h('span', { 'aria-current': props.current ? 'page' : undefined }, slots.default?.())
          : h('a', { href: props.href }, slots.default?.()),
      ]);
  },
});
