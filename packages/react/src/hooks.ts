import {
  enhanceAccordion,
  enhanceDropdown,
  enhanceModal,
  enhanceTabs,
  enhanceToc,
  enhanceTooltip,
  type AccordionApi,
  type DropdownApi,
  type EnhanceTocOptions,
  type ModalApi,
  type TabsApi,
  type TocApi,
  type TooltipApi,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';

/** Ref hook that wires tabs ARIA + keyboard navigation onto a container. */
export const useTabs = <T extends HTMLElement = HTMLDivElement>() =>
  useEnhancer<T, TabsApi>((el) => enhanceTabs(el));

/** Ref hook that wires a dropdown menu onto a container. */
export const useDropdown = <T extends HTMLElement = HTMLDivElement>() =>
  useEnhancer<T, DropdownApi>((el) => enhanceDropdown(el));

/** Ref hook that wires tooltips onto all `[data-hl-tooltip]` triggers inside. */
export const useTooltip = <T extends HTMLElement = HTMLElement>() =>
  useEnhancer<T, TooltipApi>((el) => enhanceTooltip(el));

/** Ref hook that enforces single-open accordion behavior on a container. */
export const useAccordion = <T extends HTMLElement = HTMLDivElement>(allowMultiple = false) =>
  useEnhancer<T, AccordionApi>((el) => enhanceAccordion(el, { allowMultiple }), [allowMultiple]);

/** Ref hook that wires modal openers/closers + focus trap within a container. */
export const useModalGroup = <T extends HTMLElement = HTMLElement>(closeOnBackdrop = true) =>
  useEnhancer<T, ModalApi>((el) => enhanceModal(el, { closeOnBackdrop }), [closeOnBackdrop]);

/** Ref hook that builds a table of contents from the surrounding document. */
export const useTocEnhancer = <T extends HTMLElement = HTMLElement>(options?: EnhanceTocOptions) =>
  useEnhancer<T, TocApi>(
    (el) => enhanceToc(el.ownerDocument, options),
    [options?.contentSelector, options?.headings, options?.scrollSpy],
  );
