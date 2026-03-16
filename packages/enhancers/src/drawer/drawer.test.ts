import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhanceDrawer } from './index.js';

describe('enhanceDrawer', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-hl-drawer-open="my-drawer">Open Drawer</button>
      <dialog id="my-drawer" class="hydrateless-drawer" data-hl-drawer>
        <button data-hl-drawer-close>Close</button>
        <p>Drawer content</p>
      </dialog>
    `;

    const dialog = document.querySelector('dialog')!;
    dialog.showModal = vi.fn(() => {
      dialog.setAttribute('open', '');
      Object.defineProperty(dialog, 'open', { value: true, writable: true });
    });
    dialog.close = vi.fn(() => {
      dialog.removeAttribute('open');
      Object.defineProperty(dialog, 'open', { value: false, writable: true });
    });
  });

  it('opens drawer when opener is clicked', () => {
    enhanceDrawer(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-drawer-open]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('closes drawer when closer is clicked', () => {
    enhanceDrawer(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-drawer-open]')!;
    const closer = document.querySelector<HTMLElement>('[data-hl-drawer-close]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    closer.click();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceDrawer(document)).not.toThrow();
  });
});
