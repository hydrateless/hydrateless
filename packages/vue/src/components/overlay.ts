import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue';
import {
  enhanceDrawer,
  enhanceModal,
  enhancePopover,
  enhanceTooltip,
  type DialogApi,
  type Disposer,
  type PopoverApi,
} from '@hydrateless/enhancers';
import { cx } from '../internal.js';
import { useEnhancer } from '../useEnhancer.js';

function useDialogEnhancer(
  props: { open?: boolean; defaultOpen: boolean; closeOnBackdrop: boolean },
  emit: (e: 'update:open', open: boolean) => void,
  enhance: typeof enhanceModal,
) {
  const { host, api } = useEnhancer<DialogApi>(
    (el) =>
      enhance(el, {
        closeOnBackdrop: props.closeOnBackdrop,
        defaultOpen: props.open ?? props.defaultOpen,
        onOpenChange: (open) => emit('update:open', open),
      }),
    () => props.closeOnBackdrop,
  );
  watch(
    () => props.open,
    (open) => {
      if (open != null) api.value?.setOpen(open);
    },
  );
  return host;
}

/**
 * Dialog overlay on the native `<dialog>` plus the modal enhancer (focus
 * trap, scroll-lock, background `inert`). Open state works uncontrolled
 * (`defaultOpen`, or a `command="show-modal"` invoker button) or with
 * `v-model:open`; Escape and backdrop clicks emit `update:open`. Compose
 * with `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>`.
 */
export const Modal = defineComponent({
  name: 'HlModal',
  inheritAttrs: false,
  props: {
    /** Controlled open state (`v-model:open`). */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Open the dialog initially for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
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
 * Off-canvas panel on the native `<dialog>` plus the drawer enhancer. Open
 * state works uncontrolled (`defaultOpen`, or an invoker button) or with
 * `v-model:open`; choose a `side`. Compose with `<DrawerHeader>`,
 * `<DrawerBody>`, `<DrawerFooter>`.
 */
export const Drawer = defineComponent({
  name: 'HlDrawer',
  inheritAttrs: false,
  props: {
    /** Controlled open state (`v-model:open`). */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Open the drawer initially for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
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

/** Header region of a {@link Modal}. */
export const ModalHeader = section('HlModalHeader', 'hl-modal-header');
/** Body region of a {@link Modal}. */
export const ModalBody = section('HlModalBody', 'hl-modal-body');
/** Footer region of a {@link Modal}. */
export const ModalFooter = section('HlModalFooter', 'hl-modal-footer');
/** Header region of a {@link Drawer}. */
export const DrawerHeader = section('HlDrawerHeader', 'hl-drawer-header');
/** Body region of a {@link Drawer}. */
export const DrawerBody = section('HlDrawerBody', 'hl-drawer-body');
/** Footer region of a {@link Drawer}. */
export const DrawerFooter = section('HlDrawerFooter', 'hl-drawer-footer');

/**
 * Floating content built on the native Popover API. The surface lives in the
 * top layer with light-dismiss and Escape handled by the browser; visibility
 * works uncontrolled (`defaultOpen`, or a `popovertarget` trigger button) or
 * with `v-model:open` (`update:open` is emitted when the browser dismisses
 * it).
 */
export const Popover = defineComponent({
  name: 'HlPopover',
  inheritAttrs: false,
  props: {
    /** Controlled open state (`v-model:open`). */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Show the popover initially for uncontrolled usage. */
    defaultOpen: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const { host, api } = useEnhancer<PopoverApi>((el) =>
      enhancePopover(el, {
        defaultOpen: props.open ?? props.defaultOpen,
        onOpenChange: (open) => emit('update:open', open),
      }),
    );
    watch(
      () => props.open,
      (open) => {
        if (open != null) api.value?.setOpen(open);
      },
    );

    return () =>
      h(
        'div',
        { ...attrs, 'data-hl-popover': '', popover: 'auto', role: 'dialog', ref: host },
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
