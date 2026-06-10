import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue';
import {
  combine,
  enhanceDrawer,
  enhanceModal,
  enhanceTooltip,
  onClickOutside,
  onEscape,
  type DialogApi,
  type Disposer,
} from '@hydrateless/enhancers';
import { cx, useHostEnhancer } from '../internal.js';

function useDialogEnhancer(
  props: { open: boolean; closeOnBackdrop: boolean },
  emit: (e: 'update:open', open: boolean) => void,
  enhance: typeof enhanceModal,
) {
  const { host, api } = useHostEnhancer<DialogApi>((el) =>
    enhance(el, {
      closeOnBackdrop: props.closeOnBackdrop,
      onOpenChange: (open) => emit('update:open', open),
    }),
  );
  onMounted(() => {
    if (props.open) api.value?.setOpen(true);
  });
  watch(
    () => props.open,
    (open) => api.value?.setOpen(open),
  );
  return host;
}

/**
 * Controlled dialog overlay on the native `<dialog>` plus the modal enhancer
 * (focus trap, scroll-lock, background `inert`). Drive with `v-model:open`;
 * Escape and backdrop clicks emit `update:open`. Compose with `<ModalHeader>`,
 * `<ModalBody>`, `<ModalFooter>`.
 */
export const Modal = defineComponent({
  name: 'HlModal',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: true },
    closeOnBackdrop: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = useDialogEnhancer(props, emit, enhanceModal);
    return () =>
      h(
        'dialog',
        {
          ...attrs,
          class: cx('hl-modal', attrs.class as string),
          'data-hl-modal': '',
          ref: host,
        },
        slots.default?.(),
      );
  },
});

/**
 * Controlled off-canvas panel on the native `<dialog>` plus the drawer
 * enhancer. Drive with `v-model:open`; choose a `side`. Compose with
 * `<DrawerHeader>`, `<DrawerBody>`, `<DrawerFooter>`.
 */
export const Drawer = defineComponent({
  name: 'HlDrawer',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: true },
    side: { type: String as PropType<'left' | 'right'>, default: 'right' },
    closeOnBackdrop: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = useDialogEnhancer(props, emit, enhanceDrawer);
    return () =>
      h(
        'dialog',
        {
          ...attrs,
          class: cx('hl-drawer', attrs.class as string),
          'data-hl-drawer': '',
          'data-side': props.side,
          ref: host,
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

/**
 * Controlled floating content. Visibility follows `open`; Escape and outside
 * clicks emit `update:open` so `v-model:open` can dismiss it. Pair with your
 * own trigger.
 */
export const Popover = defineComponent({
  name: 'HlPopover',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    let dispose: Disposer | null = null;

    const sync = () => {
      dispose?.();
      dispose = null;
      const el = host.value;
      if (!el || !props.open) return;
      const dismiss = () => emit('update:open', false);
      dispose = combine([onClickOutside(el, dismiss), onEscape(dismiss, el.ownerDocument)]);
    };
    onMounted(sync);
    watch(() => props.open, sync);
    onBeforeUnmount(() => {
      dispose?.();
      dispose = null;
    });

    return () =>
      h(
        'div',
        { ...attrs, 'data-hl-popover': '', role: 'dialog', hidden: !props.open, ref: host },
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
    let destroy: Disposer | null = null;
    onMounted(() => {
      const trigger = host.value?.querySelector<HTMLElement>(':scope > :first-child');
      if (trigger) {
        trigger.setAttribute('data-hl-tooltip', tipId);
        trigger.setAttribute('aria-describedby', tipId);
      }
      if (host.value) destroy = enhanceTooltip(host.value).destroy;
    });
    onBeforeUnmount(() => {
      destroy?.();
      destroy = null;
    });
    return () =>
      h('span', { ...attrs, ref: host, style: 'position:relative;display:inline-block' }, [
        slots.default?.(),
        h('span', { id: tipId, role: 'tooltip', hidden: true }, props.label ?? slots.label?.()),
      ]);
  },
});
