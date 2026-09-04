import {
  defineEnhancer,
  resolveContainer,
  toHandle,
  type Enhancer,
  type EnhancerHandle,
} from '../core/define.js';
import { noop, on as listen, combine, type Disposer } from '../core/lifecycle.js';
import { Events } from '../core/events.js';

/**
 * Semantic intent of a toast, matching the `data-hl-intent` vocabulary shared
 * by alerts, badges, and buttons. `danger` toasts are announced assertively.
 */
export type ToastIntent = 'info' | 'success' | 'warning' | 'danger';

/** Options for an individual toast shown through {@link ToastApi}. */
export type ToastOptions = {
  /** Auto-dismiss delay in ms. `0` keeps the toast until it's dismissed. */
  duration?: number;
  /** Semantic intent of the toast; sets `data-hl-intent` and, for `danger`, `role="alert"`. */
  intent?: ToastIntent;
};

/** Options for {@link enhanceToast}. */
export type EnhanceToastOptions = {
  /** Default auto-dismiss duration in ms for toasts without an explicit one. */
  duration?: number;
  /** Called after a toast appears (`open: true`) or is dismissed (`open: false`). */
  onOpenChange?: (open: boolean, toast: HTMLElement) => void;
};

/**
 * Imperative handle returned by {@link enhanceToast}. Toasts are transient
 * and many can be shown at once, so unlike the other overlays this API is
 * `show`/`dismiss` rather than `open`/`setOpen`; each toast still reports
 * through `onOpenChange`/`hl:open-change`.
 */
export type ToastApi = {
  /** Show a toast with `message` and return its element. */
  show: (message: string, options?: ToastOptions) => HTMLElement;
  /** Dismiss a toast element previously returned by `show` (or server-rendered). */
  dismiss: (toast: HTMLElement) => void;
  /** Dismiss every toast currently in the region. */
  dismissAll: () => void;
};

const REGION = '[data-hl-toast-region]';
const TRIGGER = '[data-hl-toast-trigger]';

/** Live APIs per enhanced region, so later callers adopt the existing instance. */
const apis = new WeakMap<HTMLElement, ToastApi>();

