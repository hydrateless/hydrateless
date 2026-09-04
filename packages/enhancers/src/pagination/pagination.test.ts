import { describe, it, expect, beforeEach } from 'vitest';
import { enhancePagination } from './index.js';

const key = (target: Element, k: string) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
const el = (selector: string) => document.querySelector<HTMLElement>(selector)!;

describe('enhancePagination', () => {
  describe('authored controls', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <nav data-hl-pagination>
          <ul>
            <li><button class="hl-pagination-item" data-hl-page="prev">Prev</button></li>
            <li><button class="hl-pagination-item" data-hl-page="1" aria-current="page">1</button></li>
            <li><button class="hl-pagination-item" data-hl-page="2">2</button></li>
            <li><button class="hl-pagination-item" data-hl-page="3">3</button></li>
            <li><button class="hl-pagination-item" data-hl-page="next">Next</button></li>
          </ul>
        </nav>
      `;
    });

    it('reads the current page from aria-current and disables prev at the start', () => {
      const api = enhancePagination(document).api!;
      expect(api.value).toBe(1);
      expect(api.total).toBe(3);
      expect(el('nav').getAttribute('aria-label')).toBe('Pagination');
      expect((el('[data-hl-page="prev"]') as HTMLButtonElement).disabled).toBe(true);
      expect((el('[data-hl-page="next"]') as HTMLButtonElement).disabled).toBe(false);
    });

    it('changes page on click and reports through onValueChange and hl:change', () => {
      const seen: number[] = [];
      const events: number[] = [];
      document.addEventListener('hl:change', (e) => events.push((e as CustomEvent).detail.value));
      const api = enhancePagination(document, { onValueChange: (v) => seen.push(v) }).api!;
      el('[data-hl-page="3"]').click();
      expect(api.value).toBe(3);
      expect(el('[data-hl-page="3"]').getAttribute('aria-current')).toBe('page');
      expect(el('[data-hl-page="1"]').hasAttribute('aria-current')).toBe(false);
      expect((el('[data-hl-page="next"]') as HTMLButtonElement).disabled).toBe(true);
      el('[data-hl-page="prev"]').click();
      expect(api.value).toBe(2);
      expect(seen).toEqual([3, 2]);
      expect(events).toEqual([3, 2]);
    });

    it('moves focus between numbered pages with arrows, Home, and End', () => {
      enhancePagination(document);
      const one = el('[data-hl-page="1"]');
      one.focus();
      key(one, 'ArrowRight');
      expect(document.activeElement).toBe(el('[data-hl-page="2"]'));
      key(document.activeElement!, 'End');
      expect(document.activeElement).toBe(el('[data-hl-page="3"]'));
      key(document.activeElement!, 'Home');
      expect(document.activeElement).toBe(one);
    });

    it('clamps setValue and reads defaultValue from data attributes', () => {
      el('nav').setAttribute('data-hl-default-value', '2');
      const api = enhancePagination(document).api!;
      expect(api.value).toBe(2);
      api.setValue(99);
      expect(api.value).toBe(3);
    });
  });

  describe('rendered controls', () => {
    it('renders the range from total when the list is empty and re-renders on change', () => {
      document.body.innerHTML = `<nav data-hl-pagination data-hl-total="20"><ul></ul></nav>`;
      const api = enhancePagination(document).api!;
      const labels = () =>
        Array.from(document.querySelectorAll('li')).map(
          (li) => li.querySelector('[data-hl-page]')?.getAttribute('data-hl-page') ?? '…',
        );
      expect(labels()).toEqual(['prev', '1', '2', '3', '4', '5', '…', '20', 'next']);
      expect(el('[data-hl-page="prev"]').getAttribute('aria-label')).toBe('Previous page');

      api.setValue(10);
      expect(labels()).toEqual(['prev', '1', '…', '9', '10', '11', '…', '20', 'next']);
      expect(el('[data-hl-page="10"]').getAttribute('aria-current')).toBe('page');
      el('[data-hl-page="next"]').click();
      expect(api.value).toBe(11);
    });
  });
});
