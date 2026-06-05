import {
  defineEnhancer,
  createFocusTrap,
  lockScroll,
  setBackgroundInert,
  resolveRef,
  setAttrs,
  ensureId,
  noop,
  type FocusTrap,
  type Disposer,
} from '../core/index.js';

export type EnhanceModalOptions = {
  /** Dismiss the dialog when its backdrop is clicked. Defaults to `true`. */
  closeOnBackdrop?: boolean;
};

/**
 * Wire a native `<dialog data-hl-modal>` to its `[data-hl-modal-open]` triggers
 * and `[data-hl-modal-close]` buttons, layering on a focus trap, body
 * scroll-lock, and a background `inert` barrier for assistive tech. The browser
 * still provides top-layer rendering and Escape-to-close for free.
 */
export const enhanceModal = defineEnhancer<EnhanceModalOptions>({
  name: 'modal',
  selector: 'dialog[data-hl-modal]',
  defaults: { closeOnBackdrop: true },
  setup({ root, options, on, add }) {
    const dialog = root as HTMLDialogElement;
    const doc = dialog.ownerDocument;

    if (!dialog.getAttribute('aria-labelledby')) {
      const header = dialog.querySelector('.hl-modal-header');
      if (header) setAttrs(dialog, { 'aria-labelledby': ensureId(header, 'hl-modal-title') });
    }

    let trap: FocusTrap | null = null;
    let releaseScroll: Disposer = noop;
    let releaseInert: Disposer = noop;

    const teardown = () => {
      trap?.deactivate();
      releaseScroll();
      releaseScroll = noop;
      releaseInert();
      releaseInert = noop;
    };

    const open = () => {
      if (!dialog.open) dialog.showModal();
      trap ??= createFocusTrap(dialog);
      trap.activate();
      releaseScroll = lockScroll(doc);
      releaseInert = setBackgroundInert(dialog);
    };

    const close = () => {
      teardown();
      if (dialog.open) dialog.close();
    };

    const openers = Array.from(doc.querySelectorAll<HTMLElement>('[data-hl-modal-open]')).filter(
      (opener) => resolveRef(doc, opener.getAttribute('data-hl-modal-open')) === dialog,
    );
    for (const opener of openers) {
      on(opener, 'click', (e) => {
        e.preventDefault();
        open();
      });
    }

    for (const closer of dialog.querySelectorAll<HTMLElement>('[data-hl-modal-close]')) {
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

    on(dialog, 'close', teardown);
    add(teardown);
  },
});
