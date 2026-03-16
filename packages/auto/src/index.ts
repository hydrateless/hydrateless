export async function auto(container: Document | HTMLElement = document): Promise<void> {
  const has = (sel: string) => !!container.querySelector(sel);

  const pending: Promise<void>[] = [];

  if (has('[data-hl-accordion]')) {
    pending.push(
      import('@hydrateless/enhancers/accordion').then((m) => m.enhanceAccordion(container)),
    );
  }

  if (has('[data-hl-tabs]')) {
    pending.push(import('@hydrateless/enhancers/tabs').then((m) => m.enhanceTabs(container)));
  }

  if (has('details[data-hl-disclosure]')) {
    pending.push(
      import('@hydrateless/enhancers/disclosure').then((m) => m.enhanceDisclosure(container)),
    );
  }

  if (has('dialog[data-hl-modal], [data-hl-modal-open]')) {
    pending.push(import('@hydrateless/enhancers/modal').then((m) => m.enhanceModal(container)));
  }

  if (has('[data-hl-toc]')) {
    pending.push(import('@hydrateless/enhancers/toc').then((m) => m.enhanceToc(container)));
  }

  if (has('dialog.hydrateless-drawer[data-hl-drawer], [data-hl-drawer-open]')) {
    pending.push(import('@hydrateless/enhancers/drawer').then((m) => m.enhanceDrawer(container)));
  }

  if (has('[popover], [data-hl-popover], [data-hl-popover-open]')) {
    pending.push(import('@hydrateless/enhancers/popover').then((m) => m.enhancePopover(container)));
  }

  if (has('[data-hl-tooltip]')) {
    pending.push(import('@hydrateless/enhancers/tooltip').then((m) => m.enhanceTooltip(container)));
  }

  await Promise.all(pending);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      void auto();
    });
  } else {
    void auto();
  }
}
