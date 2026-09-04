import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceTabs } from './index.js';
import { enhanceAccordion } from '../accordion/index.js';

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('live collections', () => {
  describe('tabs', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div data-hl-tabs data-hl-activation="automatic">
          <div role="tablist">
            <button role="tab" id="t1">One</button>
            <button role="tab" id="t2">Two</button>
          </div>
          <div role="tabpanel">P1</div>
          <div role="tabpanel">P2</div>
        </div>
      `;
    });

    it('wires tabs and panels added later and keeps the selection', async () => {
      const api = enhanceTabs(document).api!;
      const root = document.querySelector<HTMLElement>('[data-hl-tabs]')!;
      document.getElementById('t2')!.click();
      root
        .querySelector('[role="tablist"]')!
        .insertAdjacentHTML('beforeend', '<button role="tab" id="t3">Three</button>');
      root.insertAdjacentHTML('beforeend', '<div role="tabpanel" id="p3">P3</div>');
      await settle();
      const t3 = document.getElementById('t3')!;
      expect(t3.getAttribute('aria-selected')).toBe('false');
      expect(t3.tabIndex).toBe(-1);
      expect(t3.getAttribute('aria-controls')).toBe('p3');
      expect(document.getElementById('p3')!.hidden).toBe(true);
      expect(api.value).toBe('1');
      t3.click();
      expect(api.value).toBe('2');
      expect(document.getElementById('p3')!.hidden).toBe(false);
    });

    it('falls back to the first tab when the selected one is removed', async () => {
      const api = enhanceTabs(document).api!;
      document.getElementById('t2')!.click();
      document.getElementById('t2')!.remove();
      document.querySelectorAll('[role="tabpanel"]')[1].remove();
      await settle();
      expect(api.value).toBe('0');
      expect(document.getElementById('t1')!.getAttribute('aria-selected')).toBe('true');
    });

    it('reads activation from the data attribute', () => {
      enhanceTabs(document);
      const t1 = document.getElementById('t1')!;
      t1.focus();
      t1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.getElementById('t2')!.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('accordion', () => {
    it('applies exclusivity to details added later', async () => {
      document.body.innerHTML = `
        <div data-hl-accordion>
          <details data-hl-value="a" open><summary>A</summary>a</details>
          <details data-hl-value="b"><summary>B</summary>b</details>
        </div>
      `;
      const api = enhanceAccordion(document).api!;
      const root = document.querySelector<HTMLElement>('[data-hl-accordion]')!;
      root.insertAdjacentHTML(
        'beforeend',
        '<details data-hl-value="c"><summary>C</summary>c</details>',
      );
      await settle();
      const c = root.querySelector<HTMLDetailsElement>('[data-hl-value="c"]')!;
      c.open = true;
      c.dispatchEvent(new Event('toggle'));
      expect(root.querySelector<HTMLDetailsElement>('[data-hl-value="a"]')!.open).toBe(false);
      await settle();
      expect(api.value).toEqual(['c']);
    });

    it('reads allowMultiple and defaultValue from data attributes', () => {
      document.body.innerHTML = `
        <div data-hl-accordion data-hl-allow-multiple data-hl-default-value="a c">
          <details data-hl-value="a"><summary>A</summary>a</details>
          <details data-hl-value="b"><summary>B</summary>b</details>
          <details data-hl-value="c"><summary>C</summary>c</details>
        </div>
      `;
      expect(enhanceAccordion(document).api!.value).toEqual(['a', 'c']);
    });
  });
});
