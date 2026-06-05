import { combine, on, selectRoots, type Disposer } from '../utils/lifecycle.js';

type TabsElements = {
  root: HTMLElement;
  tablist: HTMLElement;
  tabs: HTMLElement[];
  panels: HTMLElement[];
};

const enhanced = new WeakSet<Element>();

function initGroup(root: HTMLElement): TabsElements | null {
  const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
  if (!tablist) return null;
  const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  if (tabs.length === 0 || panels.length === 0) return null;
  tabs.forEach((tab, i) => {
    if (!tab.id) tab.id = `hl-tab-${Math.random().toString(36).slice(2)}`;
    const panel = panels[i];
    if (panel && !panel.id) panel.id = `hl-panel-${Math.random().toString(36).slice(2)}`;
    if (panel) tab.setAttribute('aria-controls', panel.id);
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.tabIndex = i === 0 ? 0 : -1;
  });
  panels.forEach((panel, i) => {
    panel.setAttribute('aria-labelledby', tabs[i]?.id || '');
    if (i !== 0) panel.hidden = true;
  });
  return { root, tablist, tabs, panels };
}

function selectTab(group: TabsElements, index: number): void {
  group.tabs.forEach((t, i) => {
    const isSelected = i === index;
    t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    t.tabIndex = isSelected ? 0 : -1;
  });
  group.panels.forEach((p, i) => {
    p.hidden = i !== index;
  });
  group.tabs[index]?.focus();
}

export function enhanceTabs(container: Document | HTMLElement = document): Disposer {
  const roots = selectRoots(container, '[data-hl-tabs]');
  const disposers: Disposer[] = [];

  for (const root of roots) {
    if (enhanced.has(root)) continue;
    const group = initGroup(root);
    if (!group) continue;

    enhanced.add(root);
    disposers.push(() => enhanced.delete(root));

    disposers.push(
      on(group.tablist, 'click', (e) => {
        const btn = (e.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
        if (!btn) return;
        const index = group.tabs.indexOf(btn);
        if (index !== -1) selectTab(group, index);
      }),
    );

    disposers.push(
      on(group.tablist, 'keydown', (e) => {
        const ev = e as KeyboardEvent;
        const current = document.activeElement as HTMLElement | null;
        const idx = current ? group.tabs.indexOf(current) : -1;
        if (idx === -1) return;
        let next = idx;
        if (ev.key === 'ArrowRight') next = (idx + 1) % group.tabs.length;
        else if (ev.key === 'ArrowLeft') next = (idx - 1 + group.tabs.length) % group.tabs.length;
        else if (ev.key === 'Home') next = 0;
        else if (ev.key === 'End') next = group.tabs.length - 1;
        else if (ev.key === 'Enter' || ev.key === ' ') {
          selectTab(group, idx);
          ev.preventDefault();
          return;
        } else return;
        group.tabs[next]?.focus();
        ev.preventDefault();
      }),
    );

    group.tabs.forEach((tab, i) => {
      disposers.push(
        on(tab, 'keydown', (e) => {
          const ev = e as KeyboardEvent;
          if (ev.key === 'Enter' || ev.key === ' ') {
            selectTab(group, i);
            ev.preventDefault();
          }
        }),
      );
    });
  }

  return combine(disposers);
}
