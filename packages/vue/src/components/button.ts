import { defineComponent, h, type ExtractPublicPropTypes, type PropType } from 'vue';
import { cx } from '../internal/index.js';

const buttonProps = {
  variant: {
    type: String as PropType<'solid' | 'soft' | 'outline' | 'ghost' | 'link'>,
    default: undefined,
  },
  intent: {
    type: String as PropType<'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info'>,
    default: undefined,
  },
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: undefined },
  /** Stretch to the container's inline size. */
  block: { type: Boolean, default: false },
  /** Square icon-only button. */
  icon: { type: Boolean, default: false },
  /** Show the busy state and disable the button. */
  loading: { type: Boolean, default: false },
} as const;

/** Props for {@link Button}. */
export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>;

/** Button primitive: `hl-button` with intent/variant/size modifiers. */
export const Button = defineComponent({
  name: 'HlButton',
  inheritAttrs: false,
  props: buttonProps,
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          ...attrs,
          class: cx('hl-button', attrs.class as string),
          'data-hl-variant': props.variant,
          'data-hl-intent': props.intent,
          'data-hl-size': props.size,
          'data-hl-block': props.block || undefined,
          'data-hl-icon': props.icon || undefined,
          'data-hl-loading': props.loading || undefined,
          'aria-busy': props.loading || undefined,
          disabled: (attrs.disabled as boolean) || props.loading || undefined,
        },
        slots.default?.(),
      );
  },
});
