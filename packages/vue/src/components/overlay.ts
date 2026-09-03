import {
  cloneVNode,
  defineComponent,
  h,
  ref,
  useId,
  type ExtractPublicPropTypes,
  type PropType,
  type Ref,
  type ShallowRef,
  type VNode,
} from 'vue';
import {
  enhanceDrawer,
  enhanceModal,
  enhancePopover,
  enhanceTooltip,
  type DialogApi,
  type DialogOptions,
  type EnhancePopoverOptions,
  type EnhanceTooltipOptions,
  type PopoverApi,
  type TooltipApi,
} from '@hydrateless/enhancers';
import { cx, part, useApiSync, useControlled, type Controlled } from '../internal/index.js';
import { useEnhancer } from '../useEnhancer.js';

const openProps = {
  /** Controlled open state (`v-model:open`). */
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  /** Open initially for uncontrolled usage. */
  defaultOpen: { type: Boolean, default: false },
} as const;

type OpenEmit = (event: 'update:open', open: boolean | undefined) => void;

/** Controlled/uncontrolled `open` plus the sync into an `open`/`setOpen` API. */
function useOpen<Api extends { readonly open: boolean; setOpen: (open: boolean) => void }>(
  props: { open?: boolean; defaultOpen?: boolean },
  emit: OpenEmit,
  attach: (open: Controlled<boolean | undefined>) => ShallowRef<Api | null>,
) {
  const open = useControlled<boolean | undefined, 'update:open'>(props, emit, {
    prop: 'open',
    event: 'update:open',
    default: props.defaultOpen ?? false,
  });
  const api = attach(open);
  useApiSync<Api, boolean | undefined>(
    api,
    open.value,
    (a) => a.open,
    (a, v) => a.setOpen(v),
  );
  return open.value;
}

/** Dialog options shared by {@link Modal} and {@link Drawer}. */
function useDialog(
  host: Ref<HTMLElement | null>,
  enhance: typeof enhanceModal,
  props: { open?: boolean; defaultOpen: boolean; closeOnBackdrop: boolean },
  emit: OpenEmit,
) {
  return useOpen<DialogApi>(props, emit, (open) =>
    useEnhancer<DialogOptions, DialogApi>(
      host,
      enhance,
      () => ({
        closeOnBackdrop: props.closeOnBackdrop,
        defaultOpen: open.value.value,
        onOpenChange: open.set,
      }),
      () => props.closeOnBackdrop,
    ),
  );
}

const modalProps = {
  ...openProps,
  /** Let Escape and backdrop clicks close the dialog (`closedby="any"`). */
  closeOnBackdrop: { type: Boolean, default: true },
} as const;

/** Props for {@link Modal}. */
export type ModalProps = ExtractPublicPropTypes<typeof modalProps>;

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
  props: modalProps,
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    useDialog(host, enhanceModal, props, emit);
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

const drawerProps = {
  ...modalProps,
  /** Edge the panel slides in from (logical, so `end` is the right in LTR). */
  side: { type: String as PropType<'start' | 'end'>, default: 'end' },
} as const;

/** Props for {@link Drawer}. */
export type DrawerProps = ExtractPublicPropTypes<typeof drawerProps>;

/**
 * Off-canvas panel on the native `<dialog>` plus the drawer enhancer. Open
 * state works uncontrolled (`defaultOpen`, or an invoker button) or with
 * `v-model:open`; choose a `side`. Compose with `<DrawerHeader>`,
 * `<DrawerBody>`, `<DrawerFooter>`.
 */
export const Drawer = defineComponent({
  name: 'HlDrawer',
  inheritAttrs: false,
  props: drawerProps,
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    useDialog(host, enhanceDrawer, props, emit);
    return () =>
      h(
        'dialog',
        {
          ...attrs,
          class: cx('hl-drawer', attrs.class as string),
          'data-hl-drawer': '',
          'data-hl-side': props.side,
          ref: host,
        },
        slots.default?.(),
      );
  },
});

/** Props for {@link ModalHeader}. */
export type ModalHeaderProps = Record<never, never>;
/** Props for {@link ModalBody}. */
export type ModalBodyProps = Record<never, never>;
/** Props for {@link ModalFooter}. */
export type ModalFooterProps = Record<never, never>;
/** Props for {@link DrawerHeader}. */
export type DrawerHeaderProps = Record<never, never>;
/** Props for {@link DrawerBody}. */
export type DrawerBodyProps = Record<never, never>;
/** Props for {@link DrawerFooter}. */
export type DrawerFooterProps = Record<never, never>;

const section = (name: string, klass: string) => part(name, 'div', klass);

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

const popoverProps = {
  ...openProps,
  placement: { type: String as PropType<EnhancePopoverOptions['placement']>, default: undefined },
  /** Open on pointer hover and focus of the invoker instead of click. */
  hover: { type: Boolean, default: false },
} as const;

/** Props for {@link Popover}. */
export type PopoverProps = ExtractPublicPropTypes<typeof popoverProps>;

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
  props: popoverProps,
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    useOpen<PopoverApi>(props, emit, (open) =>
      useEnhancer(
        host,
        enhancePopover,
        () => ({
          placement: props.placement,
          triggerEvent: props.hover ? ('hover' as const) : ('click' as const),
          defaultOpen: open.value.value,
          onOpenChange: open.set,
        }),
        () => [props.placement, props.hover],
      ),
    );
    return () =>
      h(
        'div',
        { ...attrs, 'data-hl-popover': '', popover: 'auto', role: 'dialog', ref: host },
        slots.default?.(),
      );
  },
});

const tooltipProps = {
  /** Hint text; the `content` slot takes precedence. */
  content: { type: String, default: undefined },
  placement: { type: String as PropType<EnhanceTooltipOptions['placement']>, default: undefined },
  /** Delay in ms before showing on hover. */
  showDelay: { type: Number, default: undefined },
  /** Grace period in ms before hiding. */
  hideDelay: { type: Number, default: undefined },
  /** Controlled visibility (`v-model:open`). */
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
} as const;

/** Props for {@link Tooltip}. */
export type TooltipProps = ExtractPublicPropTypes<typeof tooltipProps>;

/**
 * Accessible tooltip wrapping a single focusable trigger (the default slot),
 * which receives `data-hl-tooltip` and `aria-describedby`. The hint comes
 * from `content` (prop or slot). Visibility is observable with
 * `v-model:open`.
 */
export const Tooltip = defineComponent({
  name: 'HlTooltip',
  inheritAttrs: false,
  props: tooltipProps,
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const host = ref<HTMLElement | null>(null);
    const tipId = useId();
    useOpen<TooltipApi>(props, emit, (open) =>
      useEnhancer(
        host,
        enhanceTooltip,
        () => ({
          placement: props.placement,
          showDelay: props.showDelay,
          hideDelay: props.hideDelay,
          onOpenChange: open.set,
        }),
        () => [props.placement, props.showDelay, props.hideDelay],
      ),
    );
    return () => {
      const [trigger] = (slots.default?.() ?? []) as VNode[];
      return h('span', { ...attrs, ref: host }, [
        trigger && cloneVNode(trigger, { 'data-hl-tooltip': tipId, 'aria-describedby': tipId }),
        h('span', { id: tipId, role: 'tooltip' }, slots.content?.() ?? props.content),
      ]);
    };
  },
});
