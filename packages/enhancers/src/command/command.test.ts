import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceCommand } from './index.js';

function setup() {
  document.body.innerHTML = `
    <div data-hl-command>
      <input data-hl-command-input />
      <div data-hl-command-empty hidden>No results</div>
      <div data-hl-command-list>
        <div data-hl-command-group>
          <div role="option" data-hl-value="open" data-hl-keywords="file">Open file</div>
          <div role="option" data-hl-value="save">Save</div>
          <div role="option" data-hl-value="close">Close</div>
        </div>
      </div>
    </div>
  `;
  enhanceCommand(document);
  return {
    root: document.querySelector<HTMLElement>('[data-hl-command]')!,
    input: document.querySelector<HTMLInputElement>('[data-hl-command-input]')!,
    empty: document.querySelector<HTMLElement>('[data-hl-command-empty]')!,
    options: Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')),
  };
}

describe('enhanceCommand', () => {
  beforeEach(() => setup());

  it('wires ARIA and highlights the first item on init', () => {
    const { input, options } = setup();
    expect(input.getAttribute('role')).toBe('combobox');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id);
  });

  it('filters by text and keywords', () => {
    const { input, options } = setup();
    input.value = 'file';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(options[0].hidden).toBe(false);
    expect(options[1].hidden).toBe(true);
    expect(options[2].hidden).toBe(true);
  });

  it('shows the empty state when nothing matches', () => {
    const { input, empty } = setup();
    input.value = 'zzz';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(empty.hidden).toBe(false);
  });

  it('moves the active item with ArrowDown', () => {
    const { input, options } = setup();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id);
  });

  it('runs the active command on Enter (emits hl:command)', () => {
    const { input, root } = setup();
    let detail: { value: string } | null = null;
    root.addEventListener('hl:command', (e) => (detail = (e as CustomEvent).detail));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(detail).toEqual({ value: 'open', item: expect.anything() });
  });

  it('runs a command on click', () => {
    const { options, root } = setup();
    let value = '';
    root.addEventListener('hl:command', (e) => (value = (e as CustomEvent).detail.value));
    options[2].click();
    expect(value).toBe('close');
  });

  it('handles missing structure gracefully', () => {
    document.body.innerHTML = '<div data-hl-command></div>';
    expect(() => enhanceCommand(document)).not.toThrow();
  });

  describe('controlled state', () => {
    it('exposes the filter query through the handle api', () => {
      document.body.innerHTML = `
        <div data-hl-command>
          <input data-hl-command-input />
          <div data-hl-command-list>
            <div role="option" data-hl-value="open">Open file</div>
            <div role="option" data-hl-value="save">Save</div>
          </div>
        </div>
      `;
      const seen: string[] = [];
      const api = enhanceCommand(document, { onValueChange: (v) => seen.push(v) }).api!;
      const input = document.querySelector<HTMLInputElement>('[data-hl-command-input]')!;
      const options = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));

      expect(api.value).toBe('');
      api.setValue('save');
      expect(input.value).toBe('save');
      expect(api.value).toBe('save');
      expect(options[0].hidden).toBe(true);
      expect(options[1].hidden).toBe(false);
      expect(seen).toEqual(['save']);
    });

    it('pre-fills the query from defaultValue', () => {
      document.body.innerHTML = `
        <div data-hl-command>
          <input data-hl-command-input />
          <div data-hl-command-list>
            <div role="option" data-hl-value="open">Open file</div>
            <div role="option" data-hl-value="save">Save</div>
          </div>
        </div>
      `;
      enhanceCommand(document, { defaultValue: 'open' });
      const input = document.querySelector<HTMLInputElement>('[data-hl-command-input]')!;
      const options = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));
      expect(input.value).toBe('open');
      expect(options[0].hidden).toBe(false);
      expect(options[1].hidden).toBe(true);
    });

    it('emits hl:change while typing', () => {
      const { input, root } = setup();
      const values: string[] = [];
      root.addEventListener('hl:change', (e) => values.push((e as CustomEvent).detail.value));

      input.value = 'sa';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(values).toEqual(['sa']);
    });
  });
});
