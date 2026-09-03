import { defineEnhancer, ensureId, setAttrs, nextIndex, Events, Keys } from '../core/index.js';

/** Number of options PageUp/PageDown jumps over. */
const PAGE = 10;

/** Options for {@link enhanceCommand}. */
export type EnhanceCommandOptions = {
  /** Lowercased key that, with Cmd/Ctrl, opens the palette's dialog. */
  hotkey?: string;
  /** Initial filter query; pre-fills the input. */
  defaultValue?: string;
  /** Called with the filter query after every change. */
  onValueChange?: (value: string) => void;
  /** Called with the command's value when a command runs. */
  onCommand?: (value: string, item: HTMLElement) => void;
};

/** Imperative handle returned by {@link enhanceCommand}. */
export type CommandApi = {
  /** The current filter query. */
  readonly value: string;
  /** Set the filter query: updates the input and re-filters the list. */
  setValue: (value: string) => void;
};

/**
 * Command palette: a filterable `role="listbox"` of `role="option"` commands
 * with arrow/Home/End/PageUp/PageDown navigation, type-to-filter (matching
 * text + `data-hl-keywords`), automatic empty-state and group hiding, Escape
 * to clear the query (or close the hosting `<dialog>` once it's empty), and
 * Enter to run the active command (emits a cancelable `hl:command`
 * CustomEvent). The filter query is observable through `onValueChange`/
 * `hl:change` and controllable through the returned API. When the palette
 * lives inside a `<dialog>`, an optional `data-hl-command-hotkey` opens it
 * with Cmd/Ctrl+key. Without JavaScript the full list simply renders; the
 * root is marked `data-hl-ready` once filtering is live.
 */
export const enhanceCommand = defineEnhancer<EnhanceCommandOptions, CommandApi>({
  name: 'command',
  selector: '[data-hl-command]',
  setup({ root, options, on, add, emit }) {
    const input = root.querySelector<HTMLInputElement>('[data-hl-command-input], input');
    const list = root.querySelector<HTMLElement>('[data-hl-command-list], [role="listbox"]');
    if (!input || !list) return;

    const empty = root.querySelector<HTMLElement>('[data-hl-command-empty]');
    const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-hl-command-group]'));
    const dialog = root.closest<HTMLDialogElement>('dialog');
    const hotkey = (
      root.getAttribute('data-hl-command-hotkey') ||
      options.hotkey ||
      ''
    ).toLowerCase();

    root.setAttribute('data-hl-ready', '');
    add(() => root.removeAttribute('data-hl-ready'));

    const listId = ensureId(list, 'hl-command-list');
    setAttrs(list, { role: 'listbox' });
    setAttrs(input, {
      role: 'combobox',
      'aria-expanded': 'true',
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      autocomplete: 'off',
    });

    const allItems = () =>
      Array.from(root.querySelectorAll<HTMLElement>('[role="option"], [data-hl-command-item]'));
    for (const item of allItems()) {
      ensureId(item, 'hl-command-item');
      setAttrs(item, { role: 'option' });
    }

    let active = -1;
    const visible = () => allItems().filter((item) => !item.hidden);

    const paint = () => {
      const items = visible();
      items.forEach((item, i) =>
        setAttrs(item, { 'aria-selected': i === active ? 'true' : 'false' }),
      );
      const current = items[active];
      setAttrs(input, { 'aria-activedescendant': current ? current.id : null });
      current?.scrollIntoView?.({ block: 'nearest' });
    };

    const filter = (query: string) => {
      const q = query.trim().toLowerCase();
      for (const item of allItems()) {
        const haystack = `${item.textContent ?? ''} ${item.dataset.hlKeywords ?? ''}`.toLowerCase();
        item.hidden = q.length > 0 && !haystack.includes(q);
      }
      for (const group of groups) {
        const hasVisible = group.querySelector<HTMLElement>('[role="option"]:not([hidden])');
        group.hidden = !hasVisible;
      }
      const count = visible().length;
      if (empty) empty.hidden = count > 0;
      active = count > 0 ? 0 : -1;
      paint();
    };

    const run = (item: HTMLElement) => {
      const value = item.dataset.hlValue ?? item.textContent?.trim() ?? '';
      if (!emit(Events.command, { value, item }, { cancelable: true })) return;
      options.onCommand?.(value, item);
      const link = item.matches('a[href]')
        ? item
        : item.querySelector<HTMLAnchorElement>('a[href]');
      if (link) link.click();
    };

    let lastValue = input.value;
    const notify = () => {
      if (input.value === lastValue) return;
      lastValue = input.value;
      options.onValueChange?.(input.value);
      emit(Events.change, { value: input.value });
    };

    on(input, 'input', () => {
      filter(input.value);
      notify();
    });

    on<KeyboardEvent>(input, 'keydown', (e) => {
      const items = visible();
      switch (e.key) {
        case Keys.ArrowDown:
          e.preventDefault();
          active = nextIndex(active, items.length, 'next');
          paint();
          break;
        case Keys.ArrowUp:
          e.preventDefault();
          active = nextIndex(active, items.length, 'prev');
          paint();
          break;
        case Keys.PageDown:
          if (items.length > 0) {
            e.preventDefault();
            active = Math.min(active === -1 ? PAGE - 1 : active + PAGE, items.length - 1);
            paint();
          }
          break;
        case Keys.PageUp:
          if (items.length > 0) {
            e.preventDefault();
            active = Math.max(active === -1 ? 0 : active - PAGE, 0);
            paint();
          }
          break;
        case Keys.Enter:
          if (items[active]) {
            e.preventDefault();
            run(items[active]);
          }
          break;
        case Keys.Escape:
          // First Escape clears a query; the next one (or the first, when the
          // query is already empty) closes the hosting dialog.
          if (input.value) {
            e.preventDefault();
            input.value = '';
            filter('');
            notify();
          } else if (dialog?.open) {
            e.preventDefault();
            dialog.close();
          }
          break;
      }
    });

    on(list, 'click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
      if (item) run(item);
    });

    if (hotkey && dialog) {
      on<KeyboardEvent>(dialog.ownerDocument, 'keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey) {
          e.preventDefault();
          if (!dialog.open) dialog.showModal();
          input.focus();
          input.value = '';
          filter('');
          notify();
        }
      });
    }

    // Initialize the input, active option, and empty state.
    if (options.defaultValue != null) input.value = options.defaultValue;
    lastValue = input.value;
    filter(input.value);
    add(() => setAttrs(input, { 'aria-activedescendant': null }));

    return {
      get value() {
        return input.value;
      },
      setValue(value) {
        if (input.value === value) return;
        input.value = value;
        filter(value);
        notify();
      },
    };
  },
});