const base = defineEnhancer<EnhanceToastOptions, ToastApi>({
  name: 'toast',
  selector: REGION,
  defaults: { duration: 5000 },
  attributes: { duration: 'number' },
  setup({ root, container, options, on, add, emit }) {
    const region = root;
    const doc = region.ownerDocument;

    if (!region.hasAttribute('role')) region.setAttribute('role', 'status');
    if (!region.hasAttribute('aria-live')) region.setAttribute('aria-live', 'polite');
    if (!region.hasAttribute('aria-relevant')) region.setAttribute('aria-relevant', 'additions');

    // Per-toast timers and listeners, released when that toast goes away (so
    // a long-lived region doesn't accumulate handlers for dismissed toasts).
    const cleanups = new Map<HTMLElement, Disposer>();
    add(() => {
      for (const cleanup of cleanups.values()) cleanup();
      cleanups.clear();
    });

    const notify = (open: boolean, toast: HTMLElement) => {
      options.onOpenChange?.(open, toast);
      emit(Events.openChange, { open, toast });
    };

    const dismiss = (toast: HTMLElement) => {
      cleanups.get(toast)?.();
      cleanups.delete(toast);
      if (!toast.parentElement) return;
      toast.remove();
      notify(false, toast);
    };

    const dismissAll = () => {
      for (const toast of Array.from(region.querySelectorAll<HTMLElement>('[data-hl-toast]'))) {
        dismiss(toast);
      }
    };

    const show = (message: string, toastOptions: ToastOptions = {}): HTMLElement => {
      const { duration = options.duration!, intent } = toastOptions;

      const toast = doc.createElement('div');
      toast.setAttribute('data-hl-toast', '');
      if (intent) toast.setAttribute('data-hl-intent', intent);
      // Errors interrupt (assertive); everything else waits its turn in the
      // polite region.
      if (intent === 'danger') toast.setAttribute('role', 'alert');

      const text = doc.createElement('span');
      text.className = 'hl-toast-message';
      text.textContent = message;
      toast.appendChild(text);

      const closeBtn = doc.createElement('button');
      closeBtn.type = 'button';
      closeBtn.setAttribute('data-hl-toast-close', '');
      closeBtn.setAttribute('aria-label', 'Dismiss');
      closeBtn.textContent = '\u00D7';
      toast.appendChild(closeBtn);

      region.appendChild(toast);
      notify(true, toast);

      if (duration > 0) {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const stop = () => {
          if (timer !== undefined) clearTimeout(timer);
          timer = undefined;
        };
        const start = () => {
          stop();
          timer = setTimeout(() => dismiss(toast), duration);
        };
        start();
        // Pause while the pointer or keyboard focus is on the toast (WCAG
        // 2.2.1), so the close button can be reached before it disappears.
        cleanups.set(
          toast,
          combine([
            stop,
            listen(toast, 'mouseenter', stop),
            listen(toast, 'mouseleave', start),
            listen(toast, 'focusin', stop),
            listen(toast, 'focusout', start),
          ]),
        );
      }

      return toast;
    };

    // One delegated listener covers close buttons on server-rendered toasts
    // and every future toast, with no per-element wiring.
    on(region, 'click', (e) => {
      const closeBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-hl-toast-close]');
      const toast = closeBtn?.closest<HTMLElement>('[data-hl-toast]');
      if (toast) dismiss(toast);
    });

    // Declarative triggers are delegated at the container level so buttons
    // added after enhancement (SPA navigations, fetched fragments) just work.
    // Only the container's first region wires this, so a page with several
    // regions doesn't show duplicate toasts.
    const firstRegion =
      container instanceof Element && container.matches(REGION)
        ? container
        : container.querySelector(REGION);
    if (firstRegion === region) {
      on(container, 'click', (e) => {
        const trigger = (e.target as HTMLElement).closest<HTMLElement>(TRIGGER);
        if (!trigger) return;
        const message = trigger.getAttribute('data-hl-toast-trigger') || '';
        const duration = Number(trigger.getAttribute('data-hl-toast-duration')) || undefined;
        const intent = (trigger.getAttribute('data-hl-toast-intent') as ToastIntent) || undefined;
        show(message, { duration, intent });
      });
    }

    const api: ToastApi = { show, dismiss, dismissAll };
    apis.set(region, api);
    add(() => apis.delete(region));
    return api;
  },
});

function adoptOrCreate(
  containerArg?: Document | HTMLElement,
  options: EnhanceToastOptions = {},
): EnhancerHandle<ToastApi> {
  const container = resolveContainer(containerArg);
  if (!container) return toHandle([]);

  // The region is the component root; create one if the page has none so the
  // imperative API always has somewhere to render.
  const exists =
    (container instanceof Element && container.matches(REGION)) || container.querySelector(REGION);
  if (!exists) {
    const host = container instanceof Document ? container.body : container;
    const region = host.ownerDocument.createElement('div');
    region.setAttribute('data-hl-toast-region', '');
    host.appendChild(region);
  }

  const handle = base(container, options);
  if (handle.api) return handle;

  // The region was already enhanced (e.g. by the auto-loader); hand back its
  // live API with a no-op destroy so the adopter can't tear down the owner.
  const region =
    container instanceof Element && container.matches(REGION)
      ? container
      : container.querySelector<HTMLElement>(REGION);
  const existing = region ? apis.get(region) : undefined;
  if (existing) return toHandle([{ root: region!, api: existing, destroy: noop }]);
  return handle;
}

/**
 * Adopt (or create) a polite live region and expose an imperative API for
 * showing and dismissing toasts. Declarative `[data-hl-toast-trigger]` buttons
 * are handled through event delegation, so triggers added later need no
 * re-enhancement. Hovering or focusing a toast pauses its auto-dismiss timer,
 * `danger` toasts are announced assertively, and every show/dismiss is
 * observable through `onOpenChange`/`hl:open-change`. Outside a browser this
 * is a safe no-op that returns an empty handle. Markup can set
 * `data-hl-duration` on the region.
 */
export const enhanceToast: Enhancer<EnhanceToastOptions, ToastApi> = Object.assign(adoptOrCreate, {
  definition: base.definition,
});
