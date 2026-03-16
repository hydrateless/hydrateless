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
});
