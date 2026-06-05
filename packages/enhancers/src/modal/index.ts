import { createFocusTrap } from '../utils/focusTrap.js';
import { combine, on, type Disposer } from '../utils/lifecycle.js';

export type EnhanceModalOptions = {
  closeOnBackdrop?: boolean;
};

const enhanced = new WeakSet<Element>();

export function enhanceModal(
  container: Document | HTMLElement = document,
  options: EnhanceModalOptions = {},
): Disposer {
  const { closeOnBackdrop = true } = options;
  const dialogs = Array.from(
    container.querySelectorAll<HTMLDialogElement>('dialog[data-hl-modal]'),
  );
  const openers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-modal-open]'));
  const closers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-modal-close]'));

  const dialogToTrap = new Map<HTMLDialogElement, ReturnType<typeof createFocusTrap>>();
  const disposers: Disposer[] = [];

  for (const dialog of dialogs) {
    if (!dialog.getAttribute('aria-labelledby')) {
      const header = dialog.querySelector('.hl-modal-header');
      if (header) {
        if (!header.id) header.id = `hl-modal-header-${Math.random().toString(36).slice(2)}`;
        dialog.setAttribute('aria-labelledby', header.id);
      }
    }
  }

  function openById(targetId: string): void {
    const dialog = container.querySelector<HTMLDialogElement>(`dialog#${CSS.escape(targetId)}`);
    if (!dialog) return;
    if (!dialog.open) {
      dialog.showModal();
    }
    let trap = dialogToTrap.get(dialog);
    if (!trap) {
      trap = createFocusTrap(dialog);
      dialogToTrap.set(dialog, trap);
    }
    trap.activate();
  }

  function closeDialog(dialog: HTMLDialogElement): void {
    const trap = dialogToTrap.get(dialog);
    if (trap) trap.deactivate();
    if (dialog.open) dialog.close();
  }

  for (const opener of openers) {
    if (enhanced.has(opener)) continue;
    const selector = opener.getAttribute('data-hl-modal-open');
    if (!selector) continue;
    enhanced.add(opener);
    disposers.push(() => enhanced.delete(opener));
    disposers.push(
      on(opener, 'click', (e) => {
        e.preventDefault();
        const id = selector.startsWith('#') ? selector.slice(1) : selector;
        openById(id);
      }),
    );
  }

  for (const closer of closers) {
    if (enhanced.has(closer)) continue;
    enhanced.add(closer);
    disposers.push(() => enhanced.delete(closer));
    disposers.push(
      on(closer, 'click', (e) => {
        e.preventDefault();
        const dialog = (closer.closest('dialog[data-hl-modal]') ??
          container.querySelector('dialog[data-hl-modal][open]')) as HTMLDialogElement | null;
        if (dialog) closeDialog(dialog);
      }),
    );
  }

  for (const dialog of dialogs) {
    if (enhanced.has(dialog)) continue;
    enhanced.add(dialog);
    disposers.push(() => enhanced.delete(dialog));

    disposers.push(
      on(dialog, 'close', () => {
        const trap = dialogToTrap.get(dialog);
        if (trap) trap.deactivate();
      }),
    );

    if (closeOnBackdrop) {
      disposers.push(
        on(dialog, 'click', (e) => {
          if (e.target === dialog) closeDialog(dialog);
        }),
      );
    }
  }

  disposers.push(() => {
    for (const trap of dialogToTrap.values()) trap.deactivate();
    dialogToTrap.clear();
  });

  return combine(disposers);
}
