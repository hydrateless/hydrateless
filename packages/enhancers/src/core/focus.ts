import { getDocument, getWindow } from './dom.js';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(el: HTMLElement): boolean {
  const win = getWindow(el);
  const style = win.getComputedStyle(el);
  if (style.visibility === 'hidden' || style.display === 'none') return false;
  if (el.hasAttribute('inert') || el.closest('[inert]')) return false;
  const rect = el.getBoundingClientRect();
  // jsdom reports 0×0 for everything; treat that as visible so tests can run.
  if (rect.width === 0 && rect.height === 0 && win.navigator.userAgent.includes('jsdom')) {
    return true;
  }
  return rect.width > 0 || rect.height > 0 || el === getDocument(el).activeElement;
}

/** All tabbable descendants of `container`, in document order. */
export function tabbablesIn(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return candidates.filter((el) => !el.hasAttribute('disabled') && isVisible(el));
}

/** Handle for a focus trap created by {@link createFocusTrap}. */
export type FocusTrap = {
  activate: () => void;
  deactivate: () => void;
};

/**
 * Trap Tab/Shift+Tab focus within `container` and restore focus to the
 * previously active element on deactivate. Uses capture-phase listeners so it
 * works even when inner widgets stop propagation.
 */
export function createFocusTrap(container: HTMLElement): FocusTrap {
  const doc = getDocument(container);
  let previousActive: Element | null = null;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const tabbables = tabbablesIn(container);
    if (tabbables.length === 0) {
      e.preventDefault();
      return;
    }
    const first = tabbables[0];
    const last = tabbables[tabbables.length - 1];
    const active = doc.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (!active || active === first || !container.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (!active || active === last || !container.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  };

  const onFocusIn = (e: FocusEvent) => {
    if (!container.contains(e.target as Node)) {
      const tabbables = tabbablesIn(container);
      if (tabbables.length) tabbables[0].focus();
    }
  };

  return {
    activate() {
      previousActive = doc.activeElement;
      doc.addEventListener('keydown', onKeyDown, true);
      doc.addEventListener('focusin', onFocusIn, true);
      const tabbables = tabbablesIn(container);
      (tabbables[0] ?? container).focus();
    },
    deactivate() {
      doc.removeEventListener('keydown', onKeyDown, true);
      doc.removeEventListener('focusin', onFocusIn, true);
      if (previousActive instanceof HTMLElement) previousActive.focus();
      previousActive = null;
    },
  };
}
