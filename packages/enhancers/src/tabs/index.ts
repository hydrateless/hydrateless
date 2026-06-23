import {
  defineEnhancer,
  ensureId,
  setAttrs,
  nextIndex,
  Events,
  type MoveDirection,
} from '../core/index.js';

/** Options for {@link enhanceTabs}. */
export type EnhanceTabsOptions = {
  /**
   * `manual` (default): arrows move focus, Enter/Space activates. `automatic`:
   * arrows activate the focused tab immediately.
   */
  activation?: 'manual' | 'automatic';
  orientation?: 'horizontal' | 'vertical';
  /**
   * Value of the initially selected tab. Falls back to the tab whose radio is
   * pre-checked (server-rendered state), then to the first enabled tab. Tab
   * values come from each radio's `value` (or `data-hl-value`), else the index.
   */
  defaultValue?: string;
  /** Called with the new tab value after every selection change. */
  onValueChange?: (value: string) => void;
};

/** Imperative handle returned by {@link enhanceTabs}. */
export type TabsApi = {
  /** Value of the currently selected tab. */
  readonly value: string;
  /** Select the tab with `value`. Pass `focus: true` to also move focus. */
  setValue: (value: string, options?: { focus?: boolean }) => void;
};

/**
 * Upgrade a CSS-only tab group to the full APG tabs pattern. The baseline works
 * with no JavaScript: each tab is a `<label>` wrapping a hidden radio, and the
 * stylesheet reveals the matching panel through `:has(input:checked)`, so
 * panels switch and server-rendered state shows correctly before (or without)
 * this enhancer. When it runs, it layers on the accessibility the radio group
 * can't express on its own: `role="tablist"`/`tab`/`tabpanel`, `aria-selected`,
 * `aria-controls`, roving tabindex, arrow/Home/End navigation with disabled-tab
 * skipping, and manual or automatic activation. The radios stay the single
 * source of truth, so CSS keeps owning panel visibility. Selection is
 * observable through `onValueChange`/`hl:change` and controllable through the
 * returned API.
 */
