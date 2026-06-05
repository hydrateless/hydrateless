import {
  defineEnhancer,
  createFocusTrap,
  lockScroll,
  setBackgroundInert,
  resolveRef,
  noop,
  type FocusTrap,
  type Disposer,
} from '../core/index.js';

export type EnhanceDrawerOptions = {
  /** Dismiss the drawer when its backdrop is clicked. Defaults to `true`. */
  closeOnBackdrop?: boolean;
};

/**
 * A drawer is a native `<dialog data-hl-drawer>` that slides in from a screen
 * edge (the side is chosen in CSS). Shares the modal's focus trap, scroll-lock,
 * and background `inert` behavior; only the presentation differs.
 */
export const enhanceDrawer = defineEnhancer<EnhanceDrawerOptions>({
  name: 'drawer',
  selector: 'dialog[data-hl-drawer]',
  defaults: { closeOnBackdrop: true },
  setup({ root, options, on, add }) {
    const dialog = root as HTMLDialogElement;
    const doc = dialog.ownerDocument;

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

    const openers = Array.from(doc.querySelectorAll<HTMLElement>('[data-hl-drawer-open]')).filter(
      (opener) => resolveRef(doc, opener.getAttribute('data-hl-drawer-open')) === dialog,
    );
    for (const opener of openers) {
      on(opener, 'click', (e) => {
        e.preventDefault();
        open();
      });
    }

    for (const closer of dialog.querySelectorAll<HTMLElement>('[data-hl-drawer-close]')) {
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
