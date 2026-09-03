import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from './util.js';
import { useHlId } from './internal/useHlId.js';

interface FieldContextValue {
  id: string;
  helpId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** What {@link useField} hands to a custom control inside a {@link Field}. */
export interface FieldControl {
  /** The id the field's label points at; put it on the control. */
  id: string;
  /** Space-separated ids for `aria-describedby`, or `undefined` when there's nothing to reference. */
  describedBy: string | undefined;
  /** Whether the field is currently in an error state. */
  invalid: boolean;
  /** Whether the field is required. */
  required: boolean;
}

/**
 * Read the enclosing {@link Field}'s wiring for a custom control, or `null`
 * outside a Field. The built-in controls (Input, Textarea, Select, Checkbox,
 * Switch, Slider, ComboboxInput) call this themselves.
 *
 * ```tsx
 * const field = useField();
 * <input id={field?.id} aria-describedby={field?.describedBy} aria-invalid={field?.invalid || undefined} />
 * ```
 */
export function useField(): FieldControl | null {
  const ctx = useContext(FieldContext);
  if (!ctx) return null;
  const describedBy = [ctx.helpId, ctx.invalid ? ctx.errorId : null].filter(Boolean).join(' ');
  return {
    id: ctx.id,
    describedBy: describedBy || undefined,
    invalid: ctx.invalid,
    required: ctx.required,
  };
}

/** Props for {@link Field}. */
export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Label text; renders a {@link FieldLabel} before the control. */
  label?: ReactNode;
  /** Help text; renders a {@link FieldHelp} after the control. */
  description?: ReactNode;
  /** Validation message; renders a {@link FieldError} and marks the field invalid. */
  error?: ReactNode;
  /** Force the error state without a message. */
  invalid?: boolean;
  required?: boolean;
}

/**
 * Layout + accessibility wrapper for a form control. Provides a shared id so
 * the label, help text, and error message wire up `htmlFor` and
 * `aria-describedby` automatically, and the built-in controls pick up `id`,
 * `aria-describedby`, `aria-invalid`, and `required` from it with no extra
 * props. Pass `label`/`description`/`error` for the common layout, or compose
 * `<FieldLabel>`, `<FieldHelp>`, and `<FieldError>` yourself.
 *
 * ```tsx
 * <Field label="Email" description="We never share it." error={errors.email}>
 *   <Input type="email" />
 * </Field>
 * ```
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    id,
    label,
    description,
    error,
    invalid = false,
    required = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const baseId = useHlId('field');
  const hasError = error != null && error !== false;
  const value: FieldContextValue = {
    id: baseId,
    helpId: `${baseId}-help`,
    errorId: `${baseId}-error`,
    invalid: invalid || hasError,
    required,
  };

  return (
    <FieldContext.Provider value={value}>
      <div
        {...rest}
        ref={ref}
        id={id}
        className={cx('hl-field', className)}
        data-hl-invalid={value.invalid || undefined}
      >
        {label != null && <FieldLabel>{label}</FieldLabel>}
        {children}
        {description != null && <FieldHelp>{description}</FieldHelp>}
        {hasError && <FieldError>{error}</FieldError>}
      </div>
    </FieldContext.Provider>
  );
});

/** Props for {@link FieldLabel}. */
export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** Label bound to the enclosing field's control via `htmlFor`. */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, children, ...rest },
  ref,
) {
  const ctx = useContext(FieldContext);
  return (
    <label
      {...rest}
      ref={ref}
      htmlFor={rest.htmlFor ?? ctx?.id}
      className={cx('hl-label', className)}
      data-hl-required={ctx?.required || undefined}
    >
      {children}
    </label>
  );
});

/** Props for {@link FieldHelp}. */
export type FieldHelpProps = HTMLAttributes<HTMLParagraphElement>;

/** Supplementary help text, referenced by the control's `aria-describedby`. */
export const FieldHelp = forwardRef<HTMLParagraphElement, FieldHelpProps>(function FieldHelp(
  { className, children, ...rest },
  ref,
) {
  const ctx = useContext(FieldContext);
  return (
    <p {...rest} ref={ref} id={rest.id ?? ctx?.helpId} className={cx('hl-help', className)}>
      {children}
    </p>
  );
});

/** Props for {@link FieldError}. */
export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

/** Validation message; renders nothing unless given content. */
export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(function FieldError(
  { className, children, ...rest },
  ref,
) {
  const ctx = useContext(FieldContext);
  if (children == null || children === false) return null;
  return (
    <p
      {...rest}
      ref={ref}
      id={rest.id ?? ctx?.errorId}
      role="alert"
      className={cx('hl-error', className)}
    >
      {children}
    </p>
  );
});

/** Props for {@link Fieldset}. */
export interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
}

/** Grouped fields with an optional legend. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, className, children, ...rest },
  ref,
) {
  return (
    <fieldset {...rest} ref={ref} className={cx('hl-fieldset', className)}>
      {legend != null && <legend className="hl-legend">{legend}</legend>}
      {children}
    </fieldset>
  );
});
