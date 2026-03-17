import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { enhanceToast } from './index.js';

describe('enhanceToast', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div data-hl-toast-region></div>';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns show and dismiss functions', () => {
    const api = enhanceToast(document);
    expect(typeof api.show).toBe('function');
    expect(typeof api.dismiss).toBe('function');
  });

  it('sets ARIA attributes on region', () => {
    enhanceToast(document);
    const region = document.querySelector('[data-hl-toast-region]')!;
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-relevant')).toBe('additions');
  });

  it('creates a toast element on show', () => {
    const api = enhanceToast(document);
    api.show('Hello world', { duration: 0 });

    const toast = document.querySelector('[data-hl-toast]');
    expect(toast).not.toBeNull();
    expect(toast!.textContent).toContain('Hello world');
  });

  it('includes a close button with aria-label', () => {
    const api = enhanceToast(document);
    api.show('Test', { duration: 0 });

    const closeBtn = document.querySelector('[data-hl-toast-close]');
    expect(closeBtn).not.toBeNull();
    expect(closeBtn!.getAttribute('aria-label')).toBe('Dismiss');
  });

  it('auto-dismisses after duration', () => {
    const api = enhanceToast(document);
    api.show('Temporary', { duration: 3000 });
    expect(document.querySelector('[data-hl-toast]')).not.toBeNull();

    vi.advanceTimersByTime(3000);
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('dismisses on close button click', () => {
    const api = enhanceToast(document);
    api.show('Closeable', { duration: 0 });

    const closeBtn = document.querySelector<HTMLElement>('[data-hl-toast-close]')!;
    closeBtn.click();
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('programmatic dismiss removes the toast', () => {
    const api = enhanceToast(document);
    const toast = api.show('Remove me', { duration: 0 });
    expect(document.querySelector('[data-hl-toast]')).not.toBeNull();

    api.dismiss(toast);
    expect(document.querySelector('[data-hl-toast]')).toBeNull();
  });

  it('creates region if none exists', () => {
    document.body.innerHTML = '';
    enhanceToast(document);

    const region = document.querySelector('[data-hl-toast-region]');
    expect(region).not.toBeNull();
  });

  it('stacks multiple toasts', () => {
    const api = enhanceToast(document);
    api.show('First', { duration: 0 });
    api.show('Second', { duration: 0 });

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
