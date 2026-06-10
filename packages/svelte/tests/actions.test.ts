import { describe, it, expect } from 'vitest';
import { tabs, dropdown, combobox, menu } from '../src/actions.js';
import { useToast } from '../src/toast.js';

describe('@hydrateless/svelte actions', () => {
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

  it('combobox action wires combobox ARIA', () => {
    const node = document.createElement('div');
    node.setAttribute('data-hl-combobox', '');
    node.innerHTML = `
      <input />
      <ul role="listbox">
        <li role="option" data-hl-value="a">Alpha</li>
      </ul>
    `;
    document.body.appendChild(node);

    const ret = combobox(node);
    const input = node.querySelector('input')!;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('false');

    ret?.destroy?.();
    node.remove();
  });

  it('menu action sets roving tabindex', () => {
    const node = document.createElement('ul');
    node.setAttribute('data-hl-menu', '');
    node.setAttribute('role', 'menubar');
    node.innerHTML = `
      <li><button role="menuitem">File</button></li>
      <li><button role="menuitem">Edit</button></li>
    `;
    document.body.appendChild(node);

    const ret = menu(node);
    const items = node.querySelectorAll<HTMLElement>('[role="menuitem"]');
    expect(items[0].tabIndex).toBe(0);
    expect(items[1].tabIndex).toBe(-1);

    ret?.destroy?.();
    node.remove();
  });

  it('useToast shows and dismisses toasts without setup', () => {
    document.body.innerHTML = '<div data-hl-toast-region></div>';
    const api = useToast();
    const toast = api.show('Saved', { duration: 0 });
    expect(document.querySelector('[data-hl-toast]')?.textContent).toContain('Saved');
    api.dismiss(toast);
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });
});
