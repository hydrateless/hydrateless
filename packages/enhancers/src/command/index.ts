import { defineEnhancer, ensureId, setAttrs, nextIndex, Events } from '../core/index.js';

/** Options for {@link enhanceCommand}. */
export type EnhanceCommandOptions = {
  /** Lowercased key that, with Cmd/Ctrl, opens the palette's dialog. */
  hotkey?: string;
  /** Called with the command's value when a command runs. */
  onCommand?: (value: string, item: HTMLElement) => void;
};

/**
 * Command palette: a filterable `role="listbox"` of `role="option"` commands
 * with arrow navigation, type-to-filter (matching text + `data-hl-keywords`),
 * automatic empty-state and group hiding, and Enter to run the active command
 * (emits a cancelable `hl:command` CustomEvent). When the palette lives inside
 * a `<dialog>`, an optional `data-hl-command-hotkey` opens it with Cmd/Ctrl+key.
 */
export const enhanceCommand = defineEnhancer<EnhanceCommandOptions>({
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

    on(input, 'input', () => filter(input.value));

    on<KeyboardEvent>(input, 'keydown', (e) => {
      const items = visible();
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          active = nextIndex(active, items.length, 'next');
          paint();
          break;
        case 'ArrowUp':
          e.preventDefault();
          active = nextIndex(active, items.length, 'prev');
          paint();
          break;
        case 'Home':
          e.preventDefault();
          active = 0;
          paint();
          break;
        case 'End':
          e.preventDefault();
          active = items.length - 1;
          paint();
          break;
        case 'Enter':
          if (items[active]) {
            e.preventDefault();
            run(items[active]);
          }
          break;
        case 'Escape':
          if (dialog?.open) {
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
          filter('');
        }
      });
    }

    // Initialize active option / empty state.
    filter('');
    add(() => setAttrs(input, { 'aria-activedescendant': null }));
  },
});
