import { describe, it, expect } from 'vitest';
import { tabs, dropdown } from './actions.js';
import { createToast } from './toast.js';

describe('@hydrateless/svelte', () => {
  it('tabs action wires ARIA roles and disposes', () => {
    const node = document.createElement('div');
    node.setAttribute('data-hl-tabs', '');
    node.innerHTML = `
      <div role="tablist">
        <button role="tab">A</button>
        <button role="tab">B</button>
      </div>
      <div role="tabpanel">A</div>
      <div role="tabpanel">B</div>
    `;
    document.body.appendChild(node);

    const ret = tabs(node);
    const firstTab = node.querySelector('[role="tab"]')!;
    expect(firstTab.getAttribute('aria-selected')).toBe('true');

    expect(() => ret?.destroy?.()).not.toThrow();
    node.remove();
  });

  it('dropdown action toggles aria-expanded', () => {
    const node = document.createElement('div');
    node.setAttribute('data-hl-dropdown', '');
    node.innerHTML = `
      <button data-hl-dropdown-trigger>Menu</button>
      <ul data-hl-dropdown-menu>
        <li><button role="menuitem">Edit</button></li>
      </ul>
    `;
    document.body.appendChild(node);

    const ret = dropdown(node);
    const trigger = node.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    ret?.destroy?.();
    node.remove();
  });

  it('createToast shows and dismisses toasts', () => {
    document.body.innerHTML = '<div data-hl-toast-region></div>';
    const api = createToast(document);
    const toast = api.show('Saved', { duration: 0 });
    expect(document.querySelector('[data-hl-toast]')?.textContent).toContain('Saved');
    api.dismiss(toast);
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
    api.destroy();
  });
});
