import { defineComponent, h, ref, type ExtractPublicPropTypes, type PropType } from 'vue';
import { cx, part } from '../internal/index.js';

const cardProps = {
  /** Hover/focus affordance for clickable cards. */
  interactive: { type: Boolean, default: false },
} as const;

/** Props for {@link Card}. */
export type CardProps = ExtractPublicPropTypes<typeof cardProps>;

/** Card container: `hl-card`. Compose with the Card* parts. */
export const Card = defineComponent({
  name: 'HlCard',
  inheritAttrs: false,
  props: cardProps,
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

/** Props for {@link CardHeader}. */
export type CardHeaderProps = Record<never, never>;
/** Props for {@link CardBody}. */
export type CardBodyProps = Record<never, never>;
/** Props for {@link CardFooter}. */
export type CardFooterProps = Record<never, never>;
/** Props for {@link CardTitle}. */
export type CardTitleProps = Record<never, never>;
/** Props for {@link CardDescription}. */
export type CardDescriptionProps = Record<never, never>;
/** Props for {@link AvatarGroup}. */
export type AvatarGroupProps = Record<never, never>;
/** Props for {@link Kbd}. */
export type KbdProps = Record<never, never>;

/** Header region of a {@link Card}. */
export const CardHeader = part('HlCardHeader', 'div', 'hl-card-header');
/** Body region of a {@link Card}. */
export const CardBody = part('HlCardBody', 'div', 'hl-card-body');
/** Footer region of a {@link Card}. */
export const CardFooter = part('HlCardFooter', 'div', 'hl-card-footer');
/** Title heading of a {@link Card}. */
export const CardTitle = part('HlCardTitle', 'h3', 'hl-card-title');
/** Descriptive text of a {@link Card}. */
export const CardDescription = part('HlCardDescription', 'p', 'hl-card-description');

const avatarProps = {
  src: { type: String, default: undefined },
  alt: { type: String, default: '' },
  size: { type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>, default: undefined },
  shape: { type: String as PropType<'circle' | 'square'>, default: undefined },
} as const;

/** Props for {@link Avatar}. */
export type AvatarProps = ExtractPublicPropTypes<typeof avatarProps>;

/** Avatar primitive: `hl-avatar` with image + graceful fallback (default slot). */
export const Avatar = defineComponent({
  name: 'HlAvatar',
  inheritAttrs: false,
  props: avatarProps,
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

/** Keyboard key primitive: `<kbd class="hl-kbd">`. */
export const Kbd = part('HlKbd', 'kbd', 'hl-kbd');

const separatorProps = {
  orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  /** Purely visual: hides the separator from assistive technology. */
  decorative: { type: Boolean, default: false },
} as const;

/** Props for {@link Separator}. */
export type SeparatorProps = ExtractPublicPropTypes<typeof separatorProps>;

/** Separator primitive: `<hr class="hl-separator">`. */
export const Separator = defineComponent({
  name: 'HlSeparator',
  inheritAttrs: false,
  props: separatorProps,
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

const tableProps = {
  /** Alternate row backgrounds. */
  striped: { type: Boolean, default: false },
  /** Highlight the hovered row. */
  hover: { type: Boolean, default: false },
  /** Cell text alignment. */
  align: { type: String as PropType<'start' | 'center' | 'end'>, default: undefined },
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: undefined },
} as const;

/** Props for {@link Table}. */
export type TableProps = ExtractPublicPropTypes<typeof tableProps>;

/**
 * Data table primitive: `<table class="hl-table">` with `striped`, `hover`,
 * `align`, and `size` modifiers. Author the rows yourself in the default slot.
 */
export const Table = defineComponent({
  name: 'HlTable',
  inheritAttrs: false,
  props: tableProps,
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'table',
        {
          ...attrs,
          class: cx('hl-table', attrs.class as string),
          'data-hl-striped': props.striped || undefined,
          'data-hl-hover': props.hover || undefined,
          'data-hl-align': props.align,
          'data-hl-size': props.size,
        },
        slots.default?.(),
      );
  },
});
