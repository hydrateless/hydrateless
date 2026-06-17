import { getDocument } from './dom.js';
import { on, type Disposer } from './lifecycle.js';

/** Options for {@link onClickOutside}. */
export type ClickOutsideOptions = {
  /** Event used to detect the outside interaction. Defaults to `pointerdown`. */
  event?: 'pointerdown' | 'mousedown' | 'click';
  /** Additional elements that should be treated as "inside" (e.g. a trigger). */
  ignore?: Array<Element | null | undefined>;
};

/**
 * Call `handler` when a pointer interaction lands outside `el` (and any
 * `ignore`d elements). Listens in the capture phase so it still fires when
 * inner handlers stop propagation.
 */
export function onClickOutside(
  el: Element,
  handler: (event: Event) => void,
  options: ClickOutsideOptions = {},
): Disposer {
  const { event = 'pointerdown', ignore = [] } = options;
  const doc = getDocument(el);
  return on(
    doc,
    event,
    (e) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (el.contains(target)) return;
      for (const node of ignore) {
        if (node && node.contains(target)) return;
      }
      handler(e);
    },
    true,
  );
}

/** Call `handler` when Escape is pressed on `target` (defaults to the document). */
export function onEscape(
  handler: (event: KeyboardEvent) => void,
  target: EventTarget = document,
): Disposer {
  return on<KeyboardEvent>(target, 'keydown', (e) => {
    if (e.key === 'Escape') handler(e);
  });
}
