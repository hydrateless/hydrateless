import { defineEnhancer } from '../core/define.js';
import { setAttrs, isRtl } from '../core/dom.js';
import { Events } from '../core/events.js';
import { Keys } from '../core/keys.js';
import { paginationRange, ELLIPSIS } from '../core/pagination.js';

/** Options for {@link enhancePagination}. */
export type EnhancePaginationOptions = {
  /** Total number of pages. Defaults to the highest numbered item in the markup. */
  total?: number;
  /**
   * Current page. Falls back to the item marked `aria-current="page"` in the
   * markup, then to `1`.
   */
  defaultValue?: number;
  /** Numbered pages shown on each side of the current one when rendering. Defaults to `1`. */
  siblings?: number;
  /** Numbered pages always shown at each end when rendering. Defaults to `1`. */
  boundaries?: number;
  /** Accessible label of a rendered "previous" control. Defaults to `Previous page`. */
  prevLabel?: string;
  /** Accessible label of a rendered "next" control. Defaults to `Next page`. */
  nextLabel?: string;
  /** Called with the new page after every change. */
  onValueChange?: (value: number) => void;
};

/** Imperative handle returned by {@link enhancePagination}. */
export type PaginationApi = {
  /** The current page (1-based). */
  readonly value: number;
  /** Go to a page. Out-of-range values are clamped. */
  setValue: (value: number) => void;
  /** Total number of pages. */
  readonly total: number;
};

const ITEM = '[data-hl-page]';

/**
 * Page state for a `<nav data-hl-pagination>`. Each control carries
 * `data-hl-page` with a page number or `prev`/`next`/`first`/`last`. Links
 * with an `href` keep navigating natively (the server renders the next page),
 * so without JavaScript nothing is lost; the enhancer marks the current page
 * with `aria-current="page"`, disables controls at the ends, adds
 * arrow/Home/End navigation between the numbered items (they all stay in the
 * tab order, as links should), and turns clicks on buttons (or hash-less links) into page changes it reports
 * through `onValueChange`/`hl:change`. When the list has no page controls at
 * all and a `total` is known, it renders them from the same
 * `paginationRange` the framework bindings use, and re-renders on change.
 * Markup can set `data-hl-total`, `data-hl-default-value`,
 * `data-hl-siblings`, `data-hl-boundaries`, `data-hl-prev-label`, and
 * `data-hl-next-label` on the root.
 */
