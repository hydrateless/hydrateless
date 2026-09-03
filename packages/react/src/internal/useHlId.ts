import { useId } from 'react';

/**
 * A DOM-safe generated id with a readable prefix, unless the caller supplied
 * one. React's `useId` output contains characters that are awkward in CSS
 * selectors and `data-*` references, so they're stripped.
 */
export function useHlId(prefix: string, id?: string): string {
  const generated = useId();
  return id ?? `hl-${prefix}-${generated.replace(/[^\w-]/g, '')}`;
}
