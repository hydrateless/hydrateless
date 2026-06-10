import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhancePopover } from './index.js';

describe('enhancePopover', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-hl-popover-open="pop1">Toggle</button>
      <div id="pop1" data-hl-popover hidden>Popover content</div>
      <button data-hl-popover-close="pop1">Close</button>
    `;
  });

  it('shows popover on opener click (fallback)', () => {
    enhancePopover(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
    const popover = document.getElementById('pop1')!;

    opener.click();
    expect(popover.hidden).toBe(false);
  });

  it('hides popover on closer click (fallback)', () => {
    enhancePopover(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
    const closer = document.querySelector<HTMLElement>('[data-hl-popover-close]')!;
    const popover = document.getElementById('pop1')!;

    opener.click();
    closer.click();
    expect(popover.hidden).toBe(true);
  });

  it('uses native popover API when available', () => {
    const popover = document.getElementById('pop1')!;
    Object.defineProperty(popover, 'popover', {
      value: 'auto',
      writable: true,
    });
    popover.showPopover = vi.fn();
    popover.hidePopover = vi.fn();

    enhancePopover(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;

    opener.click();
    expect(popover.showPopover).toHaveBeenCalled();
  });

  it('handles hover trigger mode with a close grace period', () => {
    vi.useFakeTimers();
    enhancePopover(document, { triggerEvent: 'hover' });
    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
    const popover = document.getElementById('pop1')!;

    opener.dispatchEvent(new Event('mouseenter'));
    expect(popover.hidden).toBe(false);

    opener.dispatchEvent(new Event('mouseleave'));
    expect(popover.hidden).toBe(false); // grace period pending
    vi.advanceTimersByTime(100);
    expect(popover.hidden).toBe(true);
    vi.useRealTimers();
  });

  it('keeps a hover popover open while the pointer is over it', () => {
    vi.useFakeTimers();
    enhancePopover(document, { triggerEvent: 'hover' });
    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
    const popover = document.getElementById('pop1')!;

    opener.dispatchEvent(new Event('mouseenter'));
    opener.dispatchEvent(new Event('mouseleave'));
    popover.dispatchEvent(new Event('mouseenter')); // cancels the pending close
    vi.advanceTimersByTime(500);
    expect(popover.hidden).toBe(false);
    vi.useRealTimers();
  });

  it('wires aria-expanded and aria-controls on openers', () => {
    enhancePopover(document);
    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
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
    expect(popover.hidden).toBe(false);
    expect(api.open).toBe(true);
    api.setOpen(false);
    expect(popover.hidden).toBe(true);
  });

  it('reports open changes through onOpenChange and hl:open-change', () => {
    const changes: boolean[] = [];
    const events: boolean[] = [];
    document
      .getElementById('pop1')!
      .addEventListener('hl:open-change', (e) => events.push((e as CustomEvent).detail.open));
    enhancePopover(document, { onOpenChange: (open) => changes.push(open) });

    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
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
