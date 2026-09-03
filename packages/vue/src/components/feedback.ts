import { defineComponent, h, ref, type ExtractPublicPropTypes, type PropType } from 'vue';
import { enhanceToast } from '@hydrateless/enhancers';
import { cx } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

type Intent = 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';

const alertProps = {
  intent: { type: String as PropType<Intent>, default: undefined },
  title: { type: String, default: undefined },
} as const;

/** Props for {@link Alert}. */
export type AlertProps = ExtractPublicPropTypes<typeof alertProps>;

/** Alert primitive: `hl-alert` with intent, optional `icon` slot + `title`. */
export const Alert = defineComponent({
  name: 'HlAlert',
  inheritAttrs: false,
  props: alertProps,
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          role: 'alert',
          ...attrs,
          class: cx('hl-alert', attrs.class as string),
          'data-hl-intent': props.intent,
        },
        [
          slots.icon?.(),
          h('div', { class: 'hl-alert-body' }, [
            props.title != null && h('p', { class: 'hl-alert-title' }, props.title),
            slots.default?.(),
          ]),
        ],
      );
  },
});

const badgeProps = {
  intent: { type: String as PropType<Intent>, default: undefined },
  variant: { type: String as PropType<'soft' | 'solid' | 'outline'>, default: undefined },
  size: { type: String as PropType<'sm' | 'md'>, default: undefined },
} as const;

/** Props for {@link Badge}. */
export type BadgeProps = ExtractPublicPropTypes<typeof badgeProps>;

/** Badge primitive: `hl-badge` with intent/variant/size modifiers. */
export const Badge = defineComponent({
  name: 'HlBadge',
  inheritAttrs: false,
  props: badgeProps,
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          class: cx('hl-badge', attrs.class as string),
          'data-hl-intent': props.intent,
          'data-hl-variant': props.variant,
          'data-hl-size': props.size,
        },
        slots.default?.(),
      );
  },
});

const progressProps = {
  value: { type: Number, default: undefined },
  max: { type: Number, default: 100 },
  intent: {
    type: String as PropType<'primary' | 'success' | 'warning' | 'danger' | 'info'>,
    default: undefined,
  },
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: undefined },
} as const;

/** Props for {@link Progress}. */
export type ProgressProps = ExtractPublicPropTypes<typeof progressProps>;

/** Progress primitive: native `<progress class="hl-progress">`. */
export const Progress = defineComponent({
  name: 'HlProgress',
  inheritAttrs: false,
  props: progressProps,
  setup(props, { attrs }) {
    return () =>
      h('progress', {
        ...attrs,
        class: cx('hl-progress', attrs.class as string),
        'data-hl-intent': props.intent,
        'data-hl-size': props.size,
        value: props.value,
        max: props.max,
      });
  },
});

const spinnerProps = {
  size: { type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>, default: undefined },
  label: { type: String, default: 'Loading' },
} as const;

/** Props for {@link Spinner}. */
export type SpinnerProps = ExtractPublicPropTypes<typeof spinnerProps>;

/** Spinner primitive: `hl-spinner`, announced via `role="status"`. */
export const Spinner = defineComponent({
  name: 'HlSpinner',
  inheritAttrs: false,
  props: spinnerProps,
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        class: cx('hl-spinner', attrs.class as string),
        'data-hl-size': props.size,
        role: 'status',
        'aria-label': props.label,
      });
  },
});

const skeletonProps = {
  shape: { type: String as PropType<'rect' | 'text' | 'circle'>, default: undefined },
  /** Inline size (CSS length or px number). */
  width: { type: [String, Number] as PropType<string | number>, default: undefined },
  /** Block size (CSS length or px number). */
  height: { type: [String, Number] as PropType<string | number>, default: undefined },
} as const;

/** Props for {@link Skeleton}. */
export type SkeletonProps = ExtractPublicPropTypes<typeof skeletonProps>;

const px = (size: string | number | undefined) => (typeof size === 'number' ? `${size}px` : size);

/** Skeleton placeholder primitive: `hl-skeleton` with a `shape`. */
export const Skeleton = defineComponent({
  name: 'HlSkeleton',
  inheritAttrs: false,
  props: skeletonProps,
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        class: cx('hl-skeleton', attrs.class as string),
        'data-hl-shape': props.shape,
        style: [{ inlineSize: px(props.width), blockSize: px(props.height) }, attrs.style],
        'aria-hidden': 'true',
      });
  },
});

const toastRegionProps = {
  /** Default auto-dismiss duration in ms for toasts shown into this region. */
  duration: { type: Number, default: undefined },
} as const;

/** Props for {@link ToastRegion}. */
export type ToastRegionProps = ExtractPublicPropTypes<typeof toastRegionProps>;

/**
 * The polite live region toasts render into. Mount once near your app root;
 * it enhances itself on mount so `useToast()` and declarative
 * `data-hl-toast-trigger` buttons target it.
 */
export const ToastRegion = defineComponent({
  name: 'HlToastRegion',
  inheritAttrs: false,
  props: toastRegionProps,
  setup(props, { attrs }) {
    const host = ref<HTMLElement | null>(null);
    useEnhancer(host, enhanceToast, () => ({ duration: props.duration }));
    return () =>
      h('div', {
        role: 'status',
        'aria-live': 'polite',
        'aria-relevant': 'additions',
        ...attrs,
        'data-hl-toast-region': '',
        ref: host,
      });
  },
});
