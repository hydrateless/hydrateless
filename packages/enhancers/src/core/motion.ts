import { getWindow } from './dom.js';
import { noop, type Disposer } from './lifecycle.js';

/** Whether the user has requested reduced motion. */
export function prefersReducedMotion(node?: Node): boolean {
  const win = node ? getWindow(node) : typeof window !== 'undefined' ? window : undefined;
  if (!win || typeof win.matchMedia !== 'function') return false;
  return win.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function parseSeconds(value: string): number {
  let total = 0;
  for (const part of value.split(',')) {
    const trimmed = part.trim();
    const ms = trimmed.endsWith('ms');
    const n = parseFloat(trimmed);
    if (!Number.isNaN(n)) total = Math.max(total, ms ? n : n * 1000);
  }
  return total;
}

/**
 * Run `done` after `el`'s CSS transition completes. Falls back to a timeout in
 * case `transitionend` never fires, and runs synchronously when the user
 * prefers reduced motion. Returns a disposer that cancels the pending callback.
 */
export function afterTransition(el: HTMLElement, done: () => void): Disposer {
  if (prefersReducedMotion(el)) {
    done();
    return noop;
  }

  const win = getWindow(el);
  const style = win.getComputedStyle(el);
  const duration = parseSeconds(style.transitionDuration) + parseSeconds(style.transitionDelay);

  if (duration <= 0) {
    done();
    return noop;
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    cleanup();
    done();
  };

  const onEnd = (e: Event) => {
    if (e.target === el) finish();
  };

  const timer = win.setTimeout(finish, duration + 50);
  el.addEventListener('transitionend', onEnd);

  function cleanup() {
    win.clearTimeout(timer);
    el.removeEventListener('transitionend', onEnd);
  }

  return cleanup;
}
