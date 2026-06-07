import {
  createContext,
  useContext,
  useId,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';

interface FieldContextValue {
  id: string;
  helpId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
  hasHelp: boolean;
  hasError: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
  invalid?: boolean;
  required?: boolean;
}

/**
 * Layout + accessibility wrapper for a form control. Provides a shared id so
 * `<FieldLabel>`, `<FieldHelp>`, and `<FieldError>` wire up
 * `htmlFor`/`aria-describedby` automatically; spread {@link useField}'s result
 * onto your control.
 */
export function Field({
  id,
  invalid = false,
  required = false,
  className,
  children,
  ...rest
}: FieldProps) {
  const generated = useId().replace(/:/g, '');
  const baseId = id ?? `hl-field-${generated}`;
  const value: FieldContextValue = {
    id: baseId,
    helpId: `${baseId}-help`,
    errorId: `${baseId}-error`,
    invalid,
    required,
    hasHelp: true,
    hasError: invalid,
  };

  return (
    <FieldContext.Provider value={value}>
      <div
        {...rest}
        className={['hl-field', className].filter(Boolean).join(' ')}
        data-hl-invalid={invalid || undefined}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

function useFieldContext(component: string): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) throw new Error(`<${component}> must be used within a <Field>`);
  return ctx;
}

/**
 * Props to spread onto the field's control (`id`, `aria-describedby`,
 * `aria-invalid`). Must be called within a {@link Field}.
 */
export function useField() {
  const ctx = useFieldContext('useField');
  const describedBy = [ctx.hasHelp ? ctx.helpId : null, ctx.invalid ? ctx.errorId : null]
    .filter(Boolean)
    .join(' ');
  return {
    id: ctx.id,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': ctx.invalid || undefined,
  };
}

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** Label bound to the enclosing field's control via `htmlFor`. */
export function FieldLabel({ className, children, ...rest }: FieldLabelProps) {
  const ctx = useFieldContext('FieldLabel');
  return (
    <label
      {...rest}
      htmlFor={rest.htmlFor ?? ctx.id}
      className={['hl-label', className].filter(Boolean).join(' ')}
      data-hl-required={ctx.required || undefined}
    >
      {children}
    </label>
  );
}

/** Supplementary help text, referenced by the control's `aria-describedby`. */
export function FieldHelp({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const ctx = useFieldContext('FieldHelp');
  return (
    <p {...rest} id={ctx.helpId} className={['hl-help', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  );
}

/** Validation message; renders nothing unless given content. */
export function FieldError({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const ctx = useFieldContext('FieldError');
  if (children == null || children === false) return null;
  return (
    <p
      {...rest}
      id={ctx.errorId}
      role="alert"
      className={['hl-error', className].filter(Boolean).join(' ')}
    >
      {children}
    </p>
  );
}

export interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
}

/** Grouped fields with an optional legend. */
export function Fieldset({ legend, className, children, ...rest }: FieldsetProps) {
  return (
    <fieldset {...rest} className={['hl-fieldset', className].filter(Boolean).join(' ')}>
      {legend != null && <legend className="hl-legend">{legend}</legend>}
      {children}
    </fieldset>
  );
}
