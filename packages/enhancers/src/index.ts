// Components
export { enhanceAccordion, type EnhanceAccordionOptions } from './accordion/index.js';
export { enhanceDisclosure, type EnhanceDisclosureOptions } from './disclosure/index.js';
export { enhanceTabs, type EnhanceTabsOptions } from './tabs/index.js';
export { enhanceDropdown, type EnhanceDropdownOptions } from './dropdown/index.js';
export { enhanceMenu, type EnhanceMenuOptions } from './menu/index.js';
export { enhanceModal, type EnhanceModalOptions } from './modal/index.js';
export { enhanceDrawer, type EnhanceDrawerOptions } from './drawer/index.js';
export { enhancePopover, type EnhancePopoverOptions } from './popover/index.js';
export { enhanceTooltip, type EnhanceTooltipOptions } from './tooltip/index.js';
export { enhanceCombobox, type EnhanceComboboxOptions } from './combobox/index.js';
export { enhanceCommand, type EnhanceCommandOptions } from './command/index.js';
export { enhanceToc, type EnhanceTocOptions } from './toc/index.js';
export {
  enhanceToast,
  type ToastApi,
  type ToastOptions,
  type ToastVariant,
} from './toast/index.js';

// Manifest (single source of truth for the auto-loader)
export { MANIFEST, type ManifestEntry, type ComponentName } from './manifest.js';

// Shared headless core — utilities for building custom enhancers.
export {
  type Disposer,
  noop,
  on,
  combine,
  selectRoots,
  uid,
  defineEnhancer,
  type Enhancer,
  type EnhancerContext,
  type EnhancerDefinition,
  isBrowser,
  resolveRef,
  ensureId,
  setAttrs,
  getDocument,
  getWindow,
  tabbablesIn,
  createFocusTrap,
  type FocusTrap,
  lockScroll,
  setBackgroundInert,
  onClickOutside,
  onEscape,
  type ClickOutsideOptions,
  prefersReducedMotion,
  afterTransition,
  Keys,
  wrapIndex,
  nextIndex,
  createTypeahead,
  type MoveDirection,
  placeFloating,
  type Placement,
  type Side,
  type Align,
  type PositionOptions,
  type PositionResult,
} from './core/index.js';
