import { getDocument } from './dom.js';
import { type Disposer } from './lifecycle.js';

/**
 * Mark everything outside `active` as `inert` (and `aria-hidden`) so assistive
 * tech and the keyboard cannot reach the background while an overlay is open.
 * Walks up the ancestor chain from `active` to the body, marking each
 * element's other children. Returns a disposer that restores the prior state.
 */
export function setBackgroundInert(active: HTMLElement): Disposer {
  const doc = getDocument(active);
  const marked: HTMLElement[] = [];

  let node: HTMLElement | null = active;
  while (node && node !== doc.body) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;
    for (const child of Array.from(parent.children)) {
      if (child === node || !(child instanceof HTMLElement)) continue;
      if (child.hasAttribute('inert')) continue;
      child.setAttribute('inert', '');
      child.setAttribute('aria-hidden', 'true');
      marked.push(child);
    }
    node = parent;
  }

  return () => {
    for (const el of marked) {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    }
    marked.length = 0;
  };
}
