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

  it('marks the root ready for the no-JS CSS fallback', () => {
    const handle = enhanceTabs(document);
    const root = document.querySelector('[data-hl-tabs]')!;
    expect(root.hasAttribute('data-hl-ready')).toBe(true);

    handle.destroy();
    expect(root.hasAttribute('data-hl-ready')).toBe(false);
  });

  describe('values and controlled state', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div data-hl-tabs>
          <div role="tablist">
            <button role="tab" data-hl-value="one">Tab 1</button>
            <button role="tab" data-hl-value="two">Tab 2</button>
            <button role="tab" data-hl-value="three" disabled>Tab 3</button>
          </div>
          <div role="tabpanel">Panel 1</div>
          <div role="tabpanel">Panel 2</div>
          <div role="tabpanel">Panel 3</div>
        </div>
      `;
    });

    it('selects defaultValue initially', () => {
      enhanceTabs(document, { defaultValue: 'two' });
      const tabs = document.querySelectorAll('[role="tab"]');
      expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    });

    it('exposes value and setValue through the api', () => {
      const handle = enhanceTabs(document);
      const api = handle.api!;
      expect(api.value).toBe('one');

      api.setValue('two');
      expect(api.value).toBe('two');
      const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');
      expect(panels[1].hidden).toBe(false);
    });

    it('ignores setValue for unknown or disabled values', () => {
      const api = enhanceTabs(document).api!;
      api.setValue('nope');
      expect(api.value).toBe('one');
      api.setValue('three'); // disabled
      expect(api.value).toBe('one');
    });

    it('reports changes through onValueChange and hl:change', () => {
      const seen: string[] = [];
      const events: string[] = [];
      document
        .querySelector('[data-hl-tabs]')!
        .addEventListener('hl:change', (e) => events.push((e as CustomEvent).detail.value));
      enhanceTabs(document, { onValueChange: (value) => seen.push(value) });

      (document.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
      expect(seen).toEqual(['two']);
      expect(events).toEqual(['two']);
    });

    it('skips disabled tabs during keyboard navigation', () => {
      enhanceTabs(document);
      const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs[1].focus();
      tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      // Tab 3 is disabled, so focus wraps to tab 1.
      expect(document.activeElement).toBe(tabs[0]);
    });

    it('respects server-rendered aria-selected as the initial value', () => {
      document.body.innerHTML = `
        <div data-hl-tabs>
          <div role="tablist">
            <button role="tab">Tab 1</button>
            <button role="tab" aria-selected="true">Tab 2</button>
          </div>
          <div role="tabpanel">Panel 1</div>
          <div role="tabpanel">Panel 2</div>
        </div>
      `;
      const api = enhanceTabs(document).api!;
      expect(api.value).toBe('1');
    });
  });
});
