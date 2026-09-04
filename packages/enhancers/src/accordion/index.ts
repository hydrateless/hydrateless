import { defineEnhancer } from '../core/define.js';
import { Events } from '../core/events.js';
import { nextIndex, Keys, type MoveDirection } from '../core/keys.js';

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

/** `data-hl-default-value="a b"` or `"a,b"` lists the initially open items. */
const parseList = (raw: string) => raw.split(/[\s,]+/).filter(Boolean);

/**
 * Accordion behavior layered on a group of native `<details>` elements. With
 * `allowMultiple: false` (the default), opening one panel closes the others.
 * The APG accordion keyboard interaction is added on top of the native
 * disclosure: Up/Down arrows and Home/End move focus between the headers.
 * Items are read live, so `<details>` added or removed after enhancement take
 * part without re-enhancing. Open state is observable through
 * `onValueChange`/`hl:change` and controllable through the returned API; the
 * browser still handles the disclosure widget itself. Markup can set
 * `data-hl-allow-multiple` and `data-hl-default-value` on the root.
 */
export const enhanceAccordion = defineEnhancer<EnhanceAccordionOptions, AccordionApi>({
  name: 'accordion',
  selector: '[data-hl-accordion]',
  defaults: { allowMultiple: false },
  attributes: { allowMultiple: 'boolean', defaultValue: parseList },
  setup({ root, options, on, emit }) {
    const items = () => Array.from(root.querySelectorAll<HTMLDetailsElement>('details'));
    const valueOf = (item: HTMLDetailsElement, i: number) =>
      item.getAttribute('data-hl-value') ?? String(i);
    const read = (): string[] =>
      items()
        .map((item, i) => (item.open ? valueOf(item, i) : null))
        .filter((value): value is string => value !== null);

    const apply = (next: string[]) => {
      let opened = false;
      items().forEach((item, i) => {
        let open = next.includes(valueOf(item, i));
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

    // `toggle` doesn't bubble, but it does pass through the capture phase, so
    // one listener on the root covers every current and future `<details>`.
    on(
      root,
      'toggle',
      (e) => {
        const item = e.target as HTMLDetailsElement;
        if (item.tagName !== 'DETAILS' || !root.contains(item)) return;
        if (item.open && !options.allowMultiple) {
          for (const other of items()) {
            if (other !== item && other.open) other.open = false;
          }
        }
        notify();
      },
      true,
    );

    // APG accordion header navigation. Enter/Space stay native (`<summary>`
    // already toggles); only focus movement between headers is added.
    on<KeyboardEvent>(root, 'keydown', (e) => {
      const summaries = items()
        .map((item) => item.querySelector<HTMLElement>(':scope > summary'))
        .filter((summary): summary is HTMLElement => summary !== null);
      const current = summaries.indexOf(e.target as HTMLElement);
      if (current === -1) return;
      let direction: MoveDirection | null = null;
      if (e.key === Keys.ArrowDown) direction = 'next';
      else if (e.key === Keys.ArrowUp) direction = 'prev';
      else if (e.key === Keys.Home) direction = 'first';
      else if (e.key === Keys.End) direction = 'last';
      if (!direction) return;
      e.preventDefault();
      summaries[nextIndex(current, summaries.length, direction)]?.focus();
    });

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
