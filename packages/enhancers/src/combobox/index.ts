import {
  defineEnhancer,
  ensureId,
  setAttrs,
  onClickOutside,
  nextIndex,
  Events,
} from '../core/index.js';

/** Options for {@link enhanceCombobox}. */
export type EnhanceComboboxOptions = {
  /** Hide options that don't match the typed query. Defaults to `true`. */
  filter?: boolean;
  /** Highlight the first match automatically while typing. Defaults to `true`. */
  autoHighlight?: boolean;
  /** Initial committed value; pre-fills the input. */
  defaultValue?: string;
  /** Called with the committed value after a selection or `setValue`. */
  onValueChange?: (value: string) => void;
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
 * pattern: `aria-expanded`, `aria-activedescendant`, arrow/Home/End/PageUp/
 * PageDown navigation, type-to-filter, Enter to commit, Escape/outside-click
 * to dismiss. Selection emits a cancelable `hl:select` followed by
 * `hl:change`; the committed value is controllable through the returned API.
 */
export const enhanceCombobox = defineEnhancer<EnhanceComboboxOptions, ComboboxApi>({
  name: 'combobox',
  selector: '[data-hl-combobox]',
  defaults: { filter: true, autoHighlight: true },
  setup({ root, options, on, add, emit }) {
    const input = root.querySelector<HTMLInputElement>('input, [role="combobox"]');
    const listbox = root.querySelector<HTMLElement>('[role="listbox"], [data-hl-combobox-list]');
    if (!input || !listbox) return;

    const listId = ensureId(listbox, 'hl-combobox-list');
    setAttrs(listbox, { role: 'listbox' });
    setAttrs(input, {
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      autocomplete: 'off',
    });
    listbox.hidden = true;

    const allOptions = () => Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]'));
    for (const option of allOptions()) ensureId(option, 'hl-option');

    let active = -1;
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

    const isOpen = () => !listbox.hidden;
    const open = () => {
      if (isOpen()) return;
      listbox.hidden = false;
      setAttrs(input, { 'aria-expanded': 'true' });
    };
    const close = () => {
      if (!isOpen()) return;
      listbox.hidden = true;
      active = -1;
      setAttrs(input, { 'aria-expanded': 'false', 'aria-activedescendant': null });
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
      const value = option.dataset.hlValue ?? option.textContent?.trim() ?? '';
      const proceed = emit(Events.select, { value, option }, { cancelable: true });
      if (proceed) commit(value);
      close();
      input.focus();
    };

    if (options.defaultValue != null) input.value = options.defaultValue;

    on(input, 'input', () => {
      open();
      filter(input.value);
      const list = visible();
      active = options.autoHighlight && list.length > 0 ? 0 : -1;
      paint();
    });

    on(input, 'focus', () => {
      if (allOptions().length > 0) open();
    });

    on<KeyboardEvent>(input, 'keydown', (e) => {
      const list = visible();
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen()) open();
          active = nextIndex(active, list.length, 'next');
          paint();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen()) open();
          active = nextIndex(active, list.length, 'prev');
          paint();
          break;
        case 'PageDown':
          if (isOpen() && list.length > 0) {
            e.preventDefault();
            active = Math.min(active === -1 ? PAGE - 1 : active + PAGE, list.length - 1);
            paint();
          }
          break;
        case 'PageUp':
          if (isOpen() && list.length > 0) {
            e.preventDefault();
            active = Math.max(active === -1 ? 0 : active - PAGE, 0);
            paint();
          }
          break;
        case 'Home':
          if (isOpen()) {
            e.preventDefault();
            active = 0;
            paint();
          }
          break;
        case 'End':
          if (isOpen()) {
            e.preventDefault();
            active = list.length - 1;
            paint();
          }
          break;
        case 'Enter':
          if (isOpen() && list[active]) {
            e.preventDefault();
            select(list[active]);
          }
          break;
        case 'Escape':
          if (isOpen()) {
            e.preventDefault();
            close();
          }
          break;
        case 'Tab':
          close();
          break;
      }
    });

    on(listbox, 'click', (e) => {
      const option = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
      if (option) select(option);
    });

    add(onClickOutside(root, close, { ignore: [input] }));

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
