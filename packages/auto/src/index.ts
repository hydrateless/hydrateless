import type { Disposer } from '@hydrateless/enhancers';

/**
 * Detects `data-hl-*` attributes in the given root and lazy-loads the matching
 * enhancers in parallel. Returns a disposer that tears down everything it
 * initialized — useful for single-page apps that mount and unmount views.
 */
export async function auto(container: Document | HTMLElement = document): Promise<Disposer> {
  const has = (sel: string) => !!container.querySelector(sel);

  const pending: Promise<Disposer>[] = [];

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

  if (has('[data-hl-dropdown]')) {
    pending.push(
      import('@hydrateless/enhancers/dropdown').then((m) => m.enhanceDropdown(container)),
    );
  }

  if (has('[data-hl-toast-region], [data-hl-toast-trigger]')) {
    pending.push(
      import('@hydrateless/enhancers/toast').then((m) => {
        const api = m.enhanceToast(container);
        return api.destroy;
      }),
    );
  }

  const disposers = await Promise.all(pending);
  return () => {
    for (const dispose of disposers) dispose();
  };
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
