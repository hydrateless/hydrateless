import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhanceModal } from './index.js';

describe('enhanceModal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-hl-modal-open="my-modal">Open</button>
      <dialog id="my-modal" data-hl-modal>
        <button data-hl-modal-close>Close</button>
        <p>Modal content</p>
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

  it('opens dialog when opener is clicked', () => {
    enhanceModal(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-modal-open]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('closes dialog when closer is clicked', () => {
    enhanceModal(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-modal-open]')!;
    const closer = document.querySelector<HTMLElement>('[data-hl-modal-close]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    closer.click();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('handles missing dialog gracefully', () => {
    document.body.innerHTML = '<button data-hl-modal-open="nonexistent">Open</button>';
    enhanceModal(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-modal-open]')!;
    expect(() => opener.click()).not.toThrow();
  });
});