export const enhancePagination = defineEnhancer<EnhancePaginationOptions, PaginationApi>({
  name: 'pagination',
  selector: '[data-hl-pagination]',
  defaults: { siblings: 1, boundaries: 1, prevLabel: 'Previous page', nextLabel: 'Next page' },
  attributes: {
    total: 'number',
    defaultValue: 'number',
    siblings: 'number',
    boundaries: 'number',
    prevLabel: 'string',
    nextLabel: 'string',
  },
  setup({ root, options, on, observe, add, emit }) {
    const doc = root.ownerDocument;
    if (!root.hasAttribute('aria-label') && !root.hasAttribute('aria-labelledby')) {
      root.setAttribute('aria-label', 'Pagination');
    }

    const items = () => Array.from(root.querySelectorAll<HTMLElement>(ITEM));
    const pageOf = (item: HTMLElement): number | null => {
      const n = Number(item.dataset.hlPage);
      return Number.isInteger(n) && n > 0 ? n : null;
    };
    const numbered = () => items().filter((item) => pageOf(item) !== null);

    let total = Math.max(
      1,
      Math.floor(
        options.total ?? numbered().reduce((max, item) => Math.max(max, pageOf(item)!), 1),
      ),
    );
    const clamp = (n: number) => Math.min(Math.max(1, Math.floor(n)), total);

    const list = root.querySelector<HTMLElement>('ul, ol');
    const renders = list !== null && numbered().length === 0 && options.total !== undefined;

    const current = items().find((item) => item.getAttribute('aria-current') === 'page') ?? null;
    let value = clamp(options.defaultValue ?? (current ? (pageOf(current) ?? 1) : 1));

    const control = (
      page: number | 'prev' | 'next',
      label: string,
      ariaLabel?: string,
    ): HTMLElement => {
      const li = doc.createElement('li');
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'hl-pagination-item';
      button.dataset.hlPage = String(page);
      button.textContent = label;
      if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
      li.appendChild(button);
      return li;
    };

    const render = () => {
      if (!renders || !list) return;
      const rtl = isRtl(root);
      const nodes: HTMLElement[] = [control('prev', rtl ? '\u203A' : '\u2039', options.prevLabel)];
      for (const entry of paginationRange(value, total, options.siblings, options.boundaries)) {
        if (entry === ELLIPSIS) {
          const li = doc.createElement('li');
          const gap = doc.createElement('span');
          gap.className = 'hl-pagination-ellipsis';
          gap.setAttribute('aria-hidden', 'true');
          gap.textContent = '\u2026';
          li.appendChild(gap);
          nodes.push(li);
        } else {
          nodes.push(control(entry, String(entry)));
        }
      }
      nodes.push(control('next', rtl ? '\u2039' : '\u203A', options.nextLabel));
      list.replaceChildren(...nodes);
    };
    if (renders && list) {
      const original = Array.from(list.childNodes);
      add(() => list.replaceChildren(...original));
    }

    const setDisabled = (item: HTMLElement, disabled: boolean) => {
      if (item instanceof HTMLButtonElement) item.disabled = disabled;
      else
        setAttrs(item, {
          'aria-disabled': disabled ? 'true' : null,
          tabindex: disabled ? -1 : null,
        });
    };

    const paint = () => {
      for (const item of items()) {
        const page = pageOf(item);
        const kind = item.dataset.hlPage;
        if (page !== null) {
          setAttrs(item, { 'aria-current': page === value ? 'page' : null });
        } else if (kind === 'prev' || kind === 'first') {
          setDisabled(item, value <= 1);
        } else if (kind === 'next' || kind === 'last') {
          setDisabled(item, value >= total);
        }
      }
    };

    const targetOf = (item: HTMLElement): number => {
      const page = pageOf(item);
      if (page !== null) return page;
      switch (item.dataset.hlPage) {
        case 'prev':
          return value - 1;
        case 'next':
          return value + 1;
        case 'first':
          return 1;
        case 'last':
          return total;
        default:
          return value;
      }
    };

    const set = (next: number, focus = false) => {
      const page = clamp(next);
      const changed = page !== value;
      value = page;
      render();
      paint();
      if (focus)
        numbered()
          .find((item) => pageOf(item) === value)
          ?.focus();
      if (changed) {
        options.onValueChange?.(value);
        emit(Events.change, { value });
      }
    };

    on(root, 'click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(ITEM);
      if (!item || !root.contains(item)) return;
      if (item.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        return;
      }
      // Real links navigate on their own; buttons and `href`-less anchors are
      // in-page controls whose clicks become page changes.
      const navigates = item instanceof HTMLAnchorElement && item.getAttribute('href');
      if (navigates && !navigates.startsWith('#')) {
        set(targetOf(item));
        return;
      }
      e.preventDefault();
      set(targetOf(item), true);
    });

    on<KeyboardEvent>(root, 'keydown', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(ITEM);
      if (!item || pageOf(item) === null) return;
      const rtl = isRtl(root);
      const nextKey = rtl ? Keys.ArrowLeft : Keys.ArrowRight;
      const prevKey = rtl ? Keys.ArrowRight : Keys.ArrowLeft;
      const pages = numbered();
      const index = pages.indexOf(item);
      let target: HTMLElement | undefined;
      if (e.key === nextKey) target = pages[index + 1];
      else if (e.key === prevKey) target = pages[index - 1];
      else if (e.key === Keys.Home) target = pages[0];
      else if (e.key === Keys.End) target = pages[pages.length - 1];
      else return;
      e.preventDefault();
      target?.focus();
    });

    observe(root, () => {
      if (options.total === undefined) {
        total = Math.max(
          1,
          numbered().reduce((max, item) => Math.max(max, pageOf(item)!), 1),
        );
      }
      paint();
    });

    render();
    paint();

    return {
      get value() {
        return value;
      },
      setValue: (next) => set(next),
      get total() {
        return total;
      },
    };
  },
});
