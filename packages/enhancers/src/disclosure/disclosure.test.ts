import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceDisclosure } from './index.js';

describe('enhanceDisclosure', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <details data-hl-disclosure><summary>A</summary><div class="disclosure-panel">Content A</div></details>
      <details data-hl-disclosure><summary>B</summary><div class="disclosure-panel">Content B</div></details>
    `;
  });

  it('closes other disclosures when one opens (single mode)', () => {
    enhanceDisclosure(document);
    const [a, b] = document.querySelectorAll('details');

    a.open = true;
    a.dispatchEvent(new Event('toggle'));
    expect(a.open).toBe(true);

    b.open = true;
    b.dispatchEvent(new Event('toggle'));
    expect(b.open).toBe(true);
    expect(a.open).toBe(false);
  });

  it('allows multiple open when allowMultiple is true', () => {
    enhanceDisclosure(document, { allowMultiple: true });
    const [a, b] = document.querySelectorAll('details');

    a.open = true;
    a.dispatchEvent(new Event('toggle'));
    b.open = true;
    b.dispatchEvent(new Event('toggle'));

    expect(a.open).toBe(true);
    expect(b.open).toBe(true);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceDisclosure(document)).not.toThrow();
  });
});
