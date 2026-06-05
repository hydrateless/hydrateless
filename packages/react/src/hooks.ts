import {
  enhanceAccordion,
  enhanceDisclosure,
  enhanceDropdown,
  enhanceModal,
  enhanceTabs,
  enhanceToc,
  enhanceTooltip,
  type EnhanceTocOptions,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';

/** Ref hook that wires tabs ARIA + keyboard navigation onto a container. */
export const useTabs = <T extends HTMLElement = HTMLDivElement>() =>
  useEnhancer<T>((el) => enhanceTabs(el));

/** Ref hook that wires a dropdown menu onto a container. */
export const useDropdown = <T extends HTMLElement = HTMLDivElement>() =>
  useEnhancer<T>((el) => enhanceDropdown(el));

/** Ref hook that wires tooltips onto all `[data-hl-tooltip]` triggers inside. */
export const useTooltip = <T extends HTMLElement = HTMLElement>() =>
  useEnhancer<T>((el) => enhanceTooltip(el));

/** Ref hook that enforces single-open accordion behavior on a container. */
export const useAccordion = <T extends HTMLElement = HTMLDivElement>(allowMultiple = false) =>
  useEnhancer<T>((el) => enhanceAccordion(el, { allowMultiple }), [allowMultiple]);

/** Ref hook that groups `[data-hl-disclosure]` elements for mutual exclusivity. */
export const useDisclosureGroup = <T extends HTMLElement = HTMLElement>(allowMultiple = false) =>
  useEnhancer<T>((el) => enhanceDisclosure(el, { allowMultiple }), [allowMultiple]);

/** Ref hook that wires modal openers/closers + focus trap within a container. */
export const useModalGroup = <T extends HTMLElement = HTMLElement>(closeOnBackdrop = true) =>
  useEnhancer<T>((el) => enhanceModal(el, { closeOnBackdrop }), [closeOnBackdrop]);

/** Ref hook that builds a table of contents from the surrounding document. */
export const useTocEnhancer = <T extends HTMLElement = HTMLElement>(options?: EnhanceTocOptions) =>
  useEnhancer<T>(
    (el) => enhanceToc(el.ownerDocument, options),
    [options?.contentSelector, options?.headings, options?.scrollSpy],
  );
