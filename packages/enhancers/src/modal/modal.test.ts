import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceModal } from './index.js';

describe('enhanceModal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button command="show-modal" commandfor="my-modal">Open</button>
      <dialog id="my-modal" data-hl-modal>
        <h2 class="hl-modal-header">Title</h2>
        <button command="close" commandfor="my-modal">Close</button>
        <p>Modal content</p>
      </dialog>
    `;
  });

  it('opens the dialog from a show-modal invoker command', () => {
    enhanceModal(document);
    const opener = document.querySelector<HTMLElement>('[command="show-modal"]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    expect(dialog.open).toBe(true);
  });

  it('closes the dialog from a command="close" button', () => {
    enhanceModal(document);
    const opener = document.querySelector<HTMLElement>('[command="show-modal"]')!;
    const closer = document.querySelector<HTMLElement>('[command="close"]')!;
    const dialog = document.querySelector('dialog')!;

    opener.click();
    closer.click();
    expect(dialog.open).toBe(false);
  });

  it('labels the dialog from its header', () => {
    enhanceModal(document);
    const dialog = document.querySelector('dialog')!;
    const header = document.querySelector('.hl-modal-header')!;
    expect(header.id).not.toBe('');
    expect(dialog.getAttribute('aria-labelledby')).toBe(header.id);
  });

  it('enables native light-dismiss with closedby="any" by default', () => {
    enhanceModal(document);
    expect(document.querySelector('dialog')!.getAttribute('closedby')).toBe('any');
  });

  it('leaves closedby untouched when closeOnBackdrop is false', () => {
    enhanceModal(document, { closeOnBackdrop: false });
    expect(document.querySelector('dialog')!.hasAttribute('closedby')).toBe(false);
  });

  it('mirrors open state through the api and onOpenChange/hl:open-change', () => {
    const changes: boolean[] = [];
    const events: boolean[] = [];
    document
      .querySelector('dialog')!
      .addEventListener('hl:open-change', (e) => events.push((e as CustomEvent).detail.open));
    const handle = enhanceModal(document, { onOpenChange: (open) => changes.push(open) });
    const dialog = document.querySelector('dialog')!;
    const api = handle.api!;

    expect(api.open).toBe(false);
    api.setOpen(true);
    expect(api.open).toBe(true);
    expect(dialog.open).toBe(true);
    api.setOpen(false);
    expect(api.open).toBe(false);
    expect(changes).toEqual([true, false]);
    expect(events).toEqual([true, false]);
  });

  it('opens immediately with defaultOpen', () => {
    enhanceModal(document, { defaultOpen: true });
    expect(document.querySelector('dialog')!.open).toBe(true);
  });

  it('handles missing dialog gracefully', () => {
    document.body.innerHTML = '<button command="show-modal" commandfor="nonexistent">Open</button>';
    enhanceModal(document);
    const opener = document.querySelector<HTMLElement>('[command]')!;
    expect(() => opener.click()).not.toThrow();
  });
});
