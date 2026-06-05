import { combine, on, selectRoots, type Disposer } from '../utils/lifecycle.js';

export type EnhanceDisclosureOptions = {
  allowMultiple?: boolean;
};

const enhanced = new WeakSet<Element>();

export function enhanceDisclosure(
  container: Document | HTMLElement = document,
  options: EnhanceDisclosureOptions = {},
): Disposer {
  const { allowMultiple = false } = options;
  const disclosures = selectRoots<HTMLDetailsElement>(
    container,
    'details[data-hl-disclosure]',
  ).filter((d) => !enhanced.has(d));

  const disposers: Disposer[] = [];

  for (const d of disclosures) {
    enhanced.add(d);
    disposers.push(() => enhanced.delete(d));
  }

  if (!allowMultiple) {
    for (const disclosure of disclosures) {
      disposers.push(
        on(disclosure, 'toggle', () => {
          if (disclosure.open) {
            for (const other of disclosures) {
              if (other !== disclosure && other.open) {
                other.open = false;
              }
            }
          }
        }),
      );
    }
  }

  return combine(disposers);
}
