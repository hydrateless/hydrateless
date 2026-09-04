// Components
export {
  enhanceAccordion,
  type EnhanceAccordionOptions,
  type AccordionApi,
} from './accordion/index.js';
export { enhanceAlert, type EnhanceAlertOptions, type AlertApi } from './alert/index.js';
export {
  enhanceCheckbox,
  type EnhanceCheckboxOptions,
  type CheckboxApi,
} from './checkbox/index.js';
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
export {
  enhancePagination,
  type EnhancePaginationOptions,
  type PaginationApi,
} from './pagination/index.js';
export { enhancePopover, type EnhancePopoverOptions, type PopoverApi } from './popover/index.js';
export {
  enhanceSegmented,
  type EnhanceSegmentedOptions,
  type SegmentedApi,
} from './segmented/index.js';
export { enhanceSlider, type EnhanceSliderOptions, type SliderApi } from './slider/index.js';
export {
  enhanceTable,
  type EnhanceTableOptions,
  type TableApi,
  type SortState,
  type SortDirection,
} from './table/index.js';
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
  type ToastIntent,
} from './toast/index.js';

// Manifest (single source of truth for the auto-loader)
export { MANIFEST, type ManifestEntry, type ComponentName } from './manifest.js';

// Shared headless core: utilities for building custom enhancers.
export * from './core/index.js';
export { type DialogOptions, type DialogApi } from './core/dialog.js';
