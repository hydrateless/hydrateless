// Components
export {
  enhanceAccordion,
  type EnhanceAccordionOptions,
  type AccordionApi,
} from './accordion/index.js';
export {
  enhanceDisclosure,
  type EnhanceDisclosureOptions,
  type DisclosureApi,
} from './disclosure/index.js';
export { enhanceTabs, type EnhanceTabsOptions, type TabsApi } from './tabs/index.js';
export {
  enhanceDropdown,
  type EnhanceDropdownOptions,
  type DropdownApi,
} from './dropdown/index.js';
export { enhanceMenu, type EnhanceMenuOptions, type MenuApi } from './menu/index.js';
export { enhanceModal, type EnhanceModalOptions, type ModalApi } from './modal/index.js';
export { enhanceDrawer, type EnhanceDrawerOptions, type DrawerApi } from './drawer/index.js';
export { enhancePopover, type EnhancePopoverOptions, type PopoverApi } from './popover/index.js';
export { enhanceTooltip, type EnhanceTooltipOptions, type TooltipApi } from './tooltip/index.js';
export {
  enhanceCombobox,
  type EnhanceComboboxOptions,
  type ComboboxApi,
} from './combobox/index.js';
export { enhanceCommand, type EnhanceCommandOptions, type CommandApi } from './command/index.js';
export { enhanceToc, type EnhanceTocOptions, type TocApi } from './toc/index.js';
export {
  enhanceToast,
  type EnhanceToastOptions,
  type ToastApi,
  type ToastOptions,
  type ToastVariant,
} from './toast/index.js';

// Manifest (single source of truth for the auto-loader)
export { MANIFEST, type ManifestEntry, type ComponentName } from './manifest.js';

// Shared headless core: utilities for building custom enhancers.
export {
  type Disposer,
  noop,
  on,
  combine,
  selectRoots,
  uid,
  defineEnhancer,
  toHandle,
  type Enhancer,
  type EnhancerContext,
  type EnhancerDefinition,
  type EnhancerHandle,
  type EnhancerInstance,
  Events,
  emit,
  type EmitOptions,
  isBrowser,
  resolveRef,
  ensureId,
  setAttrs,
  getDocument,
  getWindow,
  lockScroll,
  prefersReducedMotion,
  afterTransition,
  Keys,
  wrapIndex,
  nextIndex,
  createTypeahead,
  type MoveDirection,
  supportsPopover,
  supportsInvokers,
  supportsAnchorPositioning,
  positionFallback,
  type Placement,
  type Side,
  type Align,
  type PositionOptions,
  type PositionResult,
} from './core/index.js';
export { type DialogOptions, type DialogApi } from './core/dialog.js';
