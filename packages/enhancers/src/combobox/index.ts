import { defineEnhancer } from '../core/define.js';
import { ensureId, setAttrs } from '../core/dom.js';
import { isDisabledItem, nextEnabledIndex } from '../core/menu-items.js';
import { keepPositioned } from '../core/platform.js';
import { noop, type Disposer } from '../core/lifecycle.js';
import { Events } from '../core/events.js';
import { Keys, type MoveDirection } from '../core/keys.js';

/** Options for {@link enhanceCombobox}. */
export type EnhanceComboboxOptions = {
  /** Hide options that don't match the typed query. Defaults to `true`. */
  filter?: boolean;
  /** Highlight the first match automatically while typing. Defaults to `true`. */
  autoHighlight?: boolean;
  /** Run the JS positioning fallback when CSS anchor positioning is missing. Defaults to `true`. */
  position?: boolean;
  /** Initial committed value; pre-fills the input. */
  defaultValue?: string;
  /** Start with the listbox expanded. */
  defaultOpen?: boolean;
  /** Called with the committed value after a selection or `setValue`. */
  onValueChange?: (value: string) => void;
  /** Called after the listbox expands or collapses. */
  onOpenChange?: (open: boolean) => void;
};

/** Imperative handle returned by {@link enhanceCombobox}. */
export type ComboboxApi = {
  /** The input's current text. */
  readonly value: string;
  /** Commit a value: updates the input and notifies listeners. */
  setValue: (value: string) => void;
  /** Whether the listbox is currently expanded. */
  readonly open: boolean;
  /** Expand or collapse the listbox. */
  setOpen: (open: boolean) => void;
};

/** Number of options PageUp/PageDown jumps over. */
const PAGE = 10;

/**
 * Editable combobox (text input + `role="listbox"` popup) implementing the APG
 * pattern: `aria-expanded`, `aria-activedescendant`, Up/Down/PageUp/PageDown
 * navigation that skips disabled options (Home and End stay with the text
 * caret, as the pattern requires), Alt+Down to expand without moving, type-
 * to-filter, Enter to commit, Escape/outside-click to dismiss. Options are
 * read live and given ids as they appear, so lists fetched after enhancement
 * work. Selection emits a cancelable `hl:select` followed by `hl:change`,
 * expanding or collapsing the listbox emits `hl:open-change`, and both the
 * committed value and the open state are controllable through the returned
 * API. Before this runs, the stylesheet reveals the listbox on `:focus-within`
 * so the options are at least reachable; the root is marked `data-hl-ready`
 * once JS owns visibility. Markup can set `data-hl-filter`,
 * `data-hl-auto-highlight`, and `data-hl-default-value` on the root.
 */
