import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceCombobox } from './index.js';

function setup() {
  document.body.innerHTML = `
    <div data-hl-combobox>
      <input />
      <ul role="listbox">
        <li role="option" data-hl-value="apple">Apple</li>
        <li role="option" data-hl-value="banana">Banana</li>
        <li role="option" data-hl-value="cherry">Cherry</li>
      </ul>
    </div>
  `;
  enhanceCombobox(document);
  return {
    root: document.querySelector<HTMLElement>('[data-hl-combobox]')!,
    input: document.querySelector<HTMLInputElement>('input')!,
    listbox: document.querySelector<HTMLElement>('[role="listbox"]')!,
    options: Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')),
  };
}

describe('enhanceCombobox', () => {
  beforeEach(() => setup());

  it('wires combobox ARIA on init', () => {
    const input = document.querySelector('input')!;
    const listbox = document.querySelector('[role="listbox"]')!;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    expect((listbox as HTMLElement).hidden).toBe(true);
  });

  it('opens on input and filters options', () => {
    const { input, listbox, options } = setup();
    input.value = 'ch';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(listbox.hidden).toBe(false);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(options[0].hidden).toBe(true);
    expect(options[2].hidden).toBe(false);
  });

  it('moves active option with ArrowDown', () => {
    const { input, options } = setup();
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id);
  });

  it('commits a selection on Enter and emits hl:select', () => {
    const { root, input } = setup();
    let detail: { value: string } | null = null;
    root.addEventListener('hl:select', (e) => (detail = (e as CustomEvent).detail));
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(detail).toEqual({ value: 'apple', option: expect.anything() });
    expect(input.value).toBe('apple');
  });

  it('selects on option click', () => {
    const { input, listbox, options } = setup();
    input.focus();
    options[1].click();
    expect(input.value).toBe('banana');
    expect(listbox.hidden).toBe(true);
  });

  it('closes on Escape', () => {
    const { input, listbox } = setup();
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(listbox.hidden).toBe(true);
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('emits hl:open-change when the listbox expands and collapses', () => {
    document.body.innerHTML = `
      <div data-hl-combobox>
        <input />
        <ul role="listbox"><li role="option" data-hl-value="apple">Apple</li></ul>
      </div>
    `;
    const seen: boolean[] = [];
    enhanceCombobox(document, { onOpenChange: (open) => seen.push(open) });
    const root = document.querySelector<HTMLElement>('[data-hl-combobox]')!;
    const input = document.querySelector('input')!;
    const events: boolean[] = [];
    root.addEventListener('hl:open-change', (e) => events.push((e as CustomEvent).detail.open));

    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(seen).toEqual([true, false]);
    expect(events).toEqual([true, false]);
  });

  it('handles missing structure gracefully', () => {
    document.body.innerHTML = '<div data-hl-combobox></div>';
    expect(() => enhanceCombobox(document)).not.toThrow();
  });

  describe('controlled state', () => {
    it('pre-fills the input from defaultValue', () => {
      document.body.innerHTML = `
        <div data-hl-combobox>
          <input />
          <ul role="listbox"><li role="option" data-hl-value="apple">Apple</li></ul>
        </div>
      `;
      enhanceCombobox(document, { defaultValue: 'apple' });
      expect(document.querySelector('input')!.value).toBe('apple');
    });

    it('exposes value/setValue and open/setOpen through the api', () => {
      document.body.innerHTML = `
        <div data-hl-combobox>
          <input />
          <ul role="listbox"><li role="option" data-hl-value="apple">Apple</li></ul>
        </div>
      `;
      const seen: string[] = [];
      const api = enhanceCombobox(document, { onValueChange: (v) => seen.push(v) }).api!;
      const input = document.querySelector('input')!;
      const listbox = document.querySelector<HTMLElement>('[role="listbox"]')!;

      api.setValue('banana');
      expect(input.value).toBe('banana');
      expect(api.value).toBe('banana');
      expect(seen).toEqual(['banana']);

      api.setOpen(true);
      expect(listbox.hidden).toBe(false);
      expect(api.open).toBe(true);
      api.setOpen(false);
      expect(listbox.hidden).toBe(true);
    });
  });
});
