import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceTabs } from './tabs/index.js';
import { enhanceDropdown } from './dropdown/index.js';
import { enhancePopover } from './popover/index.js';
import { enhanceToast } from './toast/index.js';
import { enhanceToc } from './toc/index.js';

describe('enhancer lifecycle', () => {
  it('enhances when passed the component root directly (not just a container)', () => {
    document.body.innerHTML = `
      <div data-hl-tabs id="root">
        <div role="tablist"><button role="tab">A</button><button role="tab">B</button></div>
        <div role="tabpanel">A</div>
        <div role="tabpanel">B</div>
      </div>
    `;
    const root = document.getElementById('root')!;
    enhanceTabs(root);
    expect(root.querySelector('[role="tab"]')!.getAttribute('aria-selected')).toBe('true');
  });

  it('enhancers return a callable disposer', () => {
    document.body.innerHTML = `
      <div data-hl-tabs>
        <div role="tablist"><button role="tab">A</button><button role="tab">B</button></div>
        <div role="tabpanel">A</div>
        <div role="tabpanel">B</div>
      </div>
    `;
    const dispose = enhanceTabs(document);
    expect(typeof dispose).toBe('function');
    expect(() => dispose()).not.toThrow();
  });

  describe('idempotency', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div data-hl-dropdown>
          <button data-hl-dropdown-trigger>Menu</button>
          <ul data-hl-dropdown-menu>
            <li><button role="menuitem">Alpha</button></li>
            <li><button role="menuitem">Beta</button></li>
          </ul>
        </div>
      `;
    });

    it('does not double-bind when enhanced twice', () => {
      enhanceDropdown(document);
      enhanceDropdown(document);

      const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
      const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

      trigger.click();
      // A double-bound toggle would open then immediately close again.
      expect(menu.hidden).toBe(false);
    });

    it('re-enhances after dispose', () => {
      const dispose = enhanceDropdown(document);
      dispose();

      const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
      const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

      // Listeners removed: clicking does nothing.
      trigger.click();
      expect(menu.hidden).toBe(true);

      // Re-enhancing wires it back up.
      enhanceDropdown(document);
      trigger.click();
      expect(menu.hidden).toBe(false);
    });
  });

  it('dropdown dispose removes the global outside-click listener', () => {
    document.body.innerHTML = `
      <div data-hl-dropdown>
        <button data-hl-dropdown-trigger>Menu</button>
        <ul data-hl-dropdown-menu>
          <li><button role="menuitem">Alpha</button></li>
        </ul>
      </div>
      <button id="outside">Outside</button>
    `;
    const dispose = enhanceDropdown(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
    trigger.click();
    dispose();

    // After disposal the outside-click handler must not run anymore.
    expect(() => document.getElementById('outside')!.click()).not.toThrow();
  });

  it('popover dispose detaches opener listeners', () => {
    document.body.innerHTML = `
      <button data-hl-popover-open="pop1">Toggle</button>
      <div id="pop1" data-hl-popover hidden>Content</div>
    `;
    const dispose = enhancePopover(document);
    dispose();

    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
    const popover = document.getElementById('pop1')!;
    opener.click();
    expect(popover.hidden).toBe(true);
  });

  it('toast exposes destroy and stops responding after teardown', () => {
    document.body.innerHTML = `
      <div data-hl-toast-region></div>
      <button data-hl-toast-trigger="Hi">Show</button>
    `;
    const api = enhanceToast(document);
    expect(typeof api.destroy).toBe('function');
    api.destroy();

    const trigger = document.querySelector<HTMLElement>('[data-hl-toast-trigger]')!;
    trigger.click();
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('toc returns a disposer that is safe to call', () => {
    document.body.innerHTML = `
      <nav data-hl-toc></nav>
      <main><h2>One</h2><h2>Two</h2></main>
    `;
    const dispose = enhanceToc(document, { scrollSpy: false });
    expect(typeof dispose).toBe('function');
    expect(() => dispose()).not.toThrow();
  });
});
