import { defineEnhancer } from '../core/index.js';
import { setupDialog, type DialogApi, type DialogOptions } from '../core/dialog.js';

export type EnhanceModalOptions = DialogOptions;
export type ModalApi = DialogApi;

/**
 * Wire a native `<dialog data-hl-modal>` to its `[data-hl-modal-open]` triggers
 * and `[data-hl-modal-close]` buttons, layering on a focus trap, body
 * scroll-lock, and a background `inert` barrier for assistive tech. Open state
 * is observable through `onOpenChange`/`hl:open-change` and controllable
 * through the returned API.
 */
export const enhanceModal = defineEnhancer<EnhanceModalOptions, ModalApi>({
  name: 'modal',
  selector: 'dialog[data-hl-modal]',
  defaults: { closeOnBackdrop: true },
  setup: (ctx) => setupDialog('modal', ctx),
});
