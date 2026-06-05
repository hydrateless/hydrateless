import { combine, on, selectRoots, type Disposer } from '../utils/lifecycle.js';

const enhanced = new WeakSet<Element>();

export function enhanceDropdown(container: Document | HTMLElement = document): Disposer {
  const dropdowns = selectRoots(container, '[data-hl-dropdown]');
  const disposers: Disposer[] = [];

  for (const dropdown of dropdowns) {
    if (enhanced.has(dropdown)) continue;
    const trigger = dropdown.querySelector<HTMLElement>('[data-hl-dropdown-trigger]');
    const menu = dropdown.querySelector<HTMLElement>('[data-hl-dropdown-menu]');
    if (!trigger || !menu) continue;

    const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (items.length === 0) continue;

    enhanced.add(dropdown);
    disposers.push(() => enhanced.delete(dropdown));

    if (!trigger.id) trigger.id = `hl-dropdown-trigger-${Math.random().toString(36).slice(2)}`;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-labelledby', trigger.id);
    menu.hidden = true;

    for (const item of items) {
      item.tabIndex = -1;
    }

    // Flip the menu above the trigger when it would overflow the viewport.
    function place(): void {
      menu!.dataset.hlPlacement = 'bottom';
      const triggerRect = trigger!.getBoundingClientRect();
      const menuRect = menu!.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      if (spaceBelow < menuRect.height && triggerRect.top > spaceBelow) {
        menu!.dataset.hlPlacement = 'top';
      }
    }

    function open(): void {
      menu!.hidden = false;
      place();
      trigger!.setAttribute('aria-expanded', 'true');
      items[0]?.focus();
    }

    function close(restoreFocus = true): void {
      menu!.hidden = true;
      trigger!.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger!.focus();
    }

    function isOpen(): boolean {
      return !menu!.hidden;
    }

    disposers.push(
      on(trigger, 'click', (e) => {
        e.preventDefault();
        if (isOpen()) close();
        else open();
      }),
    );

    disposers.push(
      on(trigger, 'keydown', (e) => {
        const ev = e as KeyboardEvent;
        if (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') {
          if (!isOpen()) {
            ev.preventDefault();
            open();
          }
        } else if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          if (!isOpen()) {
            open();
            items[items.length - 1]?.focus();
          }
        }
      }),
    );

    disposers.push(
      on(menu, 'keydown', (e) => {
        const ev = e as KeyboardEvent;
        const active = document.activeElement as HTMLElement | null;
        const idx = active ? items.indexOf(active) : -1;

        switch (ev.key) {
          case 'ArrowDown': {
            ev.preventDefault();
            const next = idx < items.length - 1 ? idx + 1 : 0;
            items[next]?.focus();
            break;
          }
          case 'ArrowUp': {
            ev.preventDefault();
            const prev = idx > 0 ? idx - 1 : items.length - 1;
            items[prev]?.focus();
            break;
          }
          case 'Home': {
            ev.preventDefault();
            items[0]?.focus();
            break;
          }
          case 'End': {
            ev.preventDefault();
            items[items.length - 1]?.focus();
            break;
          }
          case 'Escape': {
            ev.preventDefault();
            close();
            break;
          }
          case 'Tab': {
            close(false);
            break;
          }
          default: {
            if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) {
              const char = ev.key.toLowerCase();
              const start = idx + 1;
              const candidates = [...items.slice(start), ...items.slice(0, start)];
              const match = candidates.find((item) =>
                item.textContent?.trim().toLowerCase().startsWith(char),
              );
              if (match) match.focus();
            }
          }
        }
      }),
    );

    disposers.push(
      on(document, 'click', (e) => {
        if (isOpen() && !dropdown.contains(e.target as Node)) {
          close(false);
        }
      }),
    );

    for (const item of items) {
      disposers.push(on(item, 'click', () => close()));
    }
  }

  return combine(disposers);
}
