import { tabbablesIn } from './tabbable';

export type FocusTrap = {
  activate: () => void;
  deactivate: () => void;
};

export function createFocusTrap(container: HTMLElement): FocusTrap {
  let previousActive: Element | null = null;
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const tabbables = tabbablesIn(container);
    if (tabbables.length === 0) return;
    const first = tabbables[0];
    const last = tabbables[tabbables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (!active || active === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (!active || active === last) {
        e.preventDefault();
        first.focus();
      }
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
      previousActive = document.activeElement;
      document.addEventListener('keydown', onKeyDown, true);
      document.addEventListener('focusin', onFocusIn, true);
      const tabbables = tabbablesIn(container);
      if (tabbables.length) tabbables[0].focus();
    },
    deactivate() {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn, true);
      if (previousActive instanceof HTMLElement) previousActive.focus();
      previousActive = null;
    }
  };
}
