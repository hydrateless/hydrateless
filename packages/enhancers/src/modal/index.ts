import { createFocusTrap } from '../utils/focusTrap.js';

export type EnhanceModalOptions = {
  closeOnBackdrop?: boolean;
};

export function enhanceModal(
  container: Document | HTMLElement = document,
  options: EnhanceModalOptions = {},
): void {
  const { closeOnBackdrop = true } = options;
  const dialogs = Array.from(
    container.querySelectorAll<HTMLDialogElement>('dialog[data-hl-modal]'),
  );
  const openers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-modal-open]'));
  const closers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-modal-close]'));

  const dialogToTrap = new Map<HTMLDialogElement, ReturnType<typeof createFocusTrap>>();

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
    const selector = opener.getAttribute('data-hl-modal-open');
    if (!selector) continue;
    opener.addEventListener('click', (e) => {
      e.preventDefault();
      const id = selector.startsWith('#') ? selector.slice(1) : selector;
      openById(id);
    });
  }

  for (const closer of closers) {
    closer.addEventListener('click', (e) => {
      e.preventDefault();
      const dialog = (closer.closest('dialog[data-hl-modal]') ??
        container.querySelector('dialog[data-hl-modal][open]')) as HTMLDialogElement | null;
      if (dialog) closeDialog(dialog);
    });
  }

  for (const dialog of dialogs) {
    dialog.addEventListener('close', () => {
      const trap = dialogToTrap.get(dialog);
      if (trap) trap.deactivate();
    });

    if (closeOnBackdrop) {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeDialog(dialog);
      });
    }
  }
}
