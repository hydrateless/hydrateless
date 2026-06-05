import {
  enhanceAccordion,
  enhanceTabs,
  enhanceDisclosure,
  enhanceModal,
  enhanceToc,
  enhanceDrawer,
  enhancePopover,
  enhanceTooltip,
  enhanceDropdown,
  enhanceToast,
  type Disposer,
} from '@hydrateless/enhancers';

/**
 * Synchronous, fully self-contained variant of `auto()` used for the CDN
 * bundle. All enhancers are statically bundled into this file so a single
 * `<script type="module">` works with no import map and no build step.
 */
export function autoSync(container: Document | HTMLElement = document): Disposer {
  const has = (sel: string) => !!container.querySelector(sel);
  const disposers: Disposer[] = [];

  if (has('[data-hl-accordion]')) disposers.push(enhanceAccordion(container));
  if (has('[data-hl-tabs]')) disposers.push(enhanceTabs(container));
  if (has('details[data-hl-disclosure]')) disposers.push(enhanceDisclosure(container));
  if (has('dialog[data-hl-modal], [data-hl-modal-open]')) disposers.push(enhanceModal(container));
  if (has('[data-hl-toc]')) disposers.push(enhanceToc(container));
  if (has('dialog.hydrateless-drawer[data-hl-drawer], [data-hl-drawer-open]'))
    disposers.push(enhanceDrawer(container));
  if (has('[popover], [data-hl-popover], [data-hl-popover-open]'))
    disposers.push(enhancePopover(container));
  if (has('[data-hl-tooltip]')) disposers.push(enhanceTooltip(container));
  if (has('[data-hl-dropdown]')) disposers.push(enhanceDropdown(container));
  if (has('[data-hl-toast-region], [data-hl-toast-trigger]'))
    disposers.push(enhanceToast(container).destroy);

  return () => {
    for (const dispose of disposers) dispose();
  };
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      autoSync();
    });
  } else {
    autoSync();
  }
}