export const enhanceTabs = defineEnhancer<EnhanceTabsOptions, TabsApi>({
  name: 'tabs',
  selector: '[data-hl-tabs]',
  defaults: { activation: 'manual', orientation: 'horizontal' },
  setup({ root, options, on, add, emit }) {
    const tablist = root.querySelector<HTMLElement>('[role="tablist"], .hl-tablist');
    if (!tablist) return;
    const panelHost = root.querySelector<HTMLElement>('.hl-tabpanels') ?? root;
    const tabs = Array.from(
      tablist.querySelectorAll<HTMLElement>(':scope > .hl-tab, :scope > [role="tab"]'),
    );
    const panels = Array.from(
      panelHost.querySelectorAll<HTMLElement>(':scope > .hl-tabpanel, :scope > [role="tabpanel"]'),
    );
    if (tabs.length === 0 || panels.length === 0) return;

    const radios = tabs.map((tab) => tab.querySelector<HTMLInputElement>('input[type="radio"]'));
    const disabled = tabs.map(
      (tab, i) =>
        tab.hasAttribute('disabled') ||
        tab.getAttribute('aria-disabled') === 'true' ||
        Boolean(radios[i]?.disabled),
    );

    const vertical = options.orientation === 'vertical';
    setAttrs(tablist, { role: 'tablist', 'aria-orientation': options.orientation ?? 'horizontal' });

    const valueOf = (tab: HTMLElement, i: number): string =>
      radios[i]?.value || tab.getAttribute('data-hl-value') || String(i);
    const values = tabs.map(valueOf);
    const indexOfValue = (value: string) => values.indexOf(value);

    const firstEnabled = disabled.findIndex((d) => !d);
    // Server-rendered selection: a pre-checked radio (CSS-only baseline) or a
    // pre-set `aria-selected` (button markup) both seed the initial tab.
    const preselected = (() => {
      const byRadio = radios.findIndex((radio) => radio?.checked);
      if (byRadio !== -1) return byRadio;
      return tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    })();
    let selected =
      options.defaultValue != null && indexOfValue(options.defaultValue) !== -1
        ? indexOfValue(options.defaultValue)
        : preselected !== -1
          ? preselected
          : Math.max(firstEnabled, 0);

    tabs.forEach((tab, i) => {
      const tabId = ensureId(tab, 'hl-tab');
      setAttrs(tab, { role: 'tab' });
      // The radio is the no-JS state holder. Once JS owns the tabs, `role="tab"`
      // sits on the wrapping label, so a still-focusable radio inside it would be
      // a nested interactive control. `hidden` takes it out of the focus order
      // and the accessibility tree while it keeps driving the CSS `:checked`
      // baseline; it's restored on destroy so that baseline returns intact.
      const radio = radios[i];
      if (radio) {
        setAttrs(radio, { tabindex: -1, 'aria-hidden': 'true' });
        radio.hidden = true;
        add(() => {
          radio.hidden = false;
          radio.removeAttribute('tabindex');
          radio.removeAttribute('aria-hidden');
        });
      }
      const panel = panels[i];
      if (panel) {
        const panelId = ensureId(panel, 'hl-panel');
        setAttrs(tab, { 'aria-controls': panelId });
        setAttrs(panel, { role: 'tabpanel', tabindex: 0, 'aria-labelledby': tabId });
      }
    });

    /**
     * Reflect `selected` into ARIA, roving tabindex, panel visibility, and the
     * radios CSS reads. Toggling `hidden` keeps the APG contract and guarantees
     * panels switch even if the `:has(input:checked)` stylesheet isn't loaded;
     * keeping the radios in sync lets the no-JS CSS baseline stay correct.
     */
    const paint = (focus: boolean) => {
      tabs.forEach((tab, i) => {
        const isSelected = i === selected;
        setAttrs(tab, { 'aria-selected': isSelected ? 'true' : 'false' });
        tab.tabIndex = isSelected ? 0 : -1;
        const radio = radios[i];
        if (radio) radio.checked = isSelected;
        const panel = panels[i];
        if (panel) panel.hidden = !isSelected;
      });
      if (focus) tabs[selected]?.focus();
    };

    const select = (index: number, focus = true) => {
      if (index < 0 || index >= tabs.length || disabled[index]) return;
      const changed = index !== selected;
      selected = index;
      paint(focus);
      if (changed) {
        const value = values[selected];
        options.onValueChange?.(value);
        emit(Events.change, { value });
      }
    };

    /** Next enabled tab in `direction`, skipping disabled ones. */
    const move = (from: number, direction: MoveDirection): number => {
      let index = nextIndex(from, tabs.length, direction);
      const step = direction === 'first' ? 'next' : direction === 'last' ? 'prev' : direction;
      for (let i = 0; i < tabs.length && disabled[index]; i += 1) {
        index = nextIndex(index, tabs.length, step);
      }
      return index;
    };

    // Signal to CSS that JS has upgraded the tabs (e.g. to drop the no-JS
    // "first panel only" fallback). Removed on destroy so the baseline returns.
    root.setAttribute('data-hl-ready', '');
    add(() => root.removeAttribute('data-hl-ready'));

    paint(false);

    on(tablist, 'click', (e) => {
      const tab = (e.target as HTMLElement).closest<HTMLElement>('.hl-tab, [role="tab"]');
      if (!tab || !tabs.includes(tab) || disabled[tabs.indexOf(tab)]) return;
      // Own selection ourselves so focus lands on the tab, not its hidden radio.
      e.preventDefault();
      select(tabs.indexOf(tab));
    });

    on<KeyboardEvent>(tablist, 'keydown', (e) => {
      const active = (root.ownerDocument.activeElement as HTMLElement) ?? null;
      const current = active ? tabs.indexOf(active) : -1;
      if (current === -1) return;

      const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
      let direction: MoveDirection | null = null;
      if (e.key === nextKey) direction = 'next';
      else if (e.key === prevKey) direction = 'prev';
      else if (e.key === 'Home') direction = 'first';
      else if (e.key === 'End') direction = 'last';

      if (direction) {
        e.preventDefault();
        const target = move(current, direction);
        if (options.activation === 'automatic') select(target);
        else tabs[target]?.focus();
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(current);
      }
    });

    return {
      get value() {
        return values[selected];
      },
      setValue(value, { focus = false } = {}) {
        const index = indexOfValue(value);
        if (index !== -1) select(index, focus);
      },
    };
  },
});
