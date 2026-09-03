import { useCallback, useState } from 'react';
import { useLatest } from './useLatest.js';

/**
 * State that works both ways: uncontrolled (`controlled` is `undefined`, the
 * hook owns the value starting from `defaultValue`) or controlled (the parent's
 * `controlled` prop wins). `setValue` is stable across renders, so it can be
 * handed to an enhancer once; it updates the internal value only when
 * uncontrolled and always notifies `onChange`.
 */
export function useControlled<T>(
  controlled: T | undefined,
  defaultValue: T | undefined,
  onChange?: (value: T) => void,
): [T | undefined, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = useLatest(controlled !== undefined);
  const onChangeRef = useLatest(onChange);

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled.current) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled, onChangeRef],
  );

  return [controlled !== undefined ? controlled : internal, setValue];
}
