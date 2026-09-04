import { defineEnhancer } from '../core/define.js';
import { Events } from '../core/events.js';
import { noop, type Disposer } from '../core/lifecycle.js';
import { afterTransition } from '../core/motion.js';

/** Options for {@link enhanceAlert}. */
export type EnhanceAlertOptions = {
  /** Show the alert on enhance. Defaults to the markup (`hidden` means closed). */
  defaultOpen?: boolean;
  /** Called after the alert is shown or dismissed. */
  onOpenChange?: (open: boolean) => void;
};

/** Imperative handle returned by {@link enhanceAlert}. */
export type AlertApi = {
  /** Whether the alert is currently shown. */
  readonly open: boolean;
  /** Show or dismiss the alert. Dismissal waits for the CSS exit transition. */
  setOpen: (open: boolean) => void;
};

/**
 * Dismissal for a `[data-hl-alert]`. A `[data-hl-dismiss]` button inside the
 * alert hides it: the enhancer marks the alert `data-hl-alert-closing` so the
 * stylesheet can play an exit transition, then sets `hidden` once it ends
 * (immediately under reduced motion). Without JavaScript the alert simply
 * stays; the button is labelled "Dismiss" if it has no accessible name. Open
 * state is observable through `onOpenChange`/`hl:open-change` and
 * controllable through the returned API. Markup can set
 * `data-hl-default-open` on the alert.
 */
export const enhanceAlert = defineEnhancer<EnhanceAlertOptions, AlertApi>({
  name: 'alert',
  selector: '[data-hl-alert]',
  defaults: {},
  attributes: { defaultOpen: 'boolean' },
  setup({ root, options, on, add, emit }) {
    const button = root.querySelector<HTMLElement>('[data-hl-dismiss]');
    if (button && !button.hasAttribute('aria-label') && !button.textContent?.trim()) {
      button.setAttribute('aria-label', 'Dismiss');
    }

    let cancel: Disposer = noop;
    add(() => cancel());

    const isOpen = () => !root.hidden && !root.hasAttribute('data-hl-alert-closing');
    const notify = (open: boolean) => {
      options.onOpenChange?.(open);
      emit(Events.openChange, { open });
    };

    const show = () => {
      cancel();
      cancel = noop;
      root.removeAttribute('data-hl-alert-closing');
      if (!root.hidden) return;
      root.hidden = false;
      notify(true);
    };
    const hide = () => {
      if (!isOpen()) return;
      root.setAttribute('data-hl-alert-closing', '');
      cancel = afterTransition(root, () => {
        root.removeAttribute('data-hl-alert-closing');
        root.hidden = true;
        notify(false);
      });
    };

    if (options.defaultOpen === true) root.hidden = false;
    else if (options.defaultOpen === false) root.hidden = true;

    if (button) on(button, 'click', hide);

    return {
      get open() {
        return isOpen();
      },
      setOpen(next) {
        if (next) show();
        else hide();
      },
    };
  },
});
