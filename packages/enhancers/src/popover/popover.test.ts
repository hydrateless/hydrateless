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

  it('handles hover trigger mode', () => {
    enhancePopover(document, { triggerEvent: 'hover' });
    const opener = document.querySelector<HTMLElement>('[data-hl-popover-open]')!;
    const popover = document.getElementById('pop1')!;

    opener.dispatchEvent(new Event('mouseenter'));
    expect(popover.hidden).toBe(false);

    opener.dispatchEvent(new Event('mouseleave'));
    expect(popover.hidden).toBe(true);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhancePopover(document)).not.toThrow();
  });
});
