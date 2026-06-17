import {
  combine,
  on,
  selectRoots,
  toHandle,
  type Disposer,
  type Enhancer,
  type EnhancerInstance,
} from '../core/index.js';

/** Options for {@link enhanceDisclosure}. */
export type EnhanceDisclosureOptions = {
  /** Allow more than one disclosure in the group open at a time. */
  allowMultiple?: boolean;
};

const enhanced = new WeakSet<Element>();

/**
 * Group every `details[data-hl-disclosure]` inside the container so that, by
 * default, opening one collapses the others. The container itself is the group;
 * a framework binding can scope it by passing a specific node, while the
 * auto-loader scopes it to the whole document.
 */
export const enhanceDisclosure: Enhancer<EnhanceDisclosureOptions> = (
  container = document,
  options = {},
) => {
  const { allowMultiple = false } = options;
  const items = selectRoots<HTMLDetailsElement>(container, 'details[data-hl-disclosure]').filter(
    (item) => !enhanced.has(item),
  );

  const instances: EnhancerInstance<null>[] = items.map((item) => {
    enhanced.add(item);
    const disposers: Disposer[] = [() => enhanced.delete(item)];

    if (!allowMultiple) {
      disposers.push(
        on(item, 'toggle', () => {
          if (!item.open) return;
          for (const other of items) {
            if (other !== item && other.open) other.open = false;
          }
        }),
      );
    }

    return { root: item, api: null, destroy: combine(disposers) };
  });

  return toHandle(instances);
};
