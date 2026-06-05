import { combine, on, type Disposer } from '../core/index.js';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export type ToastOptions = {
  duration?: number;
  variant?: ToastVariant;
};

export type ToastApi = {
  show: (message: string, options?: ToastOptions) => HTMLElement;
  dismiss: (toast: HTMLElement) => void;
  destroy: Disposer;
};

const enhanced = new WeakSet<Element>();

/**
 * Create (or adopt) a polite live region and return an imperative API for
 * showing/dismissing toasts. Declarative `[data-hl-toast-trigger]` buttons are
 * wired automatically. Hovering a toast pauses its auto-dismiss timer.
 */
export function enhanceToast(container: Document | HTMLElement = document): ToastApi {
  const root = container === document ? document.body : (container as HTMLElement);
  let region = root.querySelector<HTMLElement>('[data-hl-toast-region]');

  if (!region) {
    region = document.createElement('div');
    region.setAttribute('data-hl-toast-region', '');
    root.appendChild(region);
  }

  if (!region.hasAttribute('role')) region.setAttribute('role', 'status');
  if (!region.hasAttribute('aria-live')) region.setAttribute('aria-live', 'polite');
  if (!region.hasAttribute('aria-relevant')) region.setAttribute('aria-relevant', 'additions');

  const timers = new Set<ReturnType<typeof setTimeout>>();
  const disposers: Disposer[] = [];

  function dismiss(toast: HTMLElement): void {
    toast.remove();
  }

  function show(message: string, options: ToastOptions = {}): HTMLElement {
    const { duration = 5000, variant } = options;

    const toast = document.createElement('div');
    toast.setAttribute('data-hl-toast', '');
    if (variant) toast.setAttribute('data-hl-variant', variant);

    const text = document.createElement('span');
    text.className = 'hl-toast-message';
    text.textContent = message;
    toast.appendChild(text);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('data-hl-toast-close', '');
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', () => dismiss(toast));
    toast.appendChild(closeBtn);

    region!.appendChild(toast);

    if (duration > 0) {
      let timer: ReturnType<typeof setTimeout>;
      const start = () => {
        timer = setTimeout(() => {
          timers.delete(timer);
          if (toast.parentElement) dismiss(toast);
        }, duration);
        timers.add(timer);
      };
      const stop = () => {
        clearTimeout(timer);
        timers.delete(timer);
      };
      start();
      toast.addEventListener('mouseenter', stop);
      toast.addEventListener('mouseleave', start);
    }

    return toast;
  }

  const existingCloseButtons = Array.from(
    region.querySelectorAll<HTMLElement>('[data-hl-toast-close]'),
  );
  for (const btn of existingCloseButtons) {
    if (enhanced.has(btn)) continue;
    const toast = btn.closest<HTMLElement>('[data-hl-toast]');
    if (toast) {
      enhanced.add(btn);
      disposers.push(() => enhanced.delete(btn));
      disposers.push(on(btn, 'click', () => dismiss(toast)));
    }
  }

  const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-hl-toast-trigger]'));
  for (const trigger of triggers) {
    if (enhanced.has(trigger)) continue;
    enhanced.add(trigger);
    disposers.push(() => enhanced.delete(trigger));
    const message = trigger.getAttribute('data-hl-toast-trigger') || '';
    const duration = Number(trigger.getAttribute('data-hl-toast-duration')) || 5000;
    const variant = (trigger.getAttribute('data-hl-toast-variant') as ToastVariant) || undefined;
    disposers.push(on(trigger, 'click', () => show(message, { duration, variant })));
  }

  const destroy: Disposer = () => {
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    combine(disposers)();
  };

  return { show, dismiss, destroy };
}
