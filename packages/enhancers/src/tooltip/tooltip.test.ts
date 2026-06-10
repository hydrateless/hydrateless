import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { enhanceTooltip } from './index.js';

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

  it('shows tooltip after the hover delay', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    expect(tooltip.hidden).toBe(true); // not yet — delay pending
    vi.advanceTimersByTime(150);
    expect(tooltip.hidden).toBe(false);
  });

  it('shows immediately when showDelay is 0', () => {
    enhanceTooltip(document, { showDelay: 0 });
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    expect(tooltip.hidden).toBe(false);
  });

  it('hides tooltip after the leave grace period', () => {
    enhanceTooltip(document, { showDelay: 0 });
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    trigger.dispatchEvent(new Event('mouseleave'));
    expect(tooltip.hidden).toBe(false); // grace period pending
    vi.advanceTimersByTime(100);
    expect(tooltip.hasAttribute('hidden')).toBe(true);
  });

  it('keeps the tooltip open while the pointer rests on it', () => {
    enhanceTooltip(document, { showDelay: 0 });
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    trigger.dispatchEvent(new Event('mouseleave'));
    tooltip.dispatchEvent(new Event('mouseenter')); // cancels the pending hide
    vi.advanceTimersByTime(500);
    expect(tooltip.hidden).toBe(false);
  });

  it('shows tooltip on focus without delay', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('focus'));
    expect(tooltip.hidden).toBe(false);
  });

  it('hides tooltip on Escape key', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('focus'));
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tooltip.hasAttribute('hidden')).toBe(true);
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

  it('exposes show/hide through the handle api', () => {
    const handle = enhanceTooltip(document);
    const tooltip = document.getElementById('tip1')!;

    handle.api!.show();
    expect(tooltip.hidden).toBe(false);
    handle.api!.hide();
    expect(tooltip.hidden).toBe(true);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceTooltip(document)).not.toThrow();
  });
});
