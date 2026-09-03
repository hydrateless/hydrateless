import { useEffect, type RefObject } from 'react';

/**
 * Push a controlled prop into an enhancer's imperative API whenever it
 * changes. Does nothing while `value` is `undefined` (uncontrolled) or before
 * the enhancer exists, so the enhancer keeps owning its own state in those
 * cases.
 */
export function useSyncApi<Api, V>(
  api: RefObject<Api | null>,
  value: V | undefined,
  sync: (api: Api, value: V) => void,
): void {
  useEffect(() => {
    if (value !== undefined && api.current) sync(api.current, value);
    // `sync` is an inline arrow; only the prop it pushes should re-run it.
  }, [value, api]);
}
