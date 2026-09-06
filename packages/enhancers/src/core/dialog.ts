import { lockScroll } from './scroll-lock.js';
import { ensureId, setAttrs } from './dom.js';
import { noop, type Disposer } from './lifecycle.js';
import { Events } from './events.js';
import type { EnhancerContext } from './define.js';

/** Shared options for the modal and drawer dialog enhancers. */
export type DialogOptions = {
  /**
   * Enable native light-dismiss (Escape and backdrop click) by setting the
   * `closedby="any"` attribute. Defaults to `true`. Authors can set `closedby`
   * directly in markup so dismissal works with no JavaScript at all.
   */
  closeOnBackdrop?: boolean;
  /** Open the dialog immediately on enhance. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called after the dialog opens or closes (including native Escape). */
  onOpenChange?: (open: boolean) => void;
};

/** Imperative handle shared by the modal and drawer enhancers. */
export type DialogApi = {
  /** Whether the dialog is currently open. */
  readonly open: boolean;
  /** Open or close the dialog. */
  setOpen: (open: boolean) => void;
};

/**
 * Thin upgrade over a native `<dialog>` for the modal and drawer enhancers.
 * The platform already provides everything that used to need JavaScript: a
 * `<button command="show-modal" commandfor="…">` opens the dialog with no
 * script, and `showModal()` supplies the top layer, focus trap, background
 * `inert`, and `::backdrop`. This enhancer only labels the dialog, locks
 * background scroll while it's open, mirrors the native open/close into
 * `onOpenChange`/`hl:open-change`, and exposes an imperative API for the
 * controlled framework bindings.
 */
export function setupDialog(
  name: 'modal' | 'drawer',
  { root, options, on, add, emit }: EnhancerContext<DialogOptions>,
): DialogApi {
  const dialog = root as HTMLDialogElement;
  const doc = dialog.ownerDocument;

  if (!dialog.getAttribute('aria-labelledby')) {
    const header = dialog.querySelector(`.hl-${name}-header`);
    if (header) setAttrs(dialog, { 'aria-labelledby': ensureId(header, `hl-${name}-title`) });
  }

  if (options.closeOnBackdrop && !dialog.hasAttribute('closedby')) {
    dialog.setAttribute('closedby', 'any');
  }

  // WebKit supports dialog invokers before closedby. Match native light-dismiss
  // there, including cancel prevention and drags that start inside the panel.
  if (!('closedBy' in dialog)) {
    let pressedBackdrop = false;
    const outside = (event: MouseEvent) => {
      const box = dialog.getBoundingClientRect();
      return (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      );
    };
    on(dialog, 'pointerdown', (event) => {
      const pointer = event as PointerEvent;
      pressedBackdrop = pointer.button === 0 && event.target === dialog && outside(pointer);
    });
    on(dialog, 'click', (event) => {
      const dismiss = pressedBackdrop && event.target === dialog && outside(event as MouseEvent);
      pressedBackdrop = false;
      if (!dismiss || !dialog.open || dialog.getAttribute('closedby') !== 'any') return;
      if ('requestClose' in dialog && typeof dialog.requestClose === 'function')
        dialog.requestClose();
      else {
        const CancelEvent = doc.defaultView?.Event ?? Event;
        if (dialog.dispatchEvent(new CancelEvent('cancel', { cancelable: true }))) dialog.close();
      }
    });
  }

  // A native invoker can open the dialog before a lazy enhancer arrives.
  let releaseScroll: Disposer = dialog.open ? lockScroll(doc) : noop;
  let isOpen = dialog.open;

  const sync = (open: boolean) => {
    if (open === isOpen) return;
    isOpen = open;
    if (open) {
      releaseScroll = lockScroll(doc);
    } else {
      releaseScroll();
      releaseScroll = noop;
    }
    options.onOpenChange?.(open);
    emit(Events.openChange, { open });
  };

  // `toggle` covers every path: Invoker Commands, Escape, backdrop light-
  // dismiss, and the imperative API below. `close` is a backstop for engines
  // that don't yet fire `toggle` on `<dialog>`.
  on(dialog, 'toggle', (e) => sync((e as ToggleEvent).newState === 'open'));
  on(dialog, 'close', () => sync(false));
  add(() => releaseScroll());

  if (options.defaultOpen && !dialog.open) dialog.showModal();

  return {
    get open() {
      return dialog.open;
    },
    setOpen(next) {
      if (next === dialog.open) return;
      if (next) dialog.showModal();
      else dialog.close();
    },
  };
}
