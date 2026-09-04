/**
 * The single source of truth for which components ship a JS enhancer and the
 * selector that signals their presence in the DOM. The auto-loader (and its
 * self-contained CDN variant) are generated from this list, so adding an
 * enhancer here is all it takes to make it auto-initialize.
 */
export interface ManifestEntry {
  /** Component name; matches the enhancer subpath export. */
  name: string;
  /** Selector the auto-loader uses to detect the component. */
  selector: string;
}

/**
 * The components that ship a JS enhancer, paired with the selector that signals
 * each one's presence in the DOM. The auto-loader is generated from this list.
 */
export const MANIFEST = [
  { name: 'accordion', selector: '[data-hl-accordion]' },
  { name: 'alert', selector: '[data-hl-alert]' },
  { name: 'checkbox', selector: '[data-hl-checkbox-group]' },
  { name: 'tabs', selector: '[data-hl-tabs]' },
  { name: 'disclosure', selector: 'details[data-hl-disclosure]' },
  { name: 'modal', selector: 'dialog[data-hl-modal]' },
  { name: 'drawer', selector: 'dialog[data-hl-drawer]' },
  { name: 'pagination', selector: '[data-hl-pagination]' },
  { name: 'popover', selector: '[data-hl-popover]' },
  { name: 'segmented', selector: '[data-hl-segmented]' },
  { name: 'slider', selector: '[data-hl-slider]' },
  { name: 'table', selector: 'table[data-hl-table]' },
  { name: 'tooltip', selector: '[data-hl-tooltip]' },
  { name: 'dropdown', selector: '[data-hl-dropdown]' },
  { name: 'menu', selector: '[data-hl-menu]' },
  { name: 'combobox', selector: '[data-hl-combobox]' },
  { name: 'command', selector: '[data-hl-command]' },
  { name: 'toc', selector: '[data-hl-toc]' },
  { name: 'toast', selector: '[data-hl-toast-region], [data-hl-toast-trigger]' },
] as const satisfies readonly ManifestEntry[];

/** Union of the component names declared in {@link MANIFEST}. */
export type ComponentName = (typeof MANIFEST)[number]['name'];
