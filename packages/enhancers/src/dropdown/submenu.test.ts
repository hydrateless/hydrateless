import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceDropdown } from './index.js';

const key = (target: Element, k: string) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

/** Wait for a MutationObserver callback. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('enhanceDropdown nested submenus', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-hl-dropdown>
        <button data-hl-dropdown-trigger>File</button>
        <ul data-hl-dropdown-menu>
          <li><button role="menuitem" id="new">New</button></li>
          <li>
            <button role="menuitem" id="share">Share</button>
            <ul role="menu">
              <li><button role="menuitem" id="email">Email</button></li>
              <li>
                <button role="menuitem" id="social">Social</button>
                <ul role="menu">
                  <li><button role="menuitem" id="x">X</button></li>
                </ul>
              </li>
            </ul>
          </li>
          <li><button role="menuitem" id="quit">Quit</button></li>
        </ul>
      </div>
    `;
  });

  const el = (id: string) => document.getElementById(id)!;

  it('wires submenu triggers and hides submenus initially', () => {
    enhanceDropdown(document);
    expect(el('share').getAttribute('aria-haspopup')).toBe('menu');
    expect(el('share').getAttribute('aria-expanded')).toBe('false');
    const submenu = el('share').nextElementSibling as HTMLElement;
    expect(submenu.hidden).toBe(true);
    expect(submenu.getAttribute('aria-labelledby')).toBe(el('share').id);
    expect(el('email').tabIndex).toBe(-1);
  });

  it('opens a submenu with the inline-end arrow and focuses its first item', () => {
    enhanceDropdown(document);
    document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!.click();
    el('share').focus();
    key(el('share'), 'ArrowRight');
    const submenu = el('share').nextElementSibling as HTMLElement;
    expect(submenu.hidden).toBe(false);
    expect(el('share').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(el('email'));
  });

  it('navigates within the submenu and steps back out with the inline-start arrow', () => {
    enhanceDropdown(document);
    document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!.click();
    el('share').focus();
    key(el('share'), 'Enter');
    key(el('email'), 'ArrowDown');
    expect(document.activeElement).toBe(el('social'));
    key(el('social'), 'ArrowLeft');
    expect(document.activeElement).toBe(el('share'));
    expect((el('share').nextElementSibling as HTMLElement).hidden).toBe(true);
  });

  it('opens nested submenus several levels deep and Escape closes one level', () => {
    enhanceDropdown(document);
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;
    document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!.click();
    el('share').focus();
    key(el('share'), 'ArrowRight');
    key(el('email'), 'ArrowDown');
    key(el('social'), 'ArrowRight');
    expect(document.activeElement).toBe(el('x'));
    key(el('x'), 'Escape');
    expect(document.activeElement).toBe(el('social'));
    expect(menu.matches(':popover-open')).toBe(true);
    key(el('social'), 'Escape');
    expect(document.activeElement).toBe(el('share'));
    key(el('share'), 'Escape');
    expect(menu.matches(':popover-open')).toBe(false);
  });

  it('closes every submenu when a leaf item is selected', () => {
    const selected: string[] = [];
    enhanceDropdown(document, { onSelect: (v) => selected.push(v) });
    document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!.click();
    el('share').click();
    expect((el('share').nextElementSibling as HTMLElement).hidden).toBe(false);
    el('email').click();
    expect(selected).toEqual(['Email']);
    expect((el('share').nextElementSibling as HTMLElement).hidden).toBe(true);
    expect(el('share').getAttribute('aria-expanded')).toBe('false');
  });

  it('opens a submenu on hover and collapses it when hovering a sibling leaf', () => {
    enhanceDropdown(document);
    document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!.click();
    el('share').dispatchEvent(new Event('pointerover', { bubbles: true }));
    expect((el('share').nextElementSibling as HTMLElement).hidden).toBe(false);
    el('quit').dispatchEvent(new Event('pointerover', { bubbles: true }));
    expect((el('share').nextElementSibling as HTMLElement).hidden).toBe(true);
  });

  it('picks up items added after enhancement', async () => {
    enhanceDropdown(document);
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;
    menu.insertAdjacentHTML(
      'beforeend',
      '<li><button role="menuitemcheckbox" id="late">Late</button></li>',
    );
    await settle();
    expect(el('late').tabIndex).toBe(-1);
    expect(el('late').getAttribute('aria-checked')).toBe('false');
    document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!.click();
    key(menu, 'End');
    expect(document.activeElement).toBe(el('late'));
  });

  it('reads placement and closeOnSelect from data attributes', () => {
    const root = document.querySelector<HTMLElement>('[data-hl-dropdown]')!;
    root.setAttribute('data-hl-close-on-select', 'false');
    enhanceDropdown(document);
    const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;
    document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!.click();
    el('new').click();
    expect(menu.matches(':popover-open')).toBe(true);
  });
});
