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
});
