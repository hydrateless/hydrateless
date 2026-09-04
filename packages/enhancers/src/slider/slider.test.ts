import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceSlider } from './index.js';

describe('enhanceSlider', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-hl-slider data-hl-unit="%">
        <input type="range" min="0" max="200" value="50">
        <output></output>
      </div>
    `;
  });

  const input = () => document.querySelector('input')!;
  const output = () => document.querySelector('output')!;

  it('syncs the output, aria-valuetext, and the progress custom property', () => {
    enhanceSlider(document);
    expect(output().value).toBe('50%');
    expect(output().htmlFor.contains(input().id)).toBe(true);
    expect(input().getAttribute('aria-valuetext')).toBe('50%');
    expect(input().style.getPropertyValue('--hl-slider-progress')).toBe('25%');
  });

  it('updates on input and reports changes', () => {
    const seen: number[] = [];
    const api = enhanceSlider(document, { onValueChange: (v) => seen.push(v) }).api!;
    input().value = '100';
    input().dispatchEvent(new Event('input', { bubbles: true }));
    expect(output().value).toBe('100%');
    expect(input().style.getPropertyValue('--hl-slider-progress')).toBe('50%');
    expect(api.value).toBe(100);
    api.setValue(200);
    expect(output().value).toBe('200%');
    expect(seen).toEqual([100, 200]);
  });

  it('uses a custom formatter and cleans up on destroy', () => {
    const handle = enhanceSlider(document, { format: (v) => `${v / 2} units` });
    expect(output().value).toBe('25 units');
    handle.destroy();
    expect(input().hasAttribute('aria-valuetext')).toBe(false);
    expect(input().style.getPropertyValue('--hl-slider-progress')).toBe('');
  });
});
