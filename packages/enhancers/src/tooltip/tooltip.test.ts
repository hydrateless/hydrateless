import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceTooltip } from './index.js';

describe('enhanceTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-hl-tooltip="tip1" aria-describedby="tip1">Hover me</button>
      <div id="tip1" role="tooltip" hidden>Tooltip text</div>
    `;
  });

  it('shows tooltip on mouseenter', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    expect(tooltip.hidden).toBe(false);
  });

  it('hides tooltip on mouseleave', () => {
    enhanceTooltip(document);
    const trigger = document.querySelector<HTMLElement>('[data-hl-tooltip]')!;
    const tooltip = document.getElementById('tip1')!;

    trigger.dispatchEvent(new Event('mouseenter'));
    trigger.dispatchEvent(new Event('mouseleave'));
    expect(tooltip.hasAttribute('hidden')).toBe(true);
  });

  it('shows tooltip on focus', () => {
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

    trigger.dispatchEvent(new Event('mouseenter'));
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tooltip.hasAttribute('hidden')).toBe(true);
  });

  it('handles no matching elements', () => {
    document.body.innerHTML = '<div>Nothing</div>';
    expect(() => enhanceTooltip(document)).not.toThrow();
  });
});
