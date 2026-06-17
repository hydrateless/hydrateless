import type { Directive } from 'vue';
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

function directiveFor(
  enhance: (el: HTMLElement) => EnhancerHandle<unknown>,
): Directive<HTMLElement> {
  const disposers = new WeakMap<HTMLElement, () => void>();
  return {
    mounted(el) {
      disposers.set(el, enhance(el).destroy);
    },
    unmounted(el) {
      disposers.get(el)?.();
      disposers.delete(el);
    },
  };
}

/** `v-hl-accordion` directive: single-open accordion behavior on the bound element. */
export const vHlAccordion = directiveFor((el) => enhanceAccordion(el));
/** `v-hl-disclosure` directive: groups `[data-hl-disclosure]` elements within the bound element. */
export const vHlDisclosure = directiveFor((el) => enhanceDisclosure(el));
/** `v-hl-tabs` directive: ARIA and keyboard navigation for a `[data-hl-tabs]` element. */
export const vHlTabs = directiveFor((el) => enhanceTabs(el));
/** `v-hl-dropdown` directive: menu-button behavior for a `[data-hl-dropdown]` element. */
export const vHlDropdown = directiveFor((el) => enhanceDropdown(el));
/** `v-hl-modal` directive: wires modal openers/closers and a focus trap within the bound element. */
export const vHlModal = directiveFor((el) => enhanceModal(el));
/** `v-hl-drawer` directive: wires drawer openers/closers within the bound element. */
export const vHlDrawer = directiveFor((el) => enhanceDrawer(el));
/** `v-hl-popover` directive: wires popover openers/closers within the bound element. */
export const vHlPopover = directiveFor((el) => enhancePopover(el));
/** `v-hl-tooltip` directive: wires `[data-hl-tooltip]` triggers within the bound element. */
export const vHlTooltip = directiveFor((el) => enhanceTooltip(el));
/** `v-hl-toc` directive: builds a table of contents from the surrounding document. */
export const vHlToc = directiveFor((el) => enhanceToc(el.ownerDocument));
/** `v-hl-menu` directive: menubar/navigation behavior for a `[data-hl-menu]` element. */
export const vHlMenu = directiveFor((el) => enhanceMenu(el));
/** `v-hl-combobox` directive: editable combobox behavior for a `[data-hl-combobox]` element. */
export const vHlCombobox = directiveFor((el) => enhanceCombobox(el));
/** `v-hl-command` directive: command-palette behavior for a `[data-hl-command]` element. */
export const vHlCommand = directiveFor((el) => enhanceCommand(el));

/** Map of directive names (without the `v-` prefix) to their definitions. */
export const directives: Record<string, Directive<HTMLElement>> = {
  'hl-accordion': vHlAccordion,
  'hl-disclosure': vHlDisclosure,
  'hl-tabs': vHlTabs,
  'hl-dropdown': vHlDropdown,
  'hl-modal': vHlModal,
  'hl-drawer': vHlDrawer,
  'hl-popover': vHlPopover,
  'hl-tooltip': vHlTooltip,
  'hl-toc': vHlToc,
  'hl-menu': vHlMenu,
  'hl-combobox': vHlCombobox,
  'hl-command': vHlCommand,
};
