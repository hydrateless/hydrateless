import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceAccordion } from './index.js';

describe('enhanceAccordion', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-hl-accordion>
        <details><summary>One</summary><div class="accordion-panel">Panel 1</div></details>
        <details><summary>Two</summary><div class="accordion-panel">Panel 2</div></details>
        <details><summary>Three</summary><div class="accordion-panel">Panel 3</div></details>
      </div>
    `;
  });

  it('closes other panels when one opens (single mode)', () => {
    enhanceAccordion(document);
    const [d1, d2] = document.querySelectorAll('details');

    d1.open = true;
    d1.dispatchEvent(new Event('toggle'));
    expect(d1.open).toBe(true);

    d2.open = true;
    d2.dispatchEvent(new Event('toggle'));
    expect(d2.open).toBe(true);
    expect(d1.open).toBe(false);
  });

  it('allows multiple open panels when allowMultiple is true', () => {
    enhanceAccordion(document, { allowMultiple: true });
    const [d1, d2] = document.querySelectorAll('details');

    d1.open = true;
    d1.dispatchEvent(new Event('toggle'));
    d2.open = true;
    d2.dispatchEvent(new Event('toggle'));

    expect(d1.open).toBe(true);
    expect(d2.open).toBe(true);
  });

  it('handles containers with no accordion groups', () => {
    document.body.innerHTML = '<div>No accordion here</div>';
    expect(() => enhanceAccordion(document)).not.toThrow();
  });

  describe('values and controlled state', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div data-hl-accordion>
          <details data-hl-value="a"><summary>One</summary><div class="hl-accordion-panel">1</div></details>
          <details data-hl-value="b"><summary>Two</summary><div class="hl-accordion-panel">2</div></details>
          <details data-hl-value="c"><summary>Three</summary><div class="hl-accordion-panel">3</div></details>
        </div>
      `;
    });

    it('opens items listed in defaultValue', () => {
      enhanceAccordion(document, { allowMultiple: true, defaultValue: ['a', 'c'] });
      const [d1, d2, d3] = document.querySelectorAll('details');
      expect(d1.open).toBe(true);
      expect(d2.open).toBe(false);
      expect(d3.open).toBe(true);
    });

    it('keeps only the first defaultValue item in single mode', () => {
      enhanceAccordion(document, { defaultValue: ['a', 'c'] });
      const [d1, , d3] = document.querySelectorAll('details');
      expect(d1.open).toBe(true);
      expect(d3.open).toBe(false);
    });

    it('exposes value and setValue through the api', () => {
      const api = enhanceAccordion(document, { allowMultiple: true }).api!;
      expect(api.value).toEqual([]);

      api.setValue(['b', 'c']);
      expect(api.value).toEqual(['b', 'c']);

      api.setValue([]);
      expect(api.value).toEqual([]);
    });

    it('reports changes through onValueChange and hl:change', async () => {
      const seen: string[][] = [];
      const events: string[][] = [];
      document
        .querySelector('[data-hl-accordion]')!
        .addEventListener('hl:change', (e) => events.push((e as CustomEvent).detail.value));
      enhanceAccordion(document, { onValueChange: (value) => seen.push(value) });

      const d2 = document.querySelectorAll('details')[1];
      d2.open = true;
      d2.dispatchEvent(new Event('toggle'));
      await Promise.resolve(); // notifications are coalesced into a microtask

      expect(seen).toEqual([['b']]);
      expect(events).toEqual([['b']]);
    });

    it('falls back to server-rendered open attributes', () => {
      document.body.innerHTML = `
        <div data-hl-accordion>
          <details data-hl-value="a" open><summary>One</summary></details>
          <details data-hl-value="b"><summary>Two</summary></details>
        </div>
      `;
      const api = enhanceAccordion(document).api!;
      expect(api.value).toEqual(['a']);
    });
  });
});
