import { defineEnhancer } from '../core/define.js';
import { setAttrs } from '../core/dom.js';
import { Events } from '../core/events.js';
import { Keys } from '../core/keys.js';

/** Direction of a sorted column, in `aria-sort` vocabulary. */
export type SortDirection = 'ascending' | 'descending';

/** The active sort of a table: which column, which way. */
export type SortState = {
  /** The column key from the header's `data-hl-sort` attribute (or its index). */
  column: string;
  direction: SortDirection;
};

/** Options for {@link enhanceTable}. */
export type EnhanceTableOptions = {
  /**
   * Initial sort. Falls back to a header already marked `aria-sort` in the
   * markup (server-rendered order); `null` leaves the rows as authored.
   */
  defaultValue?: SortState | null;
  /**
   * Compare two cell values for `column`. Defaults to numeric comparison when
   * both parse as numbers, else locale-aware string comparison.
   */
  compare?: (a: string, b: string, column: string) => number;
  /** Called with the new sort after every change (`null` when cleared). */
  onValueChange?: (value: SortState | null) => void;
};

/** Imperative handle returned by {@link enhanceTable}. */
export type TableApi = {
  /** The active sort, or `null` when the rows are in authored order. */
  readonly value: SortState | null;
  /** Sort by a column, or pass `null` to restore the authored order. */
  setValue: (value: SortState | null) => void;
};

const SORTABLE = 'th[data-hl-sort]';

/** `data-hl-default-value="price"` or `"price:descending"`. */
function parseSort(raw: string): SortState | undefined {
  const [column, direction = 'ascending'] = raw.split(':');
  if (!column) return undefined;
  if (direction !== 'ascending' && direction !== 'descending') return undefined;
  return { column, direction };
}

function defaultCompare(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  if (a.trim() !== '' && b.trim() !== '' && !Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Client-side column sorting for a `<table data-hl-table>`. Headers marked
 * `data-hl-sort` (with an optional column key as the value) become sortable:
 * the header is made focusable, exposes `aria-sort`, and toggles between
 * ascending and descending on click, Enter, or Space. Rows in the `<tbody>`
 * are reordered by the cell's `data-hl-value` (falling back to its text),
 * comparing numerically when both sides are numbers. Rows added later are
 * sorted into place. Without JavaScript the table simply renders in authored
 * order, which `setValue(null)` restores. The sort is observable through
 * `onValueChange`/`hl:change`. Markup can set `data-hl-default-value`
 * (`"column"` or `"column:descending"`) on the table.
 */
export const enhanceTable = defineEnhancer<EnhanceTableOptions, TableApi>({
  name: 'table',
  selector: 'table[data-hl-table]',
  defaults: {},
  attributes: { defaultValue: parseSort },
  setup({ root, options, on, observe, add, emit }) {
    const table = root as HTMLTableElement;
    const headers = () => Array.from(table.querySelectorAll<HTMLTableCellElement>(SORTABLE));
    if (headers().length === 0) return;

    const body = table.tBodies[0];
    if (!body) return;

    const keyOf = (th: HTMLTableCellElement) => th.dataset.hlSort || String(th.cellIndex);
    const compare = options.compare ?? ((a, b) => defaultCompare(a, b));

    // Authored order, so clearing the sort can put the rows back.
    const original: HTMLTableRowElement[] = Array.from(body.rows);
    let value: SortState | null = null;

    const prepared = new WeakSet<HTMLTableCellElement>();
    const prepare = () => {
      for (const th of headers()) {
        if (prepared.has(th)) continue;
        prepared.add(th);
        if (!th.hasAttribute('tabindex')) th.tabIndex = 0;
        setAttrs(th, { 'aria-sort': th.getAttribute('aria-sort') || 'none' });
        add(() => {
          th.removeAttribute('tabindex');
          th.removeAttribute('aria-sort');
        });
      }
    };
    prepare();

    const paint = () => {
      for (const th of headers()) {
        const active = value !== null && keyOf(th) === value.column;
        setAttrs(th, { 'aria-sort': active ? value!.direction : 'none' });
      }
    };

    const cellText = (row: HTMLTableRowElement, index: number): string => {
      const cell = row.cells[index];
      return cell?.dataset.hlValue ?? cell?.textContent?.trim() ?? '';
    };

    const apply = () => {
      // Rows that exist now but weren't authored (added later) sort along with
      // the rest; ones removed since are dropped from the authored list.
      const current = Array.from(body.rows);
      for (let i = original.length - 1; i >= 0; i -= 1) {
        if (!current.includes(original[i])) original.splice(i, 1);
      }
      for (const row of current) if (!original.includes(row)) original.push(row);

      let rows = [...original];
      if (value) {
        const th = headers().find((h) => keyOf(h) === value!.column);
        if (th) {
          const index = th.cellIndex;
          const sign = value.direction === 'descending' ? -1 : 1;
          rows = rows
            .map((row, i) => ({ row, i }))
            .sort(
              (a, b) =>
                sign * compare(cellText(a.row, index), cellText(b.row, index), value!.column) ||
                a.i - b.i,
            )
            .map((entry) => entry.row);
        }
      }
      body.append(...rows);
      paint();
    };

    const set = (next: SortState | null) => {
      const same =
        (next === null && value === null) ||
        (next !== null &&
          value !== null &&
          next.column === value.column &&
          next.direction === value.direction);
      value = next ? { ...next } : null;
      apply();
      if (!same) {
        options.onValueChange?.(value);
        emit(Events.change, { value });
      }
    };

    const toggle = (th: HTMLTableCellElement) => {
      const column = keyOf(th);
      const direction: SortDirection =
        value?.column === column && value.direction === 'ascending' ? 'descending' : 'ascending';
      set({ column, direction });
    };

    on(table, 'click', (e) => {
      const th = (e.target as HTMLElement).closest<HTMLTableCellElement>(SORTABLE);
      if (th && table.contains(th)) toggle(th);
    });
    on<KeyboardEvent>(table, 'keydown', (e) => {
      const th = (e.target as HTMLElement).closest<HTMLTableCellElement>(SORTABLE);
      if (!th || (e.key !== Keys.Enter && e.key !== Keys.Space)) return;
      e.preventDefault();
      toggle(th);
    });

    // Rows rendered later join the sort; headers added later become sortable.
    // Our own reordering never changes which rows exist, so only a change in
    // membership triggers a re-sort.
    observe(table, () => {
      prepare();
      if (!value) return;
      const rows = Array.from(body.rows);
      const changed =
        rows.length !== original.length || rows.some((row) => !original.includes(row));
      if (changed) apply();
    });

    // Initial state: caller option, else a server-rendered `aria-sort`.
    const initial =
      options.defaultValue !== undefined
        ? options.defaultValue
        : (() => {
            const th = headers().find((h) => {
              const sort = h.getAttribute('aria-sort');
              return sort === 'ascending' || sort === 'descending';
            });
            return th
              ? { column: keyOf(th), direction: th.getAttribute('aria-sort') as SortDirection }
              : null;
          })();
    value = initial ? { ...initial } : null;
    if (value) apply();
    else paint();
    add(() => body.append(...original));

    return {
      get value() {
        return value ? { ...value } : null;
      },
      setValue: set,
    };
  },
});
