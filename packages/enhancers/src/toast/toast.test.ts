import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { enhanceToast } from './index.js';

function api(...args: Parameters<typeof enhanceToast>) {
  return enhanceToast(...args).api!;
}

describe('enhanceToast', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div data-hl-toast-region></div>';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exposes show and dismiss through the handle api', () => {
    const toast = api(document);
    expect(typeof toast.show).toBe('function');
    expect(typeof toast.dismiss).toBe('function');
  });

  it('dismissAll clears every toast and reports each one', () => {
    const seen: boolean[] = [];
    const toast = api(document, { onOpenChange: (open) => seen.push(open) });
    toast.show('One');
    toast.show('Two');
    toast.dismissAll();
    expect(document.querySelectorAll('[data-hl-toast]')).toHaveLength(0);
    expect(seen).toEqual([true, true, false, false]);
  });

  it('reads the default duration from data-hl-duration on the region', () => {
    document.body.innerHTML = '<div data-hl-toast-region data-hl-duration="1000"></div>';
    api(document).show('Quick');
    vi.advanceTimersByTime(999);
    expect(document.querySelectorAll('[data-hl-toast]')).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(document.querySelectorAll('[data-hl-toast]')).toHaveLength(0);
  });

  it('stops a dismissed toast from firing its timer later', () => {
    const seen: boolean[] = [];
    const toast = api(document, { onOpenChange: (open) => seen.push(open) });
    const el = toast.show('Bye', { duration: 500 });
    toast.dismiss(el);
    vi.advanceTimersByTime(1000);
    expect(seen).toEqual([true, false]);
  });

  it('sets ARIA attributes on region', () => {
    enhanceToast(document);
    const region = document.querySelector('[data-hl-toast-region]')!;
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-relevant')).toBe('additions');
  });

  it('creates a toast element on show', () => {
    const toast = api(document);
    toast.show('Hello world', { duration: 0 });

    const el = document.querySelector('[data-hl-toast]');
    expect(el).not.toBeNull();
    expect(el!.textContent).toContain('Hello world');
  });

  it('includes a close button with aria-label', () => {
    const toast = api(document);
    toast.show('Test', { duration: 0 });

    const closeBtn = document.querySelector('[data-hl-toast-close]');
    expect(closeBtn).not.toBeNull();
    expect(closeBtn!.getAttribute('aria-label')).toBe('Dismiss');
  });

  it('auto-dismisses after duration', () => {
    const toast = api(document);
    toast.show('Temporary', { duration: 3000 });
    expect(document.querySelector('[data-hl-toast]')).not.toBeNull();

    vi.advanceTimersByTime(3000);
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('dismisses on close button click', () => {
    const toast = api(document);
    toast.show('Closeable', { duration: 0 });

    const closeBtn = document.querySelector<HTMLElement>('[data-hl-toast-close]')!;
    closeBtn.click();
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('programmatic dismiss removes the toast', () => {
    const toast = api(document);
    const el = toast.show('Remove me', { duration: 0 });
    expect(document.querySelector('[data-hl-toast]')).not.toBeNull();

    toast.dismiss(el);
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('sets data-hl-intent and announces danger toasts assertively', () => {
    const toast = api(document);
    const info = toast.show('Saved', { duration: 0, intent: 'success' });
    const danger = toast.show('Failed', { duration: 0, intent: 'danger' });
    expect(info.getAttribute('data-hl-intent')).toBe('success');
    expect(info.hasAttribute('role')).toBe(false);
    expect(danger.getAttribute('data-hl-intent')).toBe('danger');
    expect(danger.getAttribute('role')).toBe('alert');
  });

  it('pauses auto-dismiss while hovered or focused', () => {
    const toast = api(document);
    const el = toast.show('Wait', { duration: 1000 });
    el.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(5000);
    expect(document.querySelector('[data-hl-toast]')).not.toBeNull();
    el.dispatchEvent(new Event('mouseleave'));
    el.dispatchEvent(new Event('focusin'));
    vi.advanceTimersByTime(5000);
    expect(document.querySelector('[data-hl-toast]')).not.toBeNull();
    el.dispatchEvent(new Event('focusout'));
    vi.advanceTimersByTime(1000);
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('reads the intent from declarative triggers', () => {
    document.body.innerHTML = `
      <div data-hl-toast-region></div>
      <button data-hl-toast-trigger="Oops" data-hl-toast-intent="danger">Show</button>
    `;
    enhanceToast(document);
    document.querySelector<HTMLElement>('[data-hl-toast-trigger]')!.click();
    expect(document.querySelector('[data-hl-toast]')!.getAttribute('data-hl-intent')).toBe(
      'danger',
    );
  });

  it('creates region if none exists', () => {
    document.body.innerHTML = '';
    enhanceToast(document);

    const region = document.querySelector('[data-hl-toast-region]');
    expect(region).not.toBeNull();
  });

  it('stacks multiple toasts', () => {
    const toast = api(document);
    toast.show('First', { duration: 0 });
    toast.show('Second', { duration: 0 });

    const toasts = document.querySelectorAll('[data-hl-toast]');
    expect(toasts.length).toBe(2);
  });

  it('wires up declarative trigger buttons', () => {
    document.body.innerHTML = `
      <div data-hl-toast-region></div>
      <button data-hl-toast-trigger="Triggered!">Show toast</button>
    `;
    enhanceToast(document);

    const trigger = document.querySelector<HTMLElement>('[data-hl-toast-trigger]')!;
    trigger.click();

    const toast = document.querySelector('[data-hl-toast]');
    expect(toast).not.toBeNull();
    expect(toast!.textContent).toContain('Triggered!');
  });

  it('handles triggers added after enhancement through delegation', () => {
    enhanceToast(document);

    const trigger = document.createElement('button');
    trigger.setAttribute('data-hl-toast-trigger', 'Late');
    document.body.appendChild(trigger);
    trigger.click();

    const toast = document.querySelector('[data-hl-toast]');
    expect(toast).not.toBeNull();
    expect(toast!.textContent).toContain('Late');
  });

  it('notifies onOpenChange and emits hl:open-change on show and dismiss', () => {
    const onOpenChange = vi.fn();
    const events: Array<{ open: boolean }> = [];
    document.addEventListener('hl:open-change', (e) => {
      events.push((e as CustomEvent).detail);
    });
    const toast = api(document, { onOpenChange });

    const el = toast.show('Hello', { duration: 0 });
    expect(onOpenChange).toHaveBeenCalledWith(true, el);
    toast.dismiss(el);
    expect(onOpenChange).toHaveBeenCalledWith(false, el);
    expect(events.map((d) => d.open)).toEqual([true, false]);
  });

  it('adopts the existing instance instead of double-enhancing', () => {
    const first = enhanceToast(document);
    const second = enhanceToast(document);

    expect(second.api).not.toBeNull();
    second.api!.show('From the adopter', { duration: 0 });
    expect(document.querySelectorAll('[data-hl-toast-region]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-hl-toast]')).toHaveLength(1);

    // The adopter's destroy must not tear down the owning instance.
    second.destroy();
    first.api!.show('Still alive', { duration: 0 });
    expect(document.querySelectorAll('[data-hl-toast]')).toHaveLength(2);
  });
});
