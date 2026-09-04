import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhanceMenu } from './index.js';

function setup(options?: Parameters<typeof enhanceMenu>[1]) {
  document.body.innerHTML = `
    <ul data-hl-menu role="menubar">
      <li>
        <button role="menuitem" data-hl-value="file">File</button>
        <ul role="menu" data-hl-submenu>
          <li><button role="menuitem">New</button></li>
          <li><button role="menuitem" aria-disabled="true">Recent</button></li>
          <li><button role="menuitem">Open</button></li>
          <li><button role="menuitemcheckbox" data-hl-value="autosave">Autosave</button></li>
        </ul>
      </li>
      <li><button role="menuitem" data-hl-value="edit">Edit</button></li>
    </ul>
  `;
  const handle = enhanceMenu(document, options);
  const tops = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hl-menu] > li > [role="menuitem"]'),
  );
  return {
    handle,
    root: document.querySelector<HTMLElement>('[data-hl-menu]')!,
    file: tops[0],
    edit: tops[1],
    submenu: document.querySelector<HTMLElement>('[data-hl-submenu]')!,
    subItems: Array.from(
      document.querySelectorAll<HTMLElement>('[data-hl-submenu] [role^="menuitem"]'),
    ),
  };
}

describe('enhanceMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('wires roving tabindex, submenu ARIA, and data-hl-ready on init', () => {
    const { root, file, edit, submenu, subItems, handle } = setup();
    expect(root.getAttribute('aria-orientation')).toBe('horizontal');
    expect(root.hasAttribute('data-hl-ready')).toBe(true);
    expect(file.tabIndex).toBe(0);
    expect(edit.tabIndex).toBe(-1);
    expect(file.getAttribute('aria-haspopup')).toBe('menu');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(file.getAttribute('aria-controls')).toBe(submenu.id);
    expect(submenu.hidden).toBe(true);
    // Checkable items always carry an explicit aria-checked.
    expect(subItems[3].getAttribute('aria-checked')).toBe('false');

    handle.destroy();
    expect(root.hasAttribute('data-hl-ready')).toBe(false);
    expect(submenu.hidden).toBe(false);
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

  it('skips disabled items while navigating a submenu', () => {
    const { file, subItems } = setup();
    file.focus();
    file.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    subItems[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(subItems[2]);
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

  it('exposes the open submenu as value through the handle api', () => {
    const { handle, submenu } = setup();
    expect(handle.api!.value).toBeNull();

    handle.api!.setValue('file');
    expect(submenu.hidden).toBe(false);
    expect(handle.api!.value).toBe('file');

    handle.api!.setValue(null);
    expect(submenu.hidden).toBe(true);
    expect(handle.api!.value).toBeNull();
  });

  it('opens the defaultValue submenu without moving focus', () => {
    const { handle, submenu, subItems } = setup({ defaultValue: 'file' });
    expect(handle.api!.value).toBe('file');
    expect(submenu.hidden).toBe(false);
    expect(document.activeElement).not.toBe(subItems[0]);
  });

  it('notifies onValueChange and emits hl:change', () => {
    const onValueChange = vi.fn();
    const events: Array<{ value: string | null }> = [];
    document.addEventListener('hl:change', (e) => {
      events.push((e as CustomEvent).detail);
    });
    const { file } = setup({ onValueChange });

    file.click();
    expect(onValueChange).toHaveBeenCalledWith('file');
    file.click();
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(events).toEqual([{ value: 'file' }, { value: null }]);
  });

  it('emits a cancelable hl:select when a leaf item is activated', () => {
    const onSelect = vi.fn();
    const { edit, subItems, file, submenu } = setup({ onSelect });

    edit.click();
    expect(onSelect).toHaveBeenCalledWith('edit', edit, undefined);

    file.click();
    subItems[0].click();
    expect(onSelect).toHaveBeenCalledWith('New', subItems[0], undefined);
    expect(submenu.hidden).toBe(true);
  });

  it('toggles menuitemcheckbox state and reports it', () => {
    const onSelect = vi.fn();
    const { file, subItems } = setup({ onSelect });
    file.click();
    subItems[3].click();
    expect(subItems[3].getAttribute('aria-checked')).toBe('true');
    expect(onSelect).toHaveBeenCalledWith('autosave', subItems[3], true);
  });

  it('ignores disabled items', () => {
    const onSelect = vi.fn();
    const { file, subItems } = setup({ onSelect });
    file.click();
    subItems[1].click();
    expect(onSelect).not.toHaveBeenCalled();
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
