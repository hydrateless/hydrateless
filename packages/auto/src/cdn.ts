import {
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
import type { ComponentName } from '@hydrateless/enhancers/manifest';
import { createAuto, type AutoOptions, type Run } from './runtime.js';

export type { AutoOptions };

/**
 * All enhancers statically bundled for the self-contained CDN build. Typed as a
 * complete `Record<ComponentName>` so the manifest stays the single source of
 * truth: the build fails if the map drifts from the manifest in either
 * direction.
 */
const runners: Record<ComponentName, Run> = {
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
  toast: enhanceToast,
};

const start = createAuto((name) => runners[name]);

/**
 * Synchronous, fully self-contained variant of `auto()` for the CDN bundle.
 * All enhancers are statically bundled so a single `<script type="module">`
 * works with no import map and no build step. Like `auto()`, it watches the
 * container and enhances markup added later.
 */
export function autoSync(
  container: Document | HTMLElement = document,
  options: AutoOptions = {},
): Disposer {
  return start(container, options).dispose;
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => autoSync());
  } else {
    autoSync();
  }
}
