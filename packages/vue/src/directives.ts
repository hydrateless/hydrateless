import type { Directive } from 'vue';
import {
  enhanceAccordion,
  enhanceDisclosure,
  enhanceDropdown,
  enhanceDrawer,
  enhanceModal,
  enhancePopover,
  enhanceTabs,
  enhanceToc,
  enhanceTooltip,
  type Disposer,
} from '@hydrateless/enhancers';

function directiveFor(enhance: (el: HTMLElement) => Disposer): Directive<HTMLElement> {
  const disposers = new WeakMap<HTMLElement, Disposer>();
  return {
    mounted(el) {
      disposers.set(el, enhance(el));
    },
    unmounted(el) {
      disposers.get(el)?.();
      disposers.delete(el);
    },
  };
}

export const vHlAccordion = directiveFor((el) => enhanceAccordion(el));
export const vHlDisclosure = directiveFor((el) => enhanceDisclosure(el));
export const vHlTabs = directiveFor((el) => enhanceTabs(el));
export const vHlDropdown = directiveFor((el) => enhanceDropdown(el));
export const vHlModal = directiveFor((el) => enhanceModal(el));
export const vHlDrawer = directiveFor((el) => enhanceDrawer(el));
export const vHlPopover = directiveFor((el) => enhancePopover(el));
export const vHlTooltip = directiveFor((el) => enhanceTooltip(el));
export const vHlToc = directiveFor((el) => enhanceToc(el.ownerDocument));

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
};
