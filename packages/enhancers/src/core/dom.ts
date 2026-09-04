import { uid } from './lifecycle.js';

/** True when running in a browser-like environment with a DOM. */
export const isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined';

/**
 * Resolve a reference attribute that may be either a bare id (`panel-1`) or a
 * hash selector (`#panel-1`) to an element within `scope`.
 */
export function resolveRef<T extends HTMLElement = HTMLElement>(
  scope: ParentNode,
  ref: string | null | undefined,
): T | null {
  if (!ref) return null;
  const id = ref.startsWith('#') ? ref.slice(1) : ref;
  if (!id) return null;
  return scope.querySelector<T>(`#${CSS.escape(id)}`);
}

/** Ensure an element has an id, assigning a generated one if necessary. */
export function ensureId(el: Element, prefix = 'hl'): string {
  if (!el.id) el.id = uid(prefix);
  return el.id;
}

type AttrValue = string | number | boolean | null | undefined;

/**
 * Set or remove a batch of attributes. `true` sets a boolean attribute,
 * `false`/`null`/`undefined` removes it, everything else is stringified.
 */
export function setAttrs(el: Element, attrs: Record<string, AttrValue>): void {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) {
      el.removeAttribute(name);
    } else if (value === true) {
      el.setAttribute(name, '');
    } else {
      el.setAttribute(name, String(value));
    }
  }
}

/**
 * Whether `el` lays out right-to-left, from the nearest `dir` attribute or,
 * failing that, its computed `direction`. Enhancers use this to map logical
 * `start`/`end` (placements, arrow keys) onto physical sides.
 */
export function isRtl(el: Element): boolean {
  const dir = el.closest('[dir]')?.getAttribute('dir');
  if (dir) return dir.toLowerCase() === 'rtl';
  const view = el.ownerDocument.defaultView;
  return view?.getComputedStyle(el).direction === 'rtl';
}

/** The owning document of a node, falling back to the global `document`. */
export function getDocument(node: Node | null | undefined): Document {
  return node?.ownerDocument ?? document;
}

/** The default view (window) of a node, falling back to the global `window`. */
export function getWindow(node: Node | null | undefined): Window {
  return getDocument(node).defaultView ?? window;
}
