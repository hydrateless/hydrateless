import { defineEnhancer } from '../core/index.js';

export type EnhanceAccordionOptions = {
  /** Allow more than one panel open at a time. Defaults to `false`. */
  allowMultiple?: boolean;
};

/**
 * Single-open accordion behavior layered on a group of native `<details>`
 * elements. With `allowMultiple: false` (the default), opening one panel closes
 * the others. Everything else (animation, focus, the disclosure triangle) is
 * handled by CSS and the browser.
 */
export const enhanceAccordion = defineEnhancer<EnhanceAccordionOptions>({
  name: 'accordion',
  selector: '[data-hl-accordion]',
  defaults: { allowMultiple: false },
  setup({ root, options, on }) {
    const items = Array.from(root.querySelectorAll<HTMLDetailsElement>('details'));
    if (items.length === 0 || options.allowMultiple) return;

    for (const item of items) {
      on(item, 'toggle', () => {
        if (!item.open) return;
        for (const other of items) {
          if (other !== item && other.open) other.open = false;
        }
      });
    }
  },
});
