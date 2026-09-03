import type { AriaAttributes } from 'react';
import { useField } from '../Field.js';

/** The subset of control props a {@link Field} can fill in. */
export interface FieldControlProps {
  id?: string;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: AriaAttributes['aria-invalid'];
}

/**
 * Merge a control's own props with the enclosing Field's wiring. Explicit props
 * win, so a control can still opt out of any single attribute. Outside a Field
 * the props come back untouched.
 */
export function useFieldControl<P extends FieldControlProps>(props: P, invalid?: boolean): P {
  const field = useField();
  const isInvalid = invalid || props['aria-invalid'] || field?.invalid || undefined;
  return {
    ...props,
    id: props.id ?? field?.id,
    required: props.required ?? field?.required,
    'aria-describedby': props['aria-describedby'] ?? field?.describedBy,
    'aria-invalid': isInvalid,
  };
}
