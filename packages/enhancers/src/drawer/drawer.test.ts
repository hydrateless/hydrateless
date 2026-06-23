import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceDrawer } from './index.js';

describe('enhanceDrawer', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button command="show-modal" commandfor="my-drawer">Open Drawer</button>
      <dialog id="my-drawer" class="hydrateless-drawer" data-hl-drawer>
        <h2 class="hl-drawer-header">Title</h2>
        <button command="close" commandfor="my-drawer">Close</button>
        <p>Drawer content</p>
      </dialog>
    `;
  });

  it('opens the drawer from a show-modal invoker command', () => {
    enhanceDrawer(document);
    const opener = document.querySelector<HTMLElement>('[command="show-modal"]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    expect(dialog.open).toBe(true);
  });

  it('closes the drawer from a command="close" button', () => {
    enhanceDrawer(document);
    const opener = document.querySelector<HTMLElement>('[command="show-modal"]')!;
    const closer = document.querySelector<HTMLElement>('[command="close"]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    closer.click();
    expect(dialog.open).toBe(false);
  });

  it('labels the drawer from its header and exposes the imperative api', () => {
    const handle = enhanceDrawer(document);
    const dialog = document.querySelector('dialog')!;
    const header = document.querySelector('.hl-drawer-header')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe(header.id);

    handle.api!.setOpen(true);
    expect(dialog.open).toBe(true);
    handle.api!.setOpen(false);
    expect(dialog.open).toBe(false);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceDrawer(document)).not.toThrow();
  });
});
