import {
  enhanceAccordion,
  enhanceAlert,
  enhanceCheckbox,
  enhanceCombobox,
  enhanceCommand,
  enhanceDisclosure,
  enhanceDrawer,
  enhanceDropdown,
  enhanceMenu,
  enhanceModal,
  enhancePagination,
  enhancePopover,
  enhanceSegmented,
  enhanceSlider,
  enhanceTable,
  enhanceTabs,
  enhanceToast,
  enhanceToc,
  enhanceTooltip,
  MANIFEST,
  type Disposer,
  type Enhancer,
} from '@hydrateless/enhancers';

/**
 * Every enhancer, keyed by its manifest name. The docs bundle all of them (it
 * is not the shipped runtime), so a demo can be enhanced synchronously with no
 * dynamic import and, crucially, no global side effect: importing this module
 * never touches `document`. That is what lets each demo own its own JS, so the
 * "disable JS" toggle can tear an enhancer down without a global watcher
 * racing to put it back.
 */
const RUNNERS: Record<string, Enhancer<never, unknown>> = {
  accordion: enhanceAccordion as unknown as Enhancer<never, unknown>,
  tabs: enhanceTabs as unknown as Enhancer<never, unknown>,
  disclosure: enhanceDisclosure as unknown as Enhancer<never, unknown>,
  modal: enhanceModal as unknown as Enhancer<never, unknown>,
  drawer: enhanceDrawer as unknown as Enhancer<never, unknown>,
  popover: enhancePopover as unknown as Enhancer<never, unknown>,
  tooltip: enhanceTooltip as unknown as Enhancer<never, unknown>,
  dropdown: enhanceDropdown as unknown as Enhancer<never, unknown>,
  menu: enhanceMenu as unknown as Enhancer<never, unknown>,
  combobox: enhanceCombobox as unknown as Enhancer<never, unknown>,
  command: enhanceCommand as unknown as Enhancer<never, unknown>,
  toc: enhanceToc as unknown as Enhancer<never, unknown>,
  toast: enhanceToast as unknown as Enhancer<never, unknown>,
  alert: enhanceAlert as unknown as Enhancer<never, unknown>,
  checkbox: enhanceCheckbox as unknown as Enhancer<never, unknown>,
  pagination: enhancePagination as unknown as Enhancer<never, unknown>,
  segmented: enhanceSegmented as unknown as Enhancer<never, unknown>,
  slider: enhanceSlider as unknown as Enhancer<never, unknown>,
  table: enhanceTable as unknown as Enhancer<never, unknown>,
};

/**
 * Run every manifest enhancer whose selector matches inside `root`, exactly as
 * the real auto-loader would, but scoped to a single demo and fully under the
 * caller's control. Returns a disposer that tears every instance down.
 */
export function enhanceDemo(root: HTMLElement): Disposer {
  const disposers: Disposer[] = [];
  for (const { name, selector } of MANIFEST) {
    const present = root.matches(selector) || root.querySelector(selector) != null;
    if (!present) continue;
    const run = RUNNERS[name];
    if (!run) continue;
    disposers.push(run(root).destroy);
  }
  return () => {
    for (const dispose of disposers) dispose();
    disposers.length = 0;
  };
}

/** The set of enhancer names a chunk of markup would trigger, in document order. */
export function detectEnhancers(root: HTMLElement): string[] {
  return MANIFEST.filter(
    ({ selector }) => root.matches(selector) || root.querySelector(selector) != null,
  ).map(({ name }) => name);
}
