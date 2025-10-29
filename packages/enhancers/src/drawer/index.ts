type DrawerOptions = {
  closeOnBackdrop?: boolean;
};

export function enhanceDrawer(
  container: Document | HTMLElement = document,
  options: DrawerOptions = {}
): void {
  const { closeOnBackdrop = true } = options;
  const drawers = Array.from(
    container.querySelectorAll<HTMLDialogElement>('dialog.hydrateless-drawer[data-hl-drawer]')
  );
  const openers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-drawer-open]'));
  const closers = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-drawer-close]'));

  function openById(id: string): void {
    const dlg = container.querySelector<HTMLDialogElement>(`dialog#${CSS.escape(id)}`);
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();
  }
  function closeDlg(dlg: HTMLDialogElement): void {
    if (dlg.open) dlg.close();
  }

  for (const opener of openers) {
    const ref = opener.getAttribute('data-hl-drawer-open');
    if (!ref) continue;
    opener.addEventListener('click', (e) => {
      e.preventDefault();
      const id = ref.startsWith('#') ? ref.slice(1) : ref;
      openById(id);
    });
  }

  for (const closer of closers) {
    closer.addEventListener('click', (e) => {
      e.preventDefault();
      const dlg = (closer.closest('dialog.hydrateless-drawer') ??
        container.querySelector('dialog.hydrateless-drawer[open]')) as HTMLDialogElement | null;
      if (dlg) closeDlg(dlg);
    });
  }

  if (closeOnBackdrop) {
    drawers.forEach((dlg) => {
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg) closeDlg(dlg);
      });
    });
  }
}
