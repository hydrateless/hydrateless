import { createFocusTrap, type FocusTrap } from './focus.js';
import { lockScroll } from './scroll-lock.js';
import { setBackgroundInert } from './inert.js';
import { resolveRef, ensureId, setAttrs } from './dom.js';
import { noop, type Disposer } from './lifecycle.js';
import { Events } from './events.js';
import type { EnhancerContext } from './define.js';

/** Shared options for the modal and drawer dialog enhancers. */
export type DialogOptions = {
  /** Dismiss the dialog when its backdrop is clicked. Defaults to `true`. */
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
 * Shared behavior behind the modal and drawer enhancers: wire a native
 * `<dialog>` to its `[data-hl-<name>-open]` / `[data-hl-<name>-close]`
 * triggers and layer on a focus trap, body scroll-lock, and a background
 * `inert` barrier. The browser still provides top-layer rendering and
 * Escape-to-close for free; both paths funnel through one notifier so
 * `onOpenChange`/`hl:open-change` fire exactly once per transition.
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

  let trap: FocusTrap | null = null;
  let releaseScroll: Disposer = noop;
  let releaseInert: Disposer = noop;
  let isOpen = dialog.open;

  const notify = (open: boolean) => {
    if (open === isOpen) return;
    isOpen = open;
    options.onOpenChange?.(open);
    emit(Events.openChange, { open });
  };

  const teardown = () => {
    trap?.deactivate();
    releaseScroll();
    releaseScroll = noop;
    releaseInert();
    releaseInert = noop;
  };

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    trap ??= createFocusTrap(dialog);
    trap.activate();
    releaseScroll = lockScroll(doc);
    releaseInert = setBackgroundInert(dialog);
    notify(true);
  };

  const close = () => {
    teardown();
    if (dialog.open) dialog.close();
    notify(false);
  };

  const openers = Array.from(doc.querySelectorAll<HTMLElement>(`[data-hl-${name}-open]`)).filter(
    (opener) => resolveRef(doc, opener.getAttribute(`data-hl-${name}-open`)) === dialog,
  );
  for (const opener of openers) {
    on(opener, 'click', (e) => {
      e.preventDefault();
      open();
    });
  }

  for (const closer of dialog.querySelectorAll<HTMLElement>(`[data-hl-${name}-close]`)) {
    on(closer, 'click', (e) => {
      e.preventDefault();
      close();
    });
  }

  if (options.closeOnBackdrop) {
    on(dialog, 'click', (e) => {
      if (e.target === dialog) close();
    });
  }

  // Covers native closes (Escape, form method="dialog") as well as `close()`.
  on(dialog, 'close', () => {
    teardown();
    notify(false);
  });
  add(teardown);

  if (options.defaultOpen) open();

  return {
    get open() {
      return dialog.open;
    },
    setOpen(next) {
      if (next) open();
      else close();
    },
  };
}
