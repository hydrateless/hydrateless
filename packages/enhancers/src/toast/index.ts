import { combine, on, type Disposer } from '../utils/lifecycle.js';

export type ToastOptions = {
  duration?: number;
};

export type ToastApi = {
  show: (message: string, options?: ToastOptions) => HTMLElement;
  dismiss: (toast: HTMLElement) => void;
  destroy: Disposer;
};

const enhanced = new WeakSet<Element>();

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
    disposers.push(on(trigger, 'click', () => show(message, { duration })));
  }

  function dismiss(toast: HTMLElement): void {
    toast.remove();
  }

  function show(message: string, options: ToastOptions = {}): HTMLElement {
    const { duration = 5000 } = options;

    const toast = document.createElement('div');
    toast.setAttribute('data-hl-toast', '');

    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('data-hl-toast-close', '');
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', () => dismiss(toast));
    toast.appendChild(closeBtn);

    region!.appendChild(toast);

    if (duration > 0) {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (toast.parentElement) dismiss(toast);
      }, duration);
      timers.add(timer);
    }

    return toast;
  }

  const destroy: Disposer = () => {
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    combine(disposers)();
  };

  return { show, dismiss, destroy };
}
