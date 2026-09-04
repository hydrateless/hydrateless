import { describe, it, expect, beforeEach } from 'vitest';
import { enhanceAlert } from './index.js';

describe('enhanceAlert', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="hl-alert" role="alert" data-hl-alert>
        <div class="hl-alert-body">Saved.</div>
        <button type="button" data-hl-dismiss></button>
      </div>
    `;
  });

  const alert = () => document.querySelector<HTMLElement>('[data-hl-alert]')!;
  const button = () => document.querySelector<HTMLElement>('[data-hl-dismiss]')!;

  it('labels an unlabelled dismiss button', () => {
    enhanceAlert(document);
    expect(button().getAttribute('aria-label')).toBe('Dismiss');
  });

  it('hides the alert on dismiss and reports open changes', () => {
    const seen: boolean[] = [];
    const events: boolean[] = [];
    document.addEventListener('hl:open-change', (e) => events.push((e as CustomEvent).detail.open));
    const api = enhanceAlert(document, { onOpenChange: (open) => seen.push(open) }).api!;
    expect(api.open).toBe(true);
    button().click();
    // jsdom has no transitions, so the alert hides synchronously.
    expect(alert().hidden).toBe(true);
    expect(api.open).toBe(false);
    api.setOpen(true);
    expect(alert().hidden).toBe(false);
    expect(seen).toEqual([false, true]);
    expect(events).toEqual([false, true]);
  });

  it('honors data-hl-default-open="false"', () => {
    alert().setAttribute('data-hl-default-open', 'false');
    const api = enhanceAlert(document).api!;
    expect(alert().hidden).toBe(true);
    expect(api.open).toBe(false);
  });
});
