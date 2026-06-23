/**
 * Minimal jsdom polyfill for the modern platform features Hydrateless builds on:
 * the Popover API, HTML Invoker Commands (`command`/`commandfor`,
 * `popovertarget`), and `<dialog>` open/close with `toggle` events.
 *
 * jsdom implements none of these yet, so without this shim the enhancers'
 * native code paths can't run under Vitest. Real-browser semantics (light
 * dismiss, top-layer stacking, focus order) are verified by the Playwright
 * suite; this only emulates enough for the JS the enhancers still own (ARIA
 * wiring, keyboard navigation, event emission, imperative open/close).
 */

const OPEN = new WeakSet();

function fireToggle(el, open) {
  const event = new Event('toggle');
  event.oldState = open ? 'closed' : 'open';
  event.newState = open ? 'open' : 'closed';
  el.dispatchEvent(event);
}

if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
  const proto = HTMLElement.prototype;

  if (!('popover' in proto)) {
    Object.defineProperty(proto, 'popover', {
      configurable: true,
      get() {
        return this.hasAttribute('popover') ? this.getAttribute('popover') || 'auto' : null;
      },
      set(value) {
        if (value == null) this.removeAttribute('popover');
        else this.setAttribute('popover', value);
      },
    });
  }

  if (typeof proto.showPopover !== 'function') {
    proto.showPopover = function showPopover() {
      if (OPEN.has(this)) return;
      OPEN.add(this);
      this.removeAttribute('hidden');
      // jsdom's UA stylesheet keeps `[popover]` at `display: none` until it
      // matches `:popover-open`, which jsdom's selector engine can't evaluate.
      // Mirror the top-layer state inline so computed style (and therefore
      // accessibility/visibility queries) match a real, open popover.
      this.style.display = 'block';
      fireToggle(this, true);
    };
    proto.hidePopover = function hidePopover() {
      if (!OPEN.has(this)) return;
      OPEN.delete(this);
      this.style.removeProperty('display');
      fireToggle(this, false);
    };
    proto.togglePopover = function togglePopover(force) {
      const next = force === undefined ? !OPEN.has(this) : Boolean(force);
      if (next) this.showPopover();
      else this.hidePopover();
      return next;
    };
  }

  const realMatches = Element.prototype.matches;
  Element.prototype.matches = function matches(selector) {
    if (selector === ':popover-open') return OPEN.has(this);
    return realMatches.call(this, selector);
  };

  const dialogProto = window.HTMLDialogElement && window.HTMLDialogElement.prototype;
  if (dialogProto && typeof dialogProto.showModal !== 'function') {
    // jsdom reflects the `open` attribute onto the property, so toggling the
    // attribute is enough to drive `dialog.open`.
    const setOpen = (el, value) => {
      if (value) el.setAttribute('open', '');
      else el.removeAttribute('open');
    };
    dialogProto.showModal = function showModal() {
      if (this.open) return;
      setOpen(this, true);
      OPEN.add(this);
      fireToggle(this, true);
    };
    dialogProto.show = dialogProto.showModal;
    dialogProto.close = function close(returnValue) {
      if (!this.open) return;
      setOpen(this, false);
      OPEN.delete(this);
      if (returnValue !== undefined) this.returnValue = returnValue;
      this.dispatchEvent(new Event('close'));
      fireToggle(this, false);
    };
    dialogProto.requestClose = function requestClose(returnValue) {
      const cancel = new Event('cancel', { cancelable: true });
      if (this.dispatchEvent(cancel)) this.close(returnValue);
    };
  }

  if (window.HTMLButtonElement && !('popoverTargetElement' in window.HTMLButtonElement.prototype)) {
    Object.defineProperty(window.HTMLButtonElement.prototype, 'popoverTargetElement', {
      configurable: true,
      get() {
        const id = this.getAttribute('popovertarget');
        return id ? this.ownerDocument.getElementById(id) : null;
      },
    });
  }

  // A real engine performs invoker actions on activation; emulate that at the
  // document level so `button.click()` drives the target the way a browser does.
  window.document.addEventListener('click', (event) => {
    const target = event.target;
    const button =
      target && target.closest ? target.closest('button[popovertarget], button[commandfor]') : null;
    if (!button) return;
    const doc = button.ownerDocument;

    const popovertarget = button.getAttribute('popovertarget');
    if (popovertarget) {
      const el = doc.getElementById(popovertarget);
      if (!el) return;
      const action = button.getAttribute('popovertargetaction') || 'toggle';
      if (action === 'show') el.showPopover();
      else if (action === 'hide') el.hidePopover();
      else el.togglePopover();
      return;
    }

    const commandfor = button.getAttribute('commandfor');
    const command = button.getAttribute('command');
    if (!commandfor || !command) return;
    const el = doc.getElementById(commandfor);
    if (!el) return;
    switch (command) {
      case 'show-modal':
        el.showModal?.();
        break;
      case 'close':
        el.close?.();
        break;
      case 'request-close':
        if (el.requestClose) el.requestClose();
        else el.close?.();
        break;
      case 'show-popover':
        el.showPopover();
        break;
      case 'hide-popover':
        el.hidePopover();
        break;
      case 'toggle-popover':
        el.togglePopover();
        break;
      default:
        break;
    }
  });
}
