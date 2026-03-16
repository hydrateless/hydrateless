import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceTabs } from './index.js';

describe('enhanceTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-hl-tabs>
        <div role="tablist">
          <button role="tab">Tab 1</button>
          <button role="tab">Tab 2</button>
          <button role="tab">Tab 3</button>
        </div>
        <div role="tabpanel">Panel 1</div>
        <div role="tabpanel">Panel 2</div>
        <div role="tabpanel">Panel 3</div>
      </div>
    `;
  });

  it('sets up ARIA attributes on init', () => {
    enhanceTabs(document);
    const tabs = document.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
  });

  it('first panel is visible, others are hidden', () => {
    enhanceTabs(document);
    const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(panels[2].hidden).toBe(true);
  });

  it('switches panels on tab click', () => {
    enhanceTabs(document);
    const tabs = document.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    (tabs[1] as HTMLElement).click();

    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
  });

  it('navigates with arrow keys', () => {
    enhanceTabs(document);
    const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');

    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(tabs[1]);
  });

  it('wraps around with arrow keys', () => {
    enhanceTabs(document);
    const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');

    tabs[2].focus();
    const tablist = document.querySelector('[role="tablist"]')!;
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(tabs[0]);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceTabs(document)).not.toThrow();
  });
});
