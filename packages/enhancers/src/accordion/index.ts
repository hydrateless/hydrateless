import { defineEnhancer, Events } from '../core/index.js';

/** Options for {@link enhanceAccordion}. */
export type EnhanceAccordionOptions = {
  /** Allow more than one panel open at a time. Defaults to `false`. */
  allowMultiple?: boolean;
  /**
   * Values of the initially open items. Falls back to the `open` attributes
   * already present in the markup (e.g. server-rendered state). Item values
   * come from `data-hl-value` on each `<details>`, defaulting to the index.
   */
  defaultValue?: string[];
  /** Called with the open item values after every change. */
  onValueChange?: (value: string[]) => void;
};

/** Imperative handle returned by {@link enhanceAccordion}. */
export type AccordionApi = {
  /** Values of the currently open items, in document order. */
  readonly value: string[];
  /** Open exactly the items whose values are listed (others close). */
  setValue: (value: string[]) => void;
};

/**
 * Accordion behavior layered on a group of native `<details>` elements. With
 * `allowMultiple: false` (the default), opening one panel closes the others.
 * Open state is observable through `onValueChange`/`hl:change` and
 * controllable through the returned API; the browser still handles the
 * disclosure widget itself.
 */
export const enhanceAccordion = defineEnhancer<EnhanceAccordionOptions, AccordionApi>({
  name: 'accordion',
  selector: '[data-hl-accordion]',
  defaults: { allowMultiple: false },
  setup({ root, options, on, emit }) {
    const items = Array.from(root.querySelectorAll<HTMLDetailsElement>('details'));
    if (items.length === 0) return;

    const values = items.map((item, i) => item.getAttribute('data-hl-value') ?? String(i));
    const read = (): string[] => values.filter((_, i) => items[i].open);

    const apply = (next: string[]) => {
      let opened = false;
      items.forEach((item, i) => {
        let open = next.includes(values[i]);
        if (open && !options.allowMultiple) {
          if (opened) open = false;
          else opened = true;
        }
        if (item.open !== open) item.open = open;
      });
    };

    if (options.defaultValue) apply(options.defaultValue);
    else if (!options.allowMultiple) apply(read());

    // Toggling one item programmatically re-fires `toggle` on the others, so
    // change notifications are coalesced into a single microtask.
    let lastValue = read().join('\u0000');
    let scheduled = false;
    const notify = () => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        const value = read();
        const serialized = value.join('\u0000');
        if (serialized === lastValue) return;
        lastValue = serialized;
        options.onValueChange?.(value);
        emit(Events.change, { value });
      });
    };

    for (const item of items) {
      on(item, 'toggle', () => {
        if (item.open && !options.allowMultiple) {
          for (const other of items) {
            if (other !== item && other.open) other.open = false;
          }
        }
        notify();
      });
    }

    return {
      get value() {
        return read();
      },
      setValue(value) {
        apply(value);
        notify();
      },
    };
  },
});