export const enhanceCombobox = defineEnhancer<EnhanceComboboxOptions, ComboboxApi>({
  name: 'combobox',
  selector: '[data-hl-combobox]',
  defaults: { filter: true, autoHighlight: true, position: true },
  attributes: {
    filter: 'boolean',
    autoHighlight: 'boolean',
    position: 'boolean',
    defaultValue: 'string',
    defaultOpen: 'boolean',
  },
  setup({ root, options, on, observe, add, emit }) {
    const input = root.querySelector<HTMLInputElement>('input, [role="combobox"]');
    const listbox = root.querySelector<HTMLElement>('[role="listbox"], [data-hl-combobox-list]');
    if (!input || !listbox) return;

    const listId = ensureId(listbox, 'hl-combobox-list');
    setAttrs(listbox, { role: 'listbox' });
    setAttrs(input, {
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-controls': listId,
      'aria-haspopup': 'listbox',
      'aria-autocomplete': 'list',
      autocomplete: 'off',
    });
    listbox.hidden = true;
    root.setAttribute('data-hl-ready', '');
    add(() => {
      root.removeAttribute('data-hl-ready');
      listbox.hidden = false;
    });

    // Link the listbox to the input for CSS anchor positioning. `position: fixed`
    // in the stylesheet then escapes any clipping ancestor without the top layer.
    const anchorName = `--${ensureId(input, 'hl-combobox')}`;
    input.style.setProperty('anchor-name', anchorName);
    listbox.style.setProperty('position-anchor', anchorName);

    const allOptions = () => Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]'));
    const prepare = () => {
      for (const option of allOptions()) ensureId(option, 'hl-option');
    };
    prepare();

    let active = -1;
    let stopPositioning: Disposer = noop;
    add(() => stopPositioning());
    const visible = () => allOptions().filter((o) => !o.hidden);

    const paint = () => {
      const list = visible();
      list.forEach((option, i) =>
        setAttrs(option, { 'aria-selected': i === active ? 'true' : 'false' }),
      );
      const current = list[active];
      setAttrs(input, { 'aria-activedescendant': current ? current.id : null });
      current?.scrollIntoView?.({ block: 'nearest' });
    };

    /** Move `active` through the visible options, skipping disabled ones. */
    const step = (direction: MoveDirection, list = visible()) => {
      if (list.length === 0) return;
      active = nextEnabledIndex(list, active, direction);
    };

    const isOpen = () => !listbox.hidden;
    const notifyOpen = (open: boolean) => {
      options.onOpenChange?.(open);
      emit(Events.openChange, { open });
    };
    const open = () => {
      if (isOpen()) return;
      listbox.hidden = false;
      setAttrs(input, { 'aria-expanded': 'true' });
      if (options.position) {
        stopPositioning = keepPositioned(input, listbox, { placement: 'bottom-start' });
      }
      notifyOpen(true);
    };
    const close = () => {
      if (!isOpen()) return;
      stopPositioning();
      stopPositioning = noop;
      listbox.hidden = true;
      active = -1;
      setAttrs(input, { 'aria-expanded': 'false', 'aria-activedescendant': null });
      notifyOpen(false);
    };

    const filter = (query: string) => {
      if (!options.filter) return;
      const q = query.trim().toLowerCase();
      for (const option of allOptions()) {
        const text = (option.dataset.hlValue ?? option.textContent ?? '').toLowerCase();
        option.hidden = q.length > 0 && !text.includes(q);
      }
    };

    const commit = (value: string) => {
      input.value = value;
      options.onValueChange?.(value);
      emit(Events.change, { value });
    };

    const select = (option: HTMLElement) => {
      if (isDisabledItem(option)) return;
      const value = option.dataset.hlValue ?? option.textContent?.trim() ?? '';
      const proceed = emit(Events.select, { value, option }, { cancelable: true });
      if (proceed) commit(value);
      close();
      input.focus();
    };

    if (options.defaultValue != null) input.value = options.defaultValue;
    if (options.defaultOpen) open();

    // Options rendered later (async search results) get ids and, while the
    // list is open, the highlight is re-applied to whatever is now visible.
    observe(listbox, () => {
      prepare();
      if (isOpen()) {
        filter(input.value);
        const list = visible();
        if (active >= list.length) active = list.length - 1;
        paint();
      }
    });

    on(input, 'input', () => {
      open();
      filter(input.value);
      const list = visible();
      active = -1;
      if (options.autoHighlight && list.length > 0) step('first', list);
      paint();
    });

    on(input, 'focus', () => {
      if (allOptions().length > 0) open();
    });

    on<KeyboardEvent>(input, 'keydown', (e) => {
      const list = visible();
      switch (e.key) {
        case Keys.ArrowDown:
          e.preventDefault();
          if (!isOpen()) open();
          // Alt+Down expands without moving the highlight (APG).
          if (!e.altKey) step('next', list);
          paint();
          break;
        case Keys.ArrowUp:
          e.preventDefault();
          if (!isOpen()) open();
          if (!e.altKey) step('prev', list);
          paint();
          break;
        case Keys.PageDown:
          if (isOpen() && list.length > 0) {
            e.preventDefault();
            active = Math.min(active === -1 ? PAGE - 1 : active + PAGE, list.length - 1);
            if (isDisabledItem(list[active])) step('next', list);
            paint();
          }
          break;
        case Keys.PageUp:
          if (isOpen() && list.length > 0) {
            e.preventDefault();
            active = Math.max(active === -1 ? 0 : active - PAGE, 0);
            if (isDisabledItem(list[active])) step('prev', list);
            paint();
          }
          break;
        case Keys.Enter:
          if (isOpen() && list[active]) {
            e.preventDefault();
            select(list[active]);
          }
          break;
        case Keys.Escape:
          if (isOpen()) {
            e.preventDefault();
            close();
          }
          break;
        case Keys.Tab:
          close();
          break;
      }
    });

    on(listbox, 'click', (e) => {
      const option = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
      if (option) select(option);
    });

    // Keep the input focused when the pointer lands on the listbox, so a click
    // on an option commits it instead of blurring the combobox first.
    on(listbox, 'pointerdown', (e) => e.preventDefault());

    // Native light-dismiss isn't available for a non-button invoker, so close
    // when focus leaves the combobox entirely (covers Tab and outside clicks).
    on(root, 'focusout', (e) => {
      if (!root.contains((e as FocusEvent).relatedTarget as Node | null)) close();
    });

    return {
      get value() {
        return input.value;
      },
      setValue(value) {
        if (input.value !== value) commit(value);
      },
      get open() {
        return isOpen();
      },
      setOpen(next) {
        if (next) open();
        else close();
      },
    };
  },
});
