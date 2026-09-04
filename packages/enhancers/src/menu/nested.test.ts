import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceMenu } from './index.js';

const key = (target: Element, k: string) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const el = (id: string) => document.getElementById(id)!;

describe('enhanceMenu nested submenus and live items', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul data-hl-menu role="menubar">
        <li>
          <button role="menuitem" id="file" data-hl-value="file">File</button>
          <ul role="menu">
            <li><button role="menuitem" id="new">New</button></li>
            <li>
              <button role="menuitem" id="export">Export</button>
              <ul role="menu">
                <li><button role="menuitem" id="pdf">PDF</button></li>
                <li><button role="menuitem" id="png">PNG</button></li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <button role="menuitem" id="edit" data-hl-value="edit">Edit</button>
          <ul role="menu">
            <li><button role="menuitem" id="undo">Undo</button></li>
          </ul>
        </li>
      </ul>
    `;
  });

  it('wires nested triggers and opens them with the inline-end arrow', () => {
    enhanceMenu(document);
    expect(el('export').getAttribute('aria-haspopup')).toBe('menu');
    const nested = el('export').nextElementSibling as HTMLElement;
    expect(nested.hidden).toBe(true);
    expect(nested.getAttribute('popover')).toBe('manual');

    el('file').focus();
    key(el('file'), 'ArrowDown');
    expect(document.activeElement).toBe(el('new'));
    key(el('new'), 'ArrowDown');
    key(el('export'), 'ArrowRight');
    expect(nested.hidden).toBe(false);
    expect(document.activeElement).toBe(el('pdf'));
    expect(el('export').getAttribute('aria-expanded')).toBe('true');
  });

  it('inline-start closes a nested level, then moves to the previous menubar item', () => {
    const api = enhanceMenu(document).api!;
    el('file').focus();
    key(el('file'), 'ArrowDown');
    key(el('new'), 'ArrowDown');
    key(el('export'), 'ArrowRight');
    key(el('pdf'), 'ArrowLeft');
    expect(document.activeElement).toBe(el('export'));
    expect((el('export').nextElementSibling as HTMLElement).hidden).toBe(true);
    expect(api.value).toBe('file');

    // At depth one, the inline arrows switch top-level menus (wrapping).
    key(el('export'), 'ArrowLeft');
    expect(document.activeElement).toBe(el('edit'));
    expect(api.value).toBe('edit');
    expect((el('edit').nextElementSibling as HTMLElement).hidden).toBe(false);
    expect((el('file').nextElementSibling as HTMLElement).hidden).toBe(true);
    key(el('undo'), 'ArrowRight');
    expect(document.activeElement).toBe(el('file'));
    expect(api.value).toBe('file');
  });

  it('Escape in a nested submenu closes only that level', () => {
    const api = enhanceMenu(document).api!;
    el('file').focus();
    key(el('file'), 'ArrowDown');
    key(el('new'), 'ArrowDown');
    key(el('export'), 'ArrowRight');
    key(el('pdf'), 'Escape');
    expect(document.activeElement).toBe(el('export'));
    expect(api.value).toBe('file');
    key(el('export'), 'Escape');
    expect(document.activeElement).toBe(el('file'));
    expect(api.value).toBeNull();
  });

  it('selecting a nested leaf closes the whole branch and reports the value', () => {
    const selected: string[] = [];
    const changes: (string | null)[] = [];
    enhanceMenu(document, {
      onSelect: (v) => selected.push(v),
      onValueChange: (v) => changes.push(v),
    });
    el('file').click();
    el('export').click();
    el('png').click();
    expect(selected).toEqual(['PNG']);
    expect(changes).toEqual(['file', null]);
    expect((el('file').nextElementSibling as HTMLElement).hidden).toBe(true);
    expect((el('export').nextElementSibling as HTMLElement).hidden).toBe(true);
  });

  it('closes the open branch on a pointerdown outside', () => {
    const api = enhanceMenu(document).api!;
    el('file').click();
    expect(api.value).toBe('file');
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(api.value).toBeNull();
  });

  it('wires top-level items and submenu triggers added later', async () => {
    enhanceMenu(document);
    const root = document.querySelector<HTMLElement>('[data-hl-menu]')!;
    root.insertAdjacentHTML(
      'beforeend',
      `<li>
        <button role="menuitem" id="help">Help</button>
        <ul role="menu"><li><button role="menuitem" id="about">About</button></li></ul>
      </li>`,
    );
    await settle();
    expect(el('help').tabIndex).toBe(-1);
    expect(el('help').getAttribute('aria-haspopup')).toBe('menu');
    expect((el('help').nextElementSibling as HTMLElement).hidden).toBe(true);
    el('edit').focus();
    key(el('edit'), 'ArrowRight');
    expect(document.activeElement).toBe(el('help'));
  });

  it('reads orientation and defaultValue from data attributes', () => {
    const root = document.querySelector<HTMLElement>('[data-hl-menu]')!;
    root.setAttribute('data-hl-orientation', 'vertical');
    root.setAttribute('data-hl-default-value', 'edit');
    const api = enhanceMenu(document).api!;
    expect(root.getAttribute('aria-orientation')).toBe('vertical');
    expect(api.value).toBe('edit');
  });
});
