type TabsElements = {
  root: HTMLElement;
  tablist: HTMLElement;
  tabs: HTMLElement[];
  panels: HTMLElement[];
};

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

export function enhanceTabs(container: Document | HTMLElement = document): void {
  const roots = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-tabs]'));
  for (const root of roots) {
    const group = initGroup(root);
    if (!group) continue;

    group.tablist.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
      if (!btn) return;
      const index = group.tabs.indexOf(btn);
      if (index !== -1) selectTab(group, index);
    });

    group.tablist.addEventListener('keydown', (e) => {
      const current = document.activeElement as HTMLElement | null;
      const idx = current ? group.tabs.indexOf(current) : -1;
      if (idx === -1) return;
      let next = idx;
      if (e.key === 'ArrowRight') next = (idx + 1) % group.tabs.length;
      else if (e.key === 'ArrowLeft') next = (idx - 1 + group.tabs.length) % group.tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = group.tabs.length - 1;
      else if (e.key === 'Enter' || e.key === ' ') {
        selectTab(group, idx);
        e.preventDefault();
        return;
      } else return;
      group.tabs[next]?.focus();
      e.preventDefault();
    });

    group.tabs.forEach((tab, i) => {
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectTab(group, i);
          e.preventDefault();
        }
      });
    });
  }
}
