import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue';
import { enhanceTooltip } from '@hydrateless/enhancers';
import { cx } from '../internal.js';

function useDialog(props: { open: boolean }, emit: (e: 'close') => void) {
  const el = ref<HTMLDialogElement | null>(null);
  const sync = () => {
    const dialog = el.value;
    if (!dialog) return;
    if (props.open && !dialog.open) dialog.showModal();
    else if (!props.open && dialog.open) dialog.close();
  };
  onMounted(() => {
    el.value?.addEventListener('close', () => emit('close'));
    sync();
  });
  watch(() => props.open, sync);
  return el;
}

/**
 * Controlled dialog overlay on the native `<dialog>`. Drive with `open`; listen
 * for `close` (fired on Escape/backdrop). Compose with `<ModalHeader>`,
 * `<ModalBody>`, `<ModalFooter>`.
 */
export const Modal = defineComponent({
  name: 'HlModal',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: true },
    closeOnBackdrop: { type: Boolean, default: true },
  },
  emits: ['close'],
  setup(props, { slots, attrs, emit }) {
    const el = useDialog(props, emit);
    const onClick = (e: MouseEvent) => {
      if (props.closeOnBackdrop && e.target === el.value) emit('close');
    };
    return () =>
      h(
        'dialog',
        { ...attrs, class: cx('hydrateless-modal', attrs.class as string), ref: el, onClick },
        slots.default?.(),
      );
  },
});

/**
 * Controlled off-canvas panel on the native `<dialog>`. Drive with `open`;
 * choose a `side`. Compose with `<DrawerHeader>`, `<DrawerBody>`,
 * `<DrawerFooter>`.
 */
export const Drawer = defineComponent({
  name: 'HlDrawer',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: true },
    side: { type: String as PropType<'left' | 'right'>, default: 'right' },
    closeOnBackdrop: { type: Boolean, default: true },
  },
  emits: ['close'],
  setup(props, { slots, attrs, emit }) {
    const el = useDialog(props, emit);
    const onClick = (e: MouseEvent) => {
      if (props.closeOnBackdrop && e.target === el.value) emit('close');
    };
    return () =>
      h(
        'dialog',
        {
          ...attrs,
          class: cx('hydrateless-drawer', attrs.class as string),
          'data-side': props.side,
          ref: el,
          onClick,
        },
        slots.default?.(),
      );
  },
});

function section(name: string, klass: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      return () =>
        h('div', { ...attrs, class: cx(klass, attrs.class as string) }, slots.default?.());
    },
  });
}

export const ModalHeader = section('HlModalHeader', 'hl-modal-header');
export const ModalBody = section('HlModalBody', 'hl-modal-body');
export const ModalFooter = section('HlModalFooter', 'hl-modal-footer');
export const DrawerHeader = section('HlDrawerHeader', 'hl-drawer-header');
export const DrawerBody = section('HlDrawerBody', 'hl-drawer-body');
export const DrawerFooter = section('HlDrawerFooter', 'hl-drawer-footer');

/** Controlled floating content. Visibility follows `open`. Pair with your own trigger. */
export const Popover = defineComponent({
  name: 'HlPopover',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        { ...attrs, 'data-hl-popover': '', role: 'dialog', hidden: !props.open },
        slots.default?.(),
      );
  },
});

let tipCounter = 0;

/**
 * Accessible tooltip wrapping a single focusable trigger (the default slot).
 * The hint text comes from the `label` prop or `label` slot.
 */
export const Tooltip = defineComponent({
  name: 'HlTooltip',
  inheritAttrs: false,
  props: {
    label: { type: String, default: undefined },
    id: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const tipId = props.id ?? `hl-tip-${(tipCounter += 1)}`;
    const host = ref<HTMLElement | null>(null);
    let dispose: (() => void) | null = null;
    onMounted(() => {
      const trigger = host.value?.querySelector<HTMLElement>(':scope > :first-child');
      if (trigger) {
        trigger.setAttribute('data-hl-tooltip', tipId);
        trigger.setAttribute('aria-describedby', tipId);
      }
      if (host.value) dispose = enhanceTooltip(host.value);
    });
    onBeforeUnmount(() => {
      dispose?.();
      dispose = null;
    });
    return () =>
      h('span', { ...attrs, ref: host, style: 'position:relative;display:inline-block' }, [
        slots.default?.(),
        h('span', { id: tipId, role: 'tooltip', hidden: true }, props.label ?? slots.label?.()),
      ]);
  },
});
