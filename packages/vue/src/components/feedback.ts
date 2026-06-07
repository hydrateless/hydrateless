import { defineComponent, h, type PropType } from 'vue';
import { cx } from '../internal.js';

type Intent = 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';

/** Alert primitive — `hl-alert` with intent, optional `icon` slot + `title`. */
export const Alert = defineComponent({
  name: 'HlAlert',
  inheritAttrs: false,
  props: {
    intent: { type: String as PropType<Intent>, default: undefined },
    title: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: (attrs.role as string) ?? 'alert',
          class: cx('hl-alert', attrs.class as string),
          'data-hl-intent': props.intent,
        },
        [
          slots.icon?.(),
          h('div', { class: 'hl-alert-body' }, [
            props.title != null ? h('p', { class: 'hl-alert-title' }, props.title) : null,
            slots.default?.(),
          ]),
        ],
      );
  },
});

/** Badge primitive — `hl-badge` with intent/variant/size modifiers. */
export const Badge = defineComponent({
  name: 'HlBadge',
  inheritAttrs: false,
  props: {
    intent: { type: String as PropType<Intent>, default: undefined },
    variant: { type: String as PropType<'soft' | 'solid' | 'outline'>, default: undefined },
    size: { type: String as PropType<'sm' | 'md'>, default: undefined },
  },
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

/** Progress primitive — native `<progress class="hl-progress">`. */
export const Progress = defineComponent({
  name: 'HlProgress',
  inheritAttrs: false,
  props: {
    value: { type: Number, default: undefined },
    max: { type: Number, default: 100 },
    intent: {
      type: String as PropType<'primary' | 'success' | 'warning' | 'danger' | 'info'>,
      default: undefined,
    },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: undefined },
  },
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

/** Spinner primitive — `hl-spinner`, announced via `role="status"`. */
export const Spinner = defineComponent({
  name: 'HlSpinner',
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>, default: undefined },
    label: { type: String, default: 'Loading' },
  },
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

/** Skeleton placeholder primitive — `hl-skeleton`. */
export const Skeleton = defineComponent({
  name: 'HlSkeleton',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'rect' | 'text' | 'circle'>, default: undefined },
    width: { type: [String, Number], default: undefined },
    height: { type: [String, Number], default: undefined },
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        class: cx('hl-skeleton', attrs.class as string),
        'data-hl-variant': props.variant,
        style: {
          ...(props.width != null ? { inlineSize: props.width } : {}),
          ...(props.height != null ? { blockSize: props.height } : {}),
          ...(typeof attrs.style === 'object' ? (attrs.style as object) : {}),
        },
        'aria-hidden': 'true',
      });
  },
});

/** A polite toast live region. Mount once near your app root. */
export const ToastRegion = defineComponent({
  name: 'HlToastRegion',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('div', { ...attrs, 'data-hl-toast-region': '' });
  },
});
