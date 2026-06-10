import type { Disposer } from '@hydrateless/enhancers/core';
import { createAuto, type AutoOptions, type Run } from './runtime.js';

export type { AutoOptions };

/**
 * Lazy loaders keyed by component name. Static `import()` specifiers keep
 * every component in its own chunk so only the enhancers a page actually
 * needs are ever fetched.
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
  toast: () => import('@hydrateless/enhancers/toast').then((m) => m.enhanceToast),
};

const start = createAuto((name) => loaders[name]?.());

/**
 * Detect `data-hl-*` markup in `container` and lazy-load the matching
 * enhancers in parallel. By default it keeps watching the container, so
 * markup added later (SPA navigations, fetched fragments) is enhanced
 * automatically and instances are disposed when their roots are removed.
 * Returns a disposer that stops watching and tears everything down.
 */
export async function auto(
  container: Document | HTMLElement = document,
  options: AutoOptions = {},
): Promise<Disposer> {
  const controller = start(container, options);
  await controller.ready;
  return controller.dispose;
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => void auto());
  } else {
    void auto();
  }
}
