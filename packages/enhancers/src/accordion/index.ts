import { combine, on, selectRoots, type Disposer } from '../utils/lifecycle.js';

export type EnhanceAccordionOptions = {
  allowMultiple?: boolean;
};

const enhanced = new WeakSet<Element>();

export function enhanceAccordion(
  container: Document | HTMLElement = document,
  options: EnhanceAccordionOptions = {},
): Disposer {
  const { allowMultiple = false } = options;
  const groups = selectRoots(container, '[data-hl-accordion]');
  const disposers: Disposer[] = [];

  for (const group of groups) {
    if (enhanced.has(group)) continue;
    const disclosures = Array.from(group.querySelectorAll<HTMLDetailsElement>('details'));
    if (disclosures.length === 0) continue;

    enhanced.add(group);
    disposers.push(() => enhanced.delete(group));

    if (!allowMultiple) {
      for (const d of disclosures) {
        disposers.push(
          on(d, 'toggle', () => {
            if (d.open) {
              for (const other of disclosures) {
                if (other !== d && other.open) other.open = false;
              }
            }
          }),
        );
      }
    }
  }

  return combine(disposers);
}
