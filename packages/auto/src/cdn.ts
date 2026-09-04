import {
  enhanceAccordion,
  enhanceAlert,
  enhanceCheckbox,
  enhanceTabs,
  enhanceDisclosure,
  enhanceModal,
  enhanceDrawer,
  enhancePagination,
  enhancePopover,
  enhanceSegmented,
  enhanceSlider,
  enhanceTable,
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
import { createAuto, shouldAutoStart, type AutoOptions, type Run } from './runtime.js';

export type { AutoOptions };

/**
 * All enhancers statically bundled for the self-contained CDN build. Typed as a
 * complete `Record<ComponentName>` so the manifest stays the single source of
 * truth: the build fails if the map drifts from the manifest in either
 * direction.
 */
const runners: Record<ComponentName, Run> = {
  accordion: enhanceAccordion,
  alert: enhanceAlert,
  checkbox: enhanceCheckbox,
  tabs: enhanceTabs,
  disclosure: enhanceDisclosure,
  modal: enhanceModal,
  drawer: enhanceDrawer,
  pagination: enhancePagination,
  popover: enhancePopover,
  segmented: enhanceSegmented,
  slider: enhanceSlider,
  table: enhanceTable,
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
export function autoSync(container?: Document | HTMLElement, options: AutoOptions = {}): Disposer {
  return start(container, options).dispose;
}

// Importing the module starts it, unless the page opts out with
// `<html data-hl-manual>` to call `autoSync()` itself.
if (shouldAutoStart()) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => autoSync());
  } else {
    autoSync();
  }
}
