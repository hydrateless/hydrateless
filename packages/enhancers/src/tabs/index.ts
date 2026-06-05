import {
  defineEnhancer,
  ensureId,
  setAttrs,
  nextIndex,
  type MoveDirection,
} from '../core/index.js';

export type EnhanceTabsOptions = {
  /**
   * `manual` (default): arrows move focus, Enter/Space activates. `automatic`:
   * arrows activate the focused tab immediately.
   */
  activation?: 'manual' | 'automatic';
  orientation?: 'horizontal' | 'vertical';
};

type TabsModel = {
  tablist: HTMLElement;
  tabs: HTMLElement[];
  panels: HTMLElement[];
};

function select(model: TabsModel, index: number, focus = true): void {
  model.tabs.forEach((tab, i) => {
    const selected = i === index;
    setAttrs(tab, { 'aria-selected': selected ? 'true' : 'false' });
    tab.tabIndex = selected ? 0 : -1;
  });
  model.panels.forEach((panel, i) => {
    panel.hidden = i !== index;
  });
  if (focus) model.tabs[index]?.focus();
}

export const enhanceTabs = defineEnhancer<EnhanceTabsOptions>({
  name: 'tabs',
  selector: '[data-hl-tabs]',
  defaults: { activation: 'manual', orientation: 'horizontal' },
  setup({ root, options, on }) {
    const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
    if (!tablist) return;
    const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    if (tabs.length === 0 || panels.length === 0) return;

    const model: TabsModel = { tablist, tabs, panels };
    const vertical = options.orientation === 'vertical';
    setAttrs(tablist, { 'aria-orientation': options.orientation ?? 'horizontal' });

    tabs.forEach((tab, i) => {
      const tabId = ensureId(tab, 'hl-tab');
      const panel = panels[i];
      if (panel) {
        const panelId = ensureId(panel, 'hl-panel');
        setAttrs(tab, { 'aria-controls': panelId });
        setAttrs(panel, { role: 'tabpanel', tabindex: 0, 'aria-labelledby': tabId });
        panel.hidden = i !== 0;
      }
      setAttrs(tab, { 'aria-selected': i === 0 ? 'true' : 'false' });
      tab.tabIndex = i === 0 ? 0 : -1;
    });

    on(tablist, 'click', (e) => {
      const tab = (e.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
      if (!tab) return;
      const index = tabs.indexOf(tab);
      if (index !== -1) select(model, index);
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
        const target = nextIndex(current, tabs.length, direction);
        if (options.activation === 'automatic') select(model, target);
        else tabs[target]?.focus();
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(model, current);
      }
    });
  },
});
