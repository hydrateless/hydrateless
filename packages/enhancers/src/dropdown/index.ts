export function enhanceDropdown(container: Document | HTMLElement = document): void {
  const dropdowns = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-dropdown]'));

  for (const dropdown of dropdowns) {
    const trigger = dropdown.querySelector<HTMLElement>('[data-hl-dropdown-trigger]');
    const menu = dropdown.querySelector<HTMLElement>('[data-hl-dropdown-menu]');
    if (!trigger || !menu) continue;

    const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (items.length === 0) continue;

    if (!trigger.id) trigger.id = `hl-dropdown-trigger-${Math.random().toString(36).slice(2)}`;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-labelledby', trigger.id);
    menu.hidden = true;

    for (const item of items) {
      item.tabIndex = -1;
    }

    function open(): void {
      menu!.hidden = false;
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

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (isOpen()) close();
      else open();
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (!isOpen()) {
          e.preventDefault();
          open();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen()) {
          open();
          items[items.length - 1]?.focus();
        }
      }
    });

    menu.addEventListener('keydown', (e) => {
      const active = document.activeElement as HTMLElement | null;
      const idx = active ? items.indexOf(active) : -1;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = idx < items.length - 1 ? idx + 1 : 0;
          items[next]?.focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = idx > 0 ? idx - 1 : items.length - 1;
          items[prev]?.focus();
          break;
        }
        case 'Home': {
          e.preventDefault();
          items[0]?.focus();
          break;
        }
        case 'End': {
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        }
        case 'Escape': {
          e.preventDefault();
          close();
          break;
        }
        case 'Tab': {
          close(false);
          break;
        }
        default: {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            const char = e.key.toLowerCase();
            const start = idx + 1;
            const candidates = [...items.slice(start), ...items.slice(0, start)];
            const match = candidates.find((item) =>
              item.textContent?.trim().toLowerCase().startsWith(char),
            );
            if (match) match.focus();
          }
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (isOpen() && !dropdown.contains(e.target as Node)) {
        close(false);
      }
    });

    for (const item of items) {
      item.addEventListener('click', () => close());
    }
  }
}
