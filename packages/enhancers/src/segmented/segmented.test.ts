import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceSegmented } from './index.js';

const key = (target: Element, k: string) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
const btn = (value: string) => document.querySelector<HTMLElement>(`[data-hl-value="${value}"]`)!;

describe('enhanceSegmented', () => {
  describe('button segments', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="hl-segmented" data-hl-segmented>
          <button class="hl-segmented-item" data-hl-value="day" aria-pressed="true">Day</button>
          <button class="hl-segmented-item" data-hl-value="week">Week</button>
          <button class="hl-segmented-item" data-hl-value="month" disabled>Month</button>
          <button class="hl-segmented-item" data-hl-value="year">Year</button>
        </div>
      `;
    });

    it('applies the radio group pattern with a roving tabindex', () => {
      const api = enhanceSegmented(document).api!;
      const root = document.querySelector('[data-hl-segmented]')!;
      expect(root.getAttribute('role')).toBe('radiogroup');
      expect(btn('day').getAttribute('role')).toBe('radio');
      expect(btn('day').getAttribute('aria-checked')).toBe('true');
      expect(btn('day').hasAttribute('aria-pressed')).toBe(false);
      expect(btn('day').tabIndex).toBe(0);
      expect(btn('week').tabIndex).toBe(-1);
      expect(api.value).toBe('day');
    });

    it('selects on click and reports changes', () => {
      const seen: string[] = [];
      const api = enhanceSegmented(document, { onValueChange: (v) => seen.push(v) }).api!;
      btn('week').click();
      expect(api.value).toBe('week');
      expect(btn('week').getAttribute('aria-checked')).toBe('true');
      expect(btn('day').getAttribute('aria-checked')).toBe('false');
      btn('month').click();
      expect(api.value).toBe('week');
      expect(seen).toEqual(['week']);
    });

    it('arrows select as they move and skip disabled segments', () => {
      const api = enhanceSegmented(document).api!;
      btn('day').focus();
      key(btn('day'), 'ArrowRight');
      expect(document.activeElement).toBe(btn('week'));
      expect(api.value).toBe('week');
      key(btn('week'), 'ArrowRight');
      expect(document.activeElement).toBe(btn('year'));
      key(btn('year'), 'ArrowRight');
      expect(document.activeElement).toBe(btn('day'));
      key(btn('day'), 'End');
      expect(api.value).toBe('year');
    });

    it('reads data-hl-default-value', () => {
      document.querySelector('[data-hl-segmented]')!.setAttribute('data-hl-default-value', 'year');
      expect(enhanceSegmented(document).api!.value).toBe('year');
      expect(btn('year').getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('radio segments', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="hl-segmented" role="radiogroup" data-hl-segmented>
          <label class="hl-segmented-item"><input type="radio" name="v" value="list" checked> List</label>
          <label class="hl-segmented-item"><input type="radio" name="v" value="grid"> Grid</label>
        </div>
      `;
    });

    it('mirrors the checked radio and lets setValue drive it', () => {
      const seen: string[] = [];
      const api = enhanceSegmented(document, { onValueChange: (v) => seen.push(v) }).api!;
      expect(api.value).toBe('list');
      const grid = document.querySelector<HTMLInputElement>('[value="grid"]')!;
      grid.checked = true;
      grid.dispatchEvent(new Event('change', { bubbles: true }));
      expect(api.value).toBe('grid');
      api.setValue('list');
      expect(document.querySelector<HTMLInputElement>('[value="list"]')!.checked).toBe(true);
      expect(seen).toEqual(['grid', 'list']);
    });
  });
});
