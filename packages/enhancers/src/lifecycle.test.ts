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

  it('enhancers return a handle with destroy, api, and instances', () => {
    document.body.innerHTML = `
      <div data-hl-tabs>
        <div role="tablist"><button role="tab">A</button><button role="tab">B</button></div>
        <div role="tabpanel">A</div>
        <div role="tabpanel">B</div>
      </div>
    `;
    const handle = enhanceTabs(document);
    expect(typeof handle.destroy).toBe('function');
    expect(handle.instances).toHaveLength(1);
    expect(handle.api).not.toBeNull();
    expect(() => handle.destroy()).not.toThrow();
    expect(() => handle.destroy()).not.toThrow(); // double-destroy is safe
  });

  it('returns an empty handle when nothing matches', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    const handle = enhanceTabs(document);
    expect(handle.instances).toHaveLength(0);
    expect(handle.api).toBeNull();
    expect(() => handle.destroy()).not.toThrow();
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
      const first = enhanceDropdown(document);
      const second = enhanceDropdown(document);
      // The second pass sees an already-enhanced root and skips it.
      expect(first.instances).toHaveLength(1);
      expect(second.instances).toHaveLength(0);

      const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
      const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

      trigger.click();
      expect(menu.matches(':popover-open')).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('re-enhances after destroy', () => {
      const handle = enhanceDropdown(document);
      const trigger = document.querySelector<HTMLElement>('[data-hl-dropdown-trigger]')!;
      const menu = document.querySelector<HTMLElement>('[data-hl-dropdown-menu]')!;

      // Enhanced: the toggle listener mirrors aria-expanded onto the trigger.
      trigger.click();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      trigger.click();

      handle.destroy();

      // The declarative invoker (popovertarget) still toggles the popover, but
      // the enhancer's listener is gone, so aria-expanded is no longer synced.
      trigger.click();
      expect(menu.matches(':popover-open')).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      trigger.click();

      // Re-enhancing the same root works (its WeakSet entry cleared on destroy).
      const second = enhanceDropdown(document);
      expect(second.instances).toHaveLength(1);
      trigger.click();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('popover destroy detaches hover listeners', () => {
    document.body.innerHTML = `
      <button popovertarget="pop1">Toggle</button>
      <div id="pop1" data-hl-popover>Content</div>
    `;
    enhancePopover(document, { triggerEvent: 'hover' }).destroy();

    const opener = document.querySelector<HTMLElement>('[popovertarget]')!;
    const popover = document.getElementById('pop1')!;
    // The hover listener was removed, so pointer entry no longer opens it.
    opener.dispatchEvent(new Event('mouseenter'));
    expect(popover.matches(':popover-open')).toBe(false);
  });

  it('toast api stops responding after destroy', () => {
    document.body.innerHTML = `
      <div data-hl-toast-region></div>
      <button data-hl-toast-trigger="Hi">Show</button>
    `;
    const handle = enhanceToast(document);
    expect(typeof handle.api?.show).toBe('function');
    handle.destroy();

    const trigger = document.querySelector<HTMLElement>('[data-hl-toast-trigger]')!;
    trigger.click();
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('toc destroy is safe to call', () => {
    document.body.innerHTML = `
      <nav data-hl-toc></nav>
      <main><h2>One</h2><h2>Two</h2></main>
    `;
    const handle = enhanceToc(document, { scrollSpy: false });
    expect(() => handle.destroy()).not.toThrow();
  });
});
