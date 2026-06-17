import { defineEnhancer } from '../core/index.js';
import { setupDialog, type DialogApi, type DialogOptions } from '../core/dialog.js';

/** Options for {@link enhanceDrawer}; an alias of {@link DialogOptions}. */
export type EnhanceDrawerOptions = DialogOptions;
/** Imperative handle returned by {@link enhanceDrawer}; an alias of {@link DialogApi}. */
export type DrawerApi = DialogApi;

/**
 * A drawer is a native `<dialog data-hl-drawer>` that slides in from a screen
 * edge (the side is chosen in CSS). Shares the modal's focus trap, scroll-lock,
 * background `inert`, and open-state API; only the presentation differs.
 */
export const enhanceDrawer = defineEnhancer<EnhanceDrawerOptions, DrawerApi>({
  name: 'drawer',
  selector: 'dialog[data-hl-drawer]',
  defaults: { closeOnBackdrop: true },
  setup: (ctx) => setupDialog('drawer', ctx),
});
