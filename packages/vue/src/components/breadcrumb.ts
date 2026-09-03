import { defineComponent, h, type ExtractPublicPropTypes } from 'vue';

/** Props for {@link Breadcrumb}. */
export type BreadcrumbProps = Record<never, never>;

/**
 * Semantic breadcrumb navigation (`<nav> > <ol>`). CSS-only. Compose with
 * `<BreadcrumbItem>`.
 */
export const Breadcrumb = defineComponent({
  name: 'HlBreadcrumb',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('nav', { 'aria-label': 'Breadcrumb', ...attrs, 'data-hl-breadcrumb': '' }, [
        h('ol', slots.default?.()),
      ]);
  },
});

const breadcrumbItemProps = {
  href: { type: String, default: undefined },
  /** Marks the current page (`aria-current="page"`). */
  current: { type: Boolean, default: false },
} as const;

/** Props for {@link BreadcrumbItem}. */
export type BreadcrumbItemProps = ExtractPublicPropTypes<typeof breadcrumbItemProps>;

/** A single crumb. Renders a link unless `current` (or no `href`) is set. */
export const BreadcrumbItem = defineComponent({
  name: 'HlBreadcrumbItem',
  inheritAttrs: false,
  props: breadcrumbItemProps,
  setup(props, { slots, attrs }) {
    return () =>
      h('li', attrs, [
        props.current || !props.href
          ? h('span', { 'aria-current': props.current ? 'page' : undefined }, slots.default?.())
          : h('a', { href: props.href }, slots.default?.()),
      ]);
  },
});
