import {
  MANIFEST,
  enhanceAccordion,
  enhanceTabs,
  enhanceDisclosure,
  enhanceModal,
  enhanceDrawer,
  enhancePopover,
  enhanceTooltip,
  enhanceDropdown,
  enhanceMenu,
  enhanceCombobox,
  enhanceCommand,
  enhanceToc,
  enhanceToast,
  type Disposer,
} from '@hydrateless/enhancers';

type Run = (container: Document | HTMLElement) => Disposer;

/** All enhancers statically bundled for the self-contained CDN build. */
const runners: Record<string, Run> = {
  accordion: enhanceAccordion,
  tabs: enhanceTabs,
  disclosure: enhanceDisclosure,
  modal: enhanceModal,
  drawer: enhanceDrawer,
  popover: enhancePopover,
  tooltip: enhanceTooltip,
  dropdown: enhanceDropdown,
  menu: enhanceMenu,
  combobox: enhanceCombobox,
  command: enhanceCommand,
  toc: enhanceToc,
  toast: (c) => enhanceToast(c).destroy,
};

/**
 * Synchronous, fully self-contained variant of `auto()` for the CDN bundle. All
 * enhancers are statically bundled so a single `<script type="module">` works
 * with no import map and no build step.
 */
export function autoSync(container: Document | HTMLElement = document): Disposer {
  const disposers: Disposer[] = [];

  for (const { name, selector } of MANIFEST) {
    if (!container.querySelector(selector)) continue;
    const run = runners[name];
    if (run) disposers.push(run(container));
  }

  return () => {
    for (const dispose of disposers) dispose();
  };
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => autoSync());
  } else {
    autoSync();
  }
}
