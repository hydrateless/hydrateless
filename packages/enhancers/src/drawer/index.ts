import { combine, on, type Disposer } from '../utils/lifecycle.js';

type DrawerOptions = {
  closeOnBackdrop?: boolean;
};

const enhanced = new WeakSet<Element>();

export function enhanceDrawer(
  container: Document | HTMLElement = document,
  options: DrawerOptions = {},
): Disposer {
  const { closeOnBackdrop = true } = options;
  const drawers = Array.from(
    container.querySelectorAll<HTMLDialogElement>('dialog.hydrateless-drawer[data-hl-drawer]'),
  );
  const openers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-drawer-open]'));
  const closers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-drawer-close]'));
  const disposers: Disposer[] = [];

  function openById(id: string): void {
    const dlg = container.querySelector<HTMLDialogElement>(`dialog#${CSS.escape(id)}`);
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();
  }
  function closeDlg(dlg: HTMLDialogElement): void {
    if (dlg.open) dlg.close();
  }

  for (const opener of openers) {
    if (enhanced.has(opener)) continue;
    const ref = opener.getAttribute('data-hl-drawer-open');
    if (!ref) continue;
    enhanced.add(opener);
    disposers.push(() => enhanced.delete(opener));
    disposers.push(
      on(opener, 'click', (e) => {
        e.preventDefault();
        const id = ref.startsWith('#') ? ref.slice(1) : ref;
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
        const dlg = (closer.closest('dialog.hydrateless-drawer') ??
          container.querySelector('dialog.hydrateless-drawer[open]')) as HTMLDialogElement | null;
        if (dlg) closeDlg(dlg);
      }),
    );
  }

  if (closeOnBackdrop) {
    for (const dlg of drawers) {
      if (enhanced.has(dlg)) continue;
      enhanced.add(dlg);
      disposers.push(() => enhanced.delete(dlg));
      disposers.push(
        on(dlg, 'click', (e) => {
          if (e.target === dlg) closeDlg(dlg);
        }),
      );
    }
  }

  return combine(disposers);
}
