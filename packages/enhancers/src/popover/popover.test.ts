import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhancePopover } from './index.js';

describe('enhancePopover', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button popovertarget="pop1">Toggle</button>
      <div id="pop1" data-hl-popover>Popover content</div>
    `;
  });

  it('adopts the native popover attribute and wires invoker ARIA', () => {
    enhancePopover(document);
    const opener = document.querySelector<HTMLButtonElement>('[popovertarget]')!;
    const popover = document.getElementById('pop1')!;

    expect(popover.getAttribute('popover')).toBe('auto');
    expect(opener.getAttribute('aria-controls')).toBe('pop1');
    expect(opener.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles through the native invoker and mirrors aria-expanded', () => {
    enhancePopover(document);
    const opener = document.querySelector<HTMLButtonElement>('[popovertarget]')!;
    const popover = document.getElementById('pop1')!;

    opener.click();
    expect(popover.matches(':popover-open')).toBe(true);
    expect(opener.getAttribute('aria-expanded')).toBe('true');

    opener.click();
    expect(popover.matches(':popover-open')).toBe(false);
    expect(opener.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens immediately with defaultOpen', () => {
    enhancePopover(document, { defaultOpen: true });
    const popover = document.getElementById('pop1')!;
    expect(popover.matches(':popover-open')).toBe(true);
  });

  it('handles hover trigger mode with a close grace period', () => {
    vi.useFakeTimers();
    enhancePopover(document, { triggerEvent: 'hover', hoverCloseDelay: 100 });
    const opener = document.querySelector<HTMLElement>('[popovertarget]')!;
    const popover = document.getElementById('pop1')!;

    opener.dispatchEvent(new Event('mouseenter'));
    expect(popover.matches(':popover-open')).toBe(true);

    opener.dispatchEvent(new Event('mouseleave'));
    expect(popover.matches(':popover-open')).toBe(true); // grace period pending
    vi.advanceTimersByTime(100);
    expect(popover.matches(':popover-open')).toBe(false);
    vi.useRealTimers();
  });

  it('keeps a hover popover open while the pointer is over it', () => {
    vi.useFakeTimers();
    enhancePopover(document, { triggerEvent: 'hover' });
    const opener = document.querySelector<HTMLElement>('[popovertarget]')!;
    const popover = document.getElementById('pop1')!;

    opener.dispatchEvent(new Event('mouseenter'));
    opener.dispatchEvent(new Event('mouseleave'));
    popover.dispatchEvent(new Event('mouseenter')); // cancels the pending close
    vi.advanceTimersByTime(500);
    expect(popover.matches(':popover-open')).toBe(true);
    vi.useRealTimers();
  });

  it('wires aria-expanded and aria-controls on openers', () => {
    enhancePopover(document);
    const opener = document.querySelector<HTMLElement>('[popovertarget]')!;
    expect(opener.getAttribute('aria-expanded')).toBe('false');
    expect(opener.getAttribute('aria-controls')).toBe('pop1');

    opener.click();
    expect(opener.getAttribute('aria-expanded')).toBe('true');
  });

  it('exposes open state and setOpen through the handle api', () => {
    const handle = enhancePopover(document);
    const popover = document.getElementById('pop1')!;
    const api = handle.api!;

    expect(api.open).toBe(false);
    api.setOpen(true);
    expect(popover.matches(':popover-open')).toBe(true);
    expect(api.open).toBe(true);
    api.setOpen(false);
    expect(popover.matches(':popover-open')).toBe(false);
  });

  it('reports open changes through onOpenChange and hl:open-change', () => {
    const changes: boolean[] = [];
    const events: boolean[] = [];
    document
      .getElementById('pop1')!
      .addEventListener('hl:open-change', (e) => events.push((e as CustomEvent).detail.open));
    enhancePopover(document, { onOpenChange: (open) => changes.push(open) });

    const opener = document.querySelector<HTMLElement>('[popovertarget]')!;
    opener.click();
    opener.click();
    expect(changes).toEqual([true, false]);
    expect(events).toEqual([true, false]);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhancePopover(document)).not.toThrow();
  });
});
