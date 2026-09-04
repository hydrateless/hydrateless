import { defineEnhancer } from '../core/define.js';
import { ensureId, setAttrs } from '../core/dom.js';
import { isDisabledItem, nextEnabledIndex } from '../core/menu-items.js';
import { Events } from '../core/events.js';
import { Keys } from '../core/keys.js';

/** Number of options PageUp/PageDown jumps over. */
const PAGE = 10;

/** Options for {@link enhanceCommand}. */
export type EnhanceCommandOptions = {
  /** Lowercased key that, with Cmd/Ctrl, opens the palette's hosting `<dialog>`. */
  hotkey?: string;
  /** Close the hosting `<dialog>` after a command runs. Defaults to `true`. */
  closeOnCommand?: boolean;
  /** Initial filter query; pre-fills the input. */
  defaultValue?: string;
  /** Open the hosting `<dialog>` immediately on enhance. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the filter query after every change. */
  onValueChange?: (value: string) => void;
  /** Called after the hosting `<dialog>` opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Called with the command's value when a command runs. */
  onCommand?: (value: string, item: HTMLElement) => void;
};

/** Imperative handle returned by {@link enhanceCommand}. */
export type CommandApi = {
  /** The current filter query. */
  readonly value: string;
  /** Set the filter query: updates the input and re-filters the list. */
  setValue: (value: string) => void;
  /** Whether the hosting `<dialog>` is open. Always `true` for an inline palette. */
  readonly open: boolean;
  /** Open (clearing the query and focusing the input) or close the hosting `<dialog>`. */
  setOpen: (open: boolean) => void;
};

/**
 * Command palette: a filterable `role="listbox"` of `role="option"` commands
 * with arrow/Home/End/PageUp/PageDown navigation that skips disabled options,
 * type-to-filter (matching text + `data-hl-keywords`), automatic empty-state
 * and group hiding, Escape to clear the query (or close the hosting `<dialog>`
 * once it's empty), and Enter to run the active command (emits a cancelable
 * `hl:command` CustomEvent). Options are read live, so commands rendered
 * later are filterable too. The filter query is observable through
 * `onValueChange`/`hl:change` and controllable through the returned API. When
 * the palette lives inside a `<dialog>`, the dialog's open state is exposed
 * as `open`/`setOpen` and `onOpenChange`/`hl:open-change`, a command closes it
 * by default, and an optional hotkey opens it with Cmd/Ctrl+key. Without
 * JavaScript the full list simply renders; the root is marked `data-hl-ready`
 * once filtering is live. Markup can set `data-hl-hotkey`,
 * `data-hl-close-on-command`, `data-hl-default-value`, and
 * `data-hl-default-open` on the root.
 */
export const enhanceCommand = defineEnhancer<EnhanceCommandOptions, CommandApi>({
  name: 'command',
  selector: '[data-hl-command]',
  defaults: { closeOnCommand: true },
  attributes: {
    hotkey: 'string',
    closeOnCommand: 'boolean',
    defaultValue: 'string',
    defaultOpen: 'boolean',
  },
  setup({ root, options, on, observe, add, emit }) {
    const input = root.querySelector<HTMLInputElement>('[data-hl-command-input], input');
    const list = root.querySelector<HTMLElement>('[data-hl-command-list], [role="listbox"]');
    if (!input || !list) return;

    const empty = root.querySelector<HTMLElement>('[data-hl-command-empty]');
    const groups = () => Array.from(root.querySelectorAll<HTMLElement>('[data-hl-command-group]'));
    const dialog = root.closest<HTMLDialogElement>('dialog');
    const hotkey = (options.hotkey ?? '').toLowerCase();

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
    const prepare = () => {
      for (const item of allItems()) {
        ensureId(item, 'hl-command-item');
        setAttrs(item, { role: 'option' });
      }
    };
    prepare();

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
      for (const group of groups()) {
        const hasVisible = group.querySelector<HTMLElement>('[role="option"]:not([hidden])');
        group.hidden = !hasVisible;
      }
      const items = visible();
      if (empty) empty.hidden = items.length > 0;
      active = nextEnabledIndex(items, -1, 'first');
      paint();
    };

    const run = (item: HTMLElement) => {
      if (isDisabledItem(item)) return;
      const value = item.dataset.hlValue ?? item.textContent?.trim() ?? '';
      if (!emit(Events.command, { value, item }, { cancelable: true })) return;
      options.onCommand?.(value, item);
      const link = item.matches('a[href]')
        ? item
        : item.querySelector<HTMLAnchorElement>('a[href]');
      if (link) link.click();
      if (options.closeOnCommand && dialog?.open) dialog.close();
    };

    let lastValue = input.value;
    const notify = () => {
      if (input.value === lastValue) return;
      lastValue = input.value;
      options.onValueChange?.(input.value);
      emit(Events.change, { value: input.value });
    };

    const reset = () => {
      input.value = '';
      filter('');
      notify();
    };

    // Commands rendered after enhancement (lazy groups, search results) are
    // wired and filtered against the current query.
    observe(list, () => {
      prepare();
      filter(input.value);
    });

    on(input, 'input', () => {
      filter(input.value);
      notify();
    });

    on<KeyboardEvent>(input, 'keydown', (e) => {
      const items = visible();
      switch (e.key) {
        case Keys.ArrowDown:
          e.preventDefault();
          active = nextEnabledIndex(items, active, 'next');
          paint();
          break;
        case Keys.ArrowUp:
          e.preventDefault();
          active = nextEnabledIndex(items, active, 'prev');
          paint();
          break;
        case Keys.Home:
          e.preventDefault();
          active = nextEnabledIndex(items, -1, 'first');
          paint();
          break;
        case Keys.End:
          e.preventDefault();
          active = nextEnabledIndex(items, -1, 'last');
          paint();
          break;
        case Keys.PageDown:
          if (items.length > 0) {
            e.preventDefault();
            active = Math.min(active === -1 ? PAGE - 1 : active + PAGE, items.length - 1);
            if (isDisabledItem(items[active])) active = nextEnabledIndex(items, active, 'next');
            paint();
          }
          break;
        case Keys.PageUp:
          if (items.length > 0) {
            e.preventDefault();
            active = Math.max(active === -1 ? 0 : active - PAGE, 0);
            if (isDisabledItem(items[active])) active = nextEnabledIndex(items, active, 'prev');
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
            reset();
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

    const openDialog = () => {
      if (!dialog) return;
      if (!dialog.open) dialog.showModal();
      reset();
      input.focus();
    };

    if (dialog) {
      let wasOpen = dialog.open;
      const sync = (open: boolean) => {
        if (open === wasOpen) return;
        wasOpen = open;
        options.onOpenChange?.(open);
        emit(Events.openChange, { open });
      };
      on(dialog, 'toggle', (e) => sync((e as ToggleEvent).newState === 'open'));
      on(dialog, 'close', () => sync(false));

      if (hotkey) {
        on<KeyboardEvent>(dialog.ownerDocument, 'keydown', (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey) {
            e.preventDefault();
            openDialog();
          }
        });
      }
    }

    // Initialize the input, active option, and empty state.
    if (options.defaultValue != null) input.value = options.defaultValue;
    lastValue = input.value;
    filter(input.value);
    add(() => setAttrs(input, { 'aria-activedescendant': null }));
    if (options.defaultOpen && dialog && !dialog.open) dialog.showModal();

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
      get open() {
        return dialog ? dialog.open : true;
      },
      setOpen(next) {
        if (!dialog) return;
        if (next) openDialog();
        else if (dialog.open) dialog.close();
      },
    };
  },
});
