import { defineComponent, h, type PropType } from 'vue';
import { cx } from '../internal.js';

/** Button primitive: `hl-button` with intent/variant/size modifiers. */
export const Button = defineComponent({
  name: 'HlButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<'solid' | 'soft' | 'outline' | 'ghost' | 'link'>,
      default: undefined,
    },
    intent: {
      type: String as PropType<'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info'>,
      default: undefined,
    },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: undefined },
    block: { type: Boolean, default: false },
    icon: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
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
