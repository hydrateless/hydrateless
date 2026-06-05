import { isBrowser } from './dom.js';
import { noop, type Disposer } from './lifecycle.js';

type Saved = { overflow: string; paddingRight: string };

const state = new WeakMap<HTMLBodyElement, { count: number; saved: Saved }>();

/**
 * Prevent the document body from scrolling while an overlay is open, padding
 * for the scrollbar width so the page does not shift. Reference-counted, so
 * nested overlays compose and the original styles are only restored once the
 * last lock is released. Returns a disposer that releases this lock.
 */
export function lockScroll(doc: Document = isBrowser ? document : (undefined as never)): Disposer {
  if (!isBrowser || !doc?.body) return noop;
  const body = doc.body as HTMLBodyElement;
  const win = doc.defaultView ?? window;

  let entry = state.get(body);
  if (!entry) {
    const scrollbar = win.innerWidth - doc.documentElement.clientWidth;
    entry = {
      count: 0,
      saved: { overflow: body.style.overflow, paddingRight: body.style.paddingRight },
    };
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    state.set(body, entry);
  }
  entry.count += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    const current = state.get(body);
    if (!current) return;
    current.count -= 1;
    if (current.count <= 0) {
      body.style.overflow = current.saved.overflow;
      body.style.paddingRight = current.saved.paddingRight;
      state.delete(body);
    }
  };
}
