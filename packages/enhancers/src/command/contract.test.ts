import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceCommand } from './index.js';

const key = (target: EventTarget, k: string, init: KeyboardEventInit = {}) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...init }));
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('enhanceCommand contract', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <dialog>
        <div data-hl-command data-hl-hotkey="k">
          <input data-hl-command-input>
          <ul data-hl-command-list>
            <li role="option" id="a" data-hl-value="a">Alpha</li>
            <li role="option" id="b" data-hl-value="b" aria-disabled="true">Beta</li>
            <li role="option" id="c" data-hl-value="c">Charlie</li>
          </ul>
        </div>
      </dialog>
    `;
  });

  const input = () => document.querySelector<HTMLInputElement>('input')!;
  const dialog = () => document.querySelector('dialog')!;
  const active = () => input().getAttribute('aria-activedescendant');

  it('Home and End jump to the first and last enabled option', () => {
    enhanceCommand(document);
    key(input(), 'End');
    expect(active()).toBe('c');
    key(input(), 'Home');
    expect(active()).toBe('a');
  });

  it('skips disabled options when navigating and refuses to run them', () => {
    const ran: string[] = [];
    enhanceCommand(document, { onCommand: (v) => ran.push(v) });
    key(input(), 'ArrowDown');
    expect(active()).toBe('c');
    document.getElementById('b')!.click();
    expect(ran).toEqual([]);
  });

  it('exposes the hosting dialog as open/setOpen and reports hl:open-change', () => {
    const seen: boolean[] = [];
    const api = enhanceCommand(document, { onOpenChange: (open) => seen.push(open) }).api!;
    expect(api.open).toBe(false);
    api.setOpen(true);
    expect(dialog().open).toBe(true);
    expect(document.activeElement).toBe(input());
    api.setOpen(false);
    expect(dialog().open).toBe(false);
    expect(seen).toEqual([true, false]);
  });

  it('opens with the data-hl-hotkey and closes after a command runs', () => {
    enhanceCommand(document);
    key(document, 'k', { metaKey: true });
    expect(dialog().open).toBe(true);
    key(input(), 'Enter');
    expect(dialog().open).toBe(false);
  });

  it('keeps the dialog open with closeOnCommand: false', () => {
    enhanceCommand(document, { closeOnCommand: false, defaultOpen: true });
    expect(dialog().open).toBe(true);
    key(input(), 'Enter');
    expect(dialog().open).toBe(true);
  });

  it('filters options added later against the current query', async () => {
    const api = enhanceCommand(document).api!;
    api.setValue('del');
    document
      .querySelector('[data-hl-command-list]')!
      .insertAdjacentHTML('beforeend', '<li role="option" id="d">Delta</li>');
    await settle();
    expect(document.getElementById('d')!.hidden).toBe(false);
    expect(document.getElementById('a')!.hidden).toBe(true);
    expect(active()).toBe('d');
  });
});
