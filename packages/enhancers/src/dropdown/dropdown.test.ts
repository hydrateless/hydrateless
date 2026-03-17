import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceDropdown } from './index.js';

describe('enhanceDropdown', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-hl-dropdown>
        <button data-hl-dropdown-trigger>Menu</button>
        <ul data-hl-dropdown-menu>
          <li><button role="menuitem">Alpha</button></li>
          <li><button role="menuitem">Beta</button></li>
          <li><button role="menuitem">Charlie</button></li>
        </ul>
      </div>
    `;
  });

  it('sets ARIA attributes on init', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector('[data-hl-dropdown-trigger]')!;
    const menu = document.querySelector('[data-hl-dropdown-menu]')!;

    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect((menu as HTMLElement).hidden).toBe(true);
  });

  it('sets tabindex=-1 on all menuitems', () => {
    enhanceDropdown(document);
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');

    for (const item of items) {
      expect(item.tabIndex).toBe(-1);
    }
  });

  it('opens menu on trigger click', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    expect(menu.hidden).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('focuses first item on open', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');

    trigger.click();
    expect(document.activeElement).toBe(items[0]);
  });

  it('closes menu on second trigger click', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    trigger.click();
    expect(menu.hidden).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes menu on Escape', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(menu.hidden).toBe(true);
  });

  it('navigates with ArrowDown', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[1]);
  });

  it('wraps ArrowDown at end of list', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    items[2].focus();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it('navigates with ArrowUp', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    items[1].focus();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it('jumps to first item on Home', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    items[2].focus();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it('jumps to last item on End', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(items[2]);
  });

  it('closes on menuitem click', () => {
    enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

    trigger.click();
    items[0].click();
    expect(menu.hidden).toBe(true);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceDropdown(document)).not.toThrow();
  });
});
