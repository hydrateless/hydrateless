import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhanceMenu } from './index.js';

function setup(options?: Parameters<typeof enhanceMenu>[1]) {
  document.body.innerHTML = `
    <ul data-hl-menu role="menubar">
      <li>
        <button role="menuitem" data-hl-value="file">File</button>
        <ul role="menu" data-hl-menu-submenu>
          <li><button role="menuitem">New</button></li>
          <li><button role="menuitem">Open</button></li>
        </ul>
      </li>
      <li><button role="menuitem" data-hl-value="edit">Edit</button></li>
    </ul>
  `;
  const handle = enhanceMenu(document, options);
  const top = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hl-menu] > li > [role="menuitem"]'),
  );
  return {
    handle,
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
  beforeEach(() => {
    document.body.innerHTML = '';
  });

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

  it('promotes the submenu to a manual popover in the top layer', () => {
    const { file, submenu } = setup();
    expect(submenu.getAttribute('popover')).toBe('manual');

    file.click();
    expect(submenu.matches(':popover-open')).toBe(true);
    file.click();
    expect(submenu.matches(':popover-open')).toBe(false);
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

  it('exposes the open submenu through the handle api', () => {
    const { handle, submenu } = setup();
    expect(handle.api!.open).toBeNull();

    handle.api!.setOpen('file');
    expect(submenu.hidden).toBe(false);
    expect(handle.api!.open).toBe('file');

    handle.api!.setOpen(null);
    expect(submenu.hidden).toBe(true);
    expect(handle.api!.open).toBeNull();
  });

  it('notifies onOpenChange and emits hl:open-change', () => {
    const onOpenChange = vi.fn();
    const events: Array<{ open: boolean; value: string | null }> = [];
    document.addEventListener('hl:open-change', (e) => {
      events.push((e as CustomEvent).detail);
    });
    const { file } = setup({ onOpenChange });

    file.click();
    expect(onOpenChange).toHaveBeenCalledWith('file');
    file.click();
    expect(onOpenChange).toHaveBeenCalledWith(null);
    expect(events).toEqual([
      { open: true, value: 'file' },
      { open: false, value: null },
    ]);
  });

  it('emits a cancelable hl:select when a leaf item is activated', () => {
    const onSelect = vi.fn();
    const { edit, subItems, file, submenu } = setup({ onSelect });

    edit.click();
    expect(onSelect).toHaveBeenCalledWith('edit', edit);

    file.click();
    subItems[0].click();
    expect(onSelect).toHaveBeenCalledWith('New', subItems[0]);
    expect(submenu.hidden).toBe(true);
  });

  it('cancels selection when hl:select is prevented', () => {
    const onSelect = vi.fn();
    const { edit } = setup({ onSelect });
    document.addEventListener('hl:select', (e) => e.preventDefault(), { once: true });

    edit.click();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceMenu(document)).not.toThrow();
  });
});
