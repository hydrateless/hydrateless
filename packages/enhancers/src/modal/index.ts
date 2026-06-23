import { defineEnhancer } from '../core/index.js';
import { setupDialog, type DialogApi, type DialogOptions } from '../core/dialog.js';

/** Options for {@link enhanceModal}; an alias of {@link DialogOptions}. */
export type EnhanceModalOptions = DialogOptions;
/** Imperative handle returned by {@link enhanceModal}; an alias of {@link DialogApi}. */
export type ModalApi = DialogApi;

/**
 * Enhance a native `<dialog data-hl-modal>`. Opening and closing are fully
 * declarative through Invoker Commands: a button with `command="show-modal"`
 * and `commandfor` opens it, and a `command="close"` button inside closes it,
 * with no JavaScript. `showModal()` already provides the top layer, focus trap,
 * background `inert`, and `::backdrop`; this enhancer only labels the dialog,
 * locks background scroll while open, and mirrors the native open/close into
 * `onOpenChange`/`hl:open-change` and the returned imperative API.
 */
export const enhanceModal = defineEnhancer<EnhanceModalOptions, ModalApi>({
  name: 'modal',
  selector: 'dialog[data-hl-modal]',
  defaults: { closeOnBackdrop: true },
  setup: (ctx) => setupDialog('modal', ctx),
});
