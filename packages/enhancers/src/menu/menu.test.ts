import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceMenu } from './index.js';

function setup() {
  document.body.innerHTML = `
    <ul data-hl-menu role="menubar">
      <li>
        <button role="menuitem">File</button>
        <ul role="menu" data-hl-menu-submenu>
          <li><button role="menuitem">New</button></li>
          <li><button role="menuitem">Open</button></li>
        </ul>
      </li>
      <li><button role="menuitem">Edit</button></li>
    </ul>
  `;
  enhanceMenu(document);
  const top = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hl-menu] > li > [role="menuitem"]'),
  );
  return {
    root: document.querySelector<HTMLElement>('[data-hl-menu]')!,
    file: top[0],
    edit: top[1],
    submenu: document.querySelector<HTMLElement>('[data-hl-menu-submenu]')!,
    subItems: Array.from(
      document.querySelectorAll<HTMLElement>('[data-hl-menu-submenu] [role="menuitem"]'),
    ),
  };
}

describe('enhanceMenu', () => {
  beforeEach(() => setup());

  it('wires roving tabindex and submenu ARIA on init', () => {
    const { root, file, edit, submenu } = setup();
    expect(root.getAttribute('aria-orientation')).toBe('horizontal');
    expect(file.tabIndex).toBe(0);
    expect(edit.tabIndex).toBe(-1);
    expect(file.getAttribute('aria-haspopup')).toBe('true');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(file.getAttribute('aria-controls')).toBe(submenu.id);
    expect(submenu.hidden).toBe(true);
  });

  it('moves focus between top items with ArrowRight', () => {
    const { file, edit } = setup();
    file.focus();
    file.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(edit);
  });

  it('opens a submenu with ArrowDown and focuses the first item', () => {
    const { file, submenu, subItems } = setup();
    file.focus();
    file.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(submenu.hidden).toBe(false);
    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(subItems[0]);
  });

  it('opens a submenu with Enter', () => {
    const { file, submenu } = setup();
    file.focus();
    file.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(submenu.hidden).toBe(false);
  });

  it('closes the submenu on Escape and restores focus to the trigger', () => {
    const { file, submenu, subItems } = setup();
    file.focus();
    file.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    subItems[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(submenu.hidden).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(file);
  });

  it('toggles a submenu on trigger click', () => {
    const { file, submenu } = setup();
    file.click();
    expect(submenu.hidden).toBe(false);
    file.click();
    expect(submenu.hidden).toBe(true);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceMenu(document)).not.toThrow();
  });
});
