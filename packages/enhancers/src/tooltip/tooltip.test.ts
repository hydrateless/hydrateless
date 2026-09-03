import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { enhanceTooltip } from './index.js';

/** Shown state under the jsdom Popover shim (the tip is a `popover="manual"`). */
const isShown = (tip: HTMLElement) => tip.matches(':popover-open');

describe('enhanceTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <button data-hl-tooltip="tip1" aria-describedby="tip1">Hover me</button>
      <div id="tip1" role="tooltip" hidden>Tooltip text</div>
    `;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('promotes the tip to a manual popover and drops the markup hidden', () => {
    const handle = enhanceTooltip(document);
    const tooltip = document.getElementById('tip1')!;
    expect(tooltip.getAttribute('popover')).toBe('manual');
    expect(tooltip.hasAttribute('hidden')).toBe(false);
    expect(isShown(tooltip)).toBe(false);

    handle.destroy();
    expect(tooltip.hasAttribute('popover')).toBe(false);
    expect(tooltip.hasAttribute('hidden')).toBe(true);
  });

  it('shows tooltip after the hover delay', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    expect(isShown(tooltip)).toBe(false); // not yet, delay pending
    vi.advanceTimersByTime(150);
    expect(isShown(tooltip)).toBe(true);
    expect(tooltip.hasAttribute('data-hl-tooltip-open')).toBe(true);
  });

  it('shows immediately when showDelay is 0', () => {
    enhanceTooltip(document, { showDelay: 0 });
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    expect(isShown(tooltip)).toBe(true);
  });

  it('hides tooltip after the leave grace period', () => {
    enhanceTooltip(document, { showDelay: 0 });
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    trigger.dispatchEvent(new Event('mouseleave'));
    expect(isShown(tooltip)).toBe(true); // grace period pending
    vi.advanceTimersByTime(100);
    expect(isShown(tooltip)).toBe(false);
    expect(tooltip.hasAttribute('data-hl-tooltip-open')).toBe(false);
  });

  it('keeps the tooltip open while the pointer rests on it', () => {
    enhanceTooltip(document, { showDelay: 0 });
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    trigger.dispatchEvent(new Event('mouseleave'));
    tooltip.dispatchEvent(new Event('mouseenter')); // cancels the pending hide
    vi.advanceTimersByTime(500);
    expect(isShown(tooltip)).toBe(true);
  });

  it('shows tooltip on focus without delay', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('focus'));
    expect(isShown(tooltip)).toBe(true);
  });

  it('hides tooltip on Escape pressed anywhere in the document', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('focus'));
    expect(isShown(tooltip)).toBe(true);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(isShown(tooltip)).toBe(false);
  });

  it('wires role and aria-describedby from data-hl-tooltip alone', () => {
    document.body.innerHTML = `
      <button data-hl-tooltip="tip2">Trigger</button>
      <div id="tip2" hidden>Hint</div>
    `;
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tip = document.getElementById('tip2')!;
    expect(tip.getAttribute('role')).toBe('tooltip');
    expect(trigger.getAttribute('aria-describedby')).toBe('tip2');
  });

  it('exposes open state through the handle api', () => {
    const handle = enhanceTooltip(document);
    const tooltip = document.getElementById('tip1')!;

    expect(handle.api!.open).toBe(false);
    handle.api!.setOpen(true);
    expect(isShown(tooltip)).toBe(true);
    expect(handle.api!.open).toBe(true);
    handle.api!.setOpen(false);
    expect(isShown(tooltip)).toBe(false);
    expect(handle.api!.open).toBe(false);
  });

  it('notifies onOpenChange and emits hl:open-change', () => {
    const onOpenChange = vi.fn();
    const events: boolean[] = [];
    document.addEventListener('hl:open-change', (e) => {
      events.push((e as CustomEvent).detail.open);
    });
    enhanceTooltip(document, { onOpenChange });
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;

    trigger.dispatchEvent(new Event('focus'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    trigger.dispatchEvent(new Event('blur'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(events).toEqual([true, false]);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceTooltip(document)).not.toThrow();
  });
});
