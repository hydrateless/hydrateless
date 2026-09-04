import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceCheckbox } from './index.js';

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const box = (value: string) => document.querySelector<HTMLInputElement>(`[value="${value}"]`)!;
const all = () => document.querySelector<HTMLInputElement>('[data-hl-checkbox-all]')!;
const change = (input: HTMLInputElement, checked: boolean) => {
  input.checked = checked;
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

describe('enhanceCheckbox', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <fieldset data-hl-checkbox-group>
        <label><input type="checkbox" data-hl-checkbox-all> All</label>
        <label><input type="checkbox" value="a" checked> A</label>
        <label><input type="checkbox" value="b"> B</label>
        <label><input type="checkbox" value="c" data-hl-indeterminate> C</label>
      </fieldset>
    `;
  });

  it('reflects the group into the master box and applies data-hl-indeterminate', () => {
    const api = enhanceCheckbox(document).api!;
    expect(all().checked).toBe(false);
    expect(all().indeterminate).toBe(true);
    expect(box('c').indeterminate).toBe(true);
    expect(api.value).toEqual(['a']);
  });

  it('toggles every box from the master and reports the values', () => {
    const seen: string[][] = [];
    const api = enhanceCheckbox(document, { onValueChange: (v) => seen.push(v) }).api!;
    change(all(), true);
    expect(api.value).toEqual(['a', 'b', 'c']);
    expect(all().checked).toBe(true);
    expect(all().indeterminate).toBe(false);
    expect(box('c').indeterminate).toBe(false);
    change(box('b'), false);
    expect(all().indeterminate).toBe(true);
    expect(seen).toEqual([
      ['a', 'b', 'c'],
      ['a', 'c'],
    ]);
  });

  it('setValue checks exactly the listed boxes; data-hl-default-value seeds it', () => {
    document.querySelector('fieldset')!.setAttribute('data-hl-default-value', 'b c');
    const api = enhanceCheckbox(document).api!;
    expect(api.value).toEqual(['b', 'c']);
    api.setValue(['a']);
    expect(box('a').checked).toBe(true);
    expect(box('b').checked).toBe(false);
  });

  it('includes boxes added later', async () => {
    const api = enhanceCheckbox(document).api!;
    document
      .querySelector('fieldset')!
      .insertAdjacentHTML(
        'beforeend',
        '<label><input type="checkbox" value="d" checked> D</label>',
      );
    await settle();
    expect(api.value).toEqual(['a', 'd']);
    expect(all().indeterminate).toBe(true);
  });
});
