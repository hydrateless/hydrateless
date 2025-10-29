async function maybeImport(condition: boolean, loader: () => Promise<void>): Promise<void> {
  if (condition) await loader();
}

export async function auto(container: Document | HTMLElement = document): Promise<void> {
  const has = (sel: string) => !!(container as Document | HTMLElement).querySelector(sel);

  await maybeImport(has('[data-hl-accordion]'), async () => {
    const m = await import('@hydrateless/enhancers/accordion');
    m.enhanceAccordion(container);
  });

  await maybeImport(has('[data-hl-tabs]'), async () => {
    const m = await import('@hydrateless/enhancers/tabs');
    m.enhanceTabs(container);
  });

  await maybeImport(has('details[data-hl-disclosure]'), async () => {
    const m = await import('@hydrateless/enhancers/disclosure');
    m.enhanceDisclosure(container);
  });

  await maybeImport(has('dialog[data-hl-modal], [data-hl-modal-open]'), async () => {
    const m = await import('@hydrateless/enhancers/modal');
    m.enhanceModal(container);
  });

  await maybeImport(has('[data-hl-toc]'), async () => {
    const m = await import('@hydrateless/enhancers/toc');
    m.enhanceToc(container);
  });

  await maybeImport(has('dialog.hydrateless-drawer[data-hl-drawer], [data-hl-drawer-open]'), async () => {
    const m = await import('@hydrateless/enhancers/drawer');
    m.enhanceDrawer(container);
  });

  await maybeImport(has('[popover], [data-hl-popover], [data-hl-popover-open]'), async () => {
    const m = await import('@hydrateless/enhancers/popover');
    m.enhancePopover(container);
  });

  await maybeImport(has('[data-hl-tooltip]'), async () => {
    const m = await import('@hydrateless/enhancers/tooltip');
    m.enhanceTooltip(container);
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => { void auto(); });
  } else {
    void auto();
  }
}
