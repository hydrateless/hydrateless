export type EnhanceAccordionOptions = {
  allowMultiple?: boolean;
};

export function enhanceAccordion(
  container: Document | HTMLElement = document,
  options: EnhanceAccordionOptions = {}
): void {
  const { allowMultiple = false } = options;
  const groups = Array.from(container.querySelectorAll<HTMLElement>('[data-hl-accordion]'));
  for (const group of groups) {
    const disclosures = Array.from(group.querySelectorAll<HTMLDetailsElement>('details'));
    if (disclosures.length === 0) continue;
    if (!allowMultiple) {
      disclosures.forEach((d) => {
        d.addEventListener('toggle', () => {
          if (d.open) {
            for (const other of disclosures) if (other !== d && other.open) other.open = false;
          }
        });
      });
    }
  }
}
