import type { Action } from 'svelte/action';
import {
  enhanceAccordion,
  enhanceCombobox,
  enhanceCommand,
  enhanceDisclosure,
  enhanceDropdown,
  enhanceDrawer,
  enhanceMenu,
  enhanceModal,
  enhancePopover,
  enhanceTabs,
  enhanceToc,
  enhanceTooltip,
  type EnhancerHandle,
} from '@hydrateless/enhancers';

function actionFor(enhance: (node: HTMLElement) => EnhancerHandle<unknown>): Action<HTMLElement> {
  return (node) => {
    const { destroy } = enhance(node);
    return { destroy };
  };
}

/** `use:accordion` — single-open behavior on a `[data-hl-accordion]` element. */
export const accordion = actionFor((node) => enhanceAccordion(node));

/** `use:disclosure` — groups `[data-hl-disclosure]` elements within the node. */
export const disclosure = actionFor((node) => enhanceDisclosure(node));

/** `use:tabs` — ARIA + keyboard navigation on a `[data-hl-tabs]` element. */
export const tabs = actionFor((node) => enhanceTabs(node));

/** `use:dropdown` — menu pattern on a `[data-hl-dropdown]` element. */
export const dropdown = actionFor((node) => enhanceDropdown(node));

/** `use:modal` — wires modal openers/closers + focus trap within the node. */
export const modal = actionFor((node) => enhanceModal(node));

/** `use:drawer` — wires drawer openers/closers within the node. */
export const drawer = actionFor((node) => enhanceDrawer(node));

/** `use:popover` — wires popover openers/closers within the node. */
export const popover = actionFor((node) => enhancePopover(node));

/** `use:tooltip` — wires `[data-hl-tooltip]` triggers within the node. */
export const tooltip = actionFor((node) => enhanceTooltip(node));

/** `use:toc` — builds a table of contents from the surrounding document. */
export const toc = actionFor((node) => enhanceToc(node.ownerDocument));

/** `use:menu` — menubar/navigation pattern on a `[data-hl-menu]` element. */
export const menu = actionFor((node) => enhanceMenu(node));

/** `use:combobox` — editable combobox on a `[data-hl-combobox]` element. */
export const combobox = actionFor((node) => enhanceCombobox(node));

/** `use:command` — command palette on a `[data-hl-command]` element. */
export const command = actionFor((node) => enhanceCommand(node));
