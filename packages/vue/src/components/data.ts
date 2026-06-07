import { defineComponent, h, ref, type PropType } from 'vue';
import { cx } from '../internal.js';

/** Card container — `hl-card`. Compose with the Card* parts. */
export const Card = defineComponent({
  name: 'HlCard',
  inheritAttrs: false,
  props: {
    interactive: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('hl-card', attrs.class as string),
          'data-hl-interactive': props.interactive || undefined,
        },
        slots.default?.(),
      );
  },
});

function part(name: string, tag: string, klass: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      return () => h(tag, { ...attrs, class: cx(klass, attrs.class as string) }, slots.default?.());
    },
  });
}

export const CardHeader = part('HlCardHeader', 'div', 'hl-card-header');
export const CardBody = part('HlCardBody', 'div', 'hl-card-body');
export const CardFooter = part('HlCardFooter', 'div', 'hl-card-footer');
export const CardTitle = part('HlCardTitle', 'h3', 'hl-card-title');
export const CardDescription = part('HlCardDescription', 'p', 'hl-card-description');

/** Avatar primitive — `hl-avatar` with image + graceful fallback. */
export const Avatar = defineComponent({
  name: 'HlAvatar',
  inheritAttrs: false,
  props: {
    src: { type: String, default: undefined },
    alt: { type: String, default: '' },
    size: { type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>, default: undefined },
    shape: { type: String as PropType<'circle' | 'square'>, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const failed = ref(false);
    return () =>
      h(
        'span',
        {
          ...attrs,
          class: cx('hl-avatar', attrs.class as string),
          'data-hl-size': props.size,
          'data-hl-shape': props.shape === 'square' ? 'square' : undefined,
        },
        props.src && !failed.value
          ? h('img', { src: props.src, alt: props.alt, onError: () => (failed.value = true) })
          : slots.default?.(),
      );
  },
});

/** Overlapping stack of avatars. */
export const AvatarGroup = part('HlAvatarGroup', 'div', 'hl-avatar-group');

/** Keyboard key primitive — `<kbd class="hl-kbd">`. */
export const Kbd = part('HlKbd', 'kbd', 'hl-kbd');

/** Separator primitive — `<hr class="hl-separator">`. */
export const Separator = defineComponent({
  name: 'HlSeparator',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    decorative: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () =>
      h('hr', {
        ...attrs,
        class: cx('hl-separator', attrs.class as string),
        'data-hl-orientation': props.orientation === 'vertical' ? 'vertical' : undefined,
        'aria-orientation': props.orientation,
        role: props.decorative ? 'presentation' : 'separator',
      });
  },
});
