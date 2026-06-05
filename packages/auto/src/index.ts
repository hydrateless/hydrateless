import { MANIFEST } from '@hydrateless/enhancers/manifest';
import type { Disposer } from '@hydrateless/enhancers/core';

type Run = (container: Document | HTMLElement) => Disposer;

/**
 * Lazy loaders keyed by component name. Each returns the enhancer's run
 * function; toast's `{ destroy }` API is normalized to a disposer. Static
 * `import()` specifiers keep every component in its own chunk so only the
 * enhancers a page actually needs are ever fetched.
 */
const loaders: Record<string, () => Promise<Run>> = {
  accordion: () => import('@hydrateless/enhancers/accordion').then((m) => m.enhanceAccordion),
  tabs: () => import('@hydrateless/enhancers/tabs').then((m) => m.enhanceTabs),
  disclosure: () => import('@hydrateless/enhancers/disclosure').then((m) => m.enhanceDisclosure),
  modal: () => import('@hydrateless/enhancers/modal').then((m) => m.enhanceModal),
  drawer: () => import('@hydrateless/enhancers/drawer').then((m) => m.enhanceDrawer),
  popover: () => import('@hydrateless/enhancers/popover').then((m) => m.enhancePopover),
  tooltip: () => import('@hydrateless/enhancers/tooltip').then((m) => m.enhanceTooltip),
  dropdown: () => import('@hydrateless/enhancers/dropdown').then((m) => m.enhanceDropdown),
  menu: () => import('@hydrateless/enhancers/menu').then((m) => m.enhanceMenu),
  combobox: () => import('@hydrateless/enhancers/combobox').then((m) => m.enhanceCombobox),
  command: () => import('@hydrateless/enhancers/command').then((m) => m.enhanceCommand),
  toc: () => import('@hydrateless/enhancers/toc').then((m) => m.enhanceToc),
  toast: () =>
    import('@hydrateless/enhancers/toast').then(
      (m) => (c: Document | HTMLElement) => m.enhanceToast(c).destroy,
    ),
};

/**
 * Detect `data-hl-*` markup in `container` and lazy-load the matching enhancers
 * in parallel. Returns a disposer that tears down everything it initialized —
 * useful for single-page apps that mount and unmount views.
 */
export async function auto(container: Document | HTMLElement = document): Promise<Disposer> {
  const pending: Promise<Disposer>[] = [];

  for (const { name, selector } of MANIFEST) {
    if (!container.querySelector(selector)) continue;
    const load = loaders[name];
    if (load) pending.push(load().then((run) => run(container)));
  }

  const disposers = await Promise.all(pending);
  return () => {
    for (const dispose of disposers) dispose();
  };
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => void auto());
  } else {
    void auto();
  }
}
