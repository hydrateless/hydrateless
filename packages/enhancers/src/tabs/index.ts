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
   * Value of the initially selected tab. Falls back to a tab pre-marked with
   * `aria-selected="true"` (e.g. server-rendered state), then to the first
   * enabled tab. Tab values come from `data-hl-value`, defaulting to the index.
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

const valueOf = (tab: HTMLElement, index: number): string =>
  tab.getAttribute('data-hl-value') ?? String(index);

const isDisabled = (tab: HTMLElement): boolean =>
  tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true';

/**
 * APG tabs: `aria-selected`, `aria-controls`, roving tabindex, arrow/Home/End
 * navigation with disabled-tab skipping, and manual or automatic activation.
 * Selection is observable through the `onValueChange` callback and the
 * bubbling `hl:change` event, and controllable through the returned API.
 */
export const enhanceTabs = defineEnhancer<EnhanceTabsOptions, TabsApi>({
  name: 'tabs',
  selector: '[data-hl-tabs]',
  defaults: { activation: 'manual', orientation: 'horizontal' },
  setup({ root, options, on, emit, add }) {
    const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
    if (!tablist) return;
    const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    if (tabs.length === 0 || panels.length === 0) return;

    const vertical = options.orientation === 'vertical';
    setAttrs(tablist, { 'aria-orientation': options.orientation ?? 'horizontal' });

    const values = tabs.map(valueOf);
    const indexOfValue = (value: string) => values.indexOf(value);

    const firstEnabled = tabs.findIndex((tab) => !isDisabled(tab));
    const preselected = tabs.findIndex(
      (tab) => tab.getAttribute('aria-selected') === 'true' && !isDisabled(tab),
    );
    let selected =
      options.defaultValue != null && indexOfValue(options.defaultValue) !== -1
        ? indexOfValue(options.defaultValue)
        : preselected !== -1
          ? preselected
          : Math.max(firstEnabled, 0);

    const paint = (focus: boolean) => {
      tabs.forEach((tab, i) => {
        const isSelected = i === selected;
        setAttrs(tab, { 'aria-selected': isSelected ? 'true' : 'false' });
        tab.tabIndex = isSelected ? 0 : -1;
      });
      panels.forEach((panel, i) => {
        panel.hidden = i !== selected;
      });
      if (focus) tabs[selected]?.focus();
    };

    const select = (index: number, focus = true) => {
      if (index < 0 || index >= tabs.length || isDisabled(tabs[index])) return;
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
      if (direction === 'first' || direction === 'last') {
        const step = direction === 'first' ? 'next' : 'prev';
        for (let i = 0; i < tabs.length && isDisabled(tabs[index]); i += 1) {
          index = nextIndex(index, tabs.length, step);
        }
        return index;
      }
      for (let i = 0; i < tabs.length && isDisabled(tabs[index]); i += 1) {
        index = nextIndex(index, tabs.length, direction);
      }
      return index;
    };

    tabs.forEach((tab, i) => {
      const tabId = ensureId(tab, 'hl-tab');
      const panel = panels[i];
      if (panel) {
        const panelId = ensureId(panel, 'hl-panel');
        setAttrs(tab, { 'aria-controls': panelId });
        setAttrs(panel, { role: 'tabpanel', tabindex: 0, 'aria-labelledby': tabId });
      }
    });
    paint(false);

    // Signals CSS that JS owns panel visibility (enables the no-JS fallback).
    setAttrs(root, { 'data-hl-ready': true });
    add(() => setAttrs(root, { 'data-hl-ready': null }));

    on(tablist, 'click', (e) => {
      const tab = (e.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
      if (!tab || isDisabled(tab)) return;
      const index = tabs.indexOf(tab);
      if (index !== -1) select(index);
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
