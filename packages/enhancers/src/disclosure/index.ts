import { combine, on, selectRoots, type Disposer, type Enhancer } from '../core/index.js';

export type EnhanceDisclosureOptions = {
  /** Allow more than one disclosure in the group open at a time. */
  allowMultiple?: boolean;
};

const enhanced = new WeakSet<Element>();

/**
 * Group every `details[data-hl-disclosure]` inside the container so that, by
 * default, opening one collapses the others. The container itself is the group
 * — a framework binding can scope it by passing a specific node, while the
 * auto-loader scopes it to the whole document.
 */
export const enhanceDisclosure: Enhancer<EnhanceDisclosureOptions> = (
  container = document,
  options = {},
): Disposer => {
  const { allowMultiple = false } = options;
  const items = selectRoots<HTMLDetailsElement>(container, 'details[data-hl-disclosure]').filter(
    (item) => !enhanced.has(item),
  );

  const disposers: Disposer[] = [];
  for (const item of items) {
    enhanced.add(item);
    disposers.push(() => enhanced.delete(item));
  }

  if (!allowMultiple) {
    for (const item of items) {
      disposers.push(
        on(item, 'toggle', () => {
          if (!item.open) return;
          for (const other of items) {
            if (other !== item && other.open) other.open = false;
          }
        }),
      );
    }
  }

  return combine(disposers);
};
