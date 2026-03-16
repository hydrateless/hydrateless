export type EnhanceDisclosureOptions = {
  allowMultiple?: boolean;
};

export function enhanceDisclosure(
  container: Document | HTMLElement = document,
  options: EnhanceDisclosureOptions = {},
): void {
  const { allowMultiple = false } = options;
  const disclosures = Array.from(
    container.querySelectorAll<HTMLDetailsElement>('details[data-hl-disclosure]'),
  );

  if (disclosures.length === 0) return;

  if (!allowMultiple) {
    disclosures.forEach((disclosure) => {
      disclosure.addEventListener('toggle', () => {
        if (disclosure.open) {
          for (const other of disclosures) {
            if (other !== disclosure && other.open) {
              other.open = false;
            }
          }
        }
      });
    });
  }
}
