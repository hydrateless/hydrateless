import { getContext, setContext } from 'svelte';

/** Shared field state a Field provides to its controls (ids and validity flags). */
export interface FieldContext {
  readonly id: string;
  readonly helpId: string;
  readonly errorId: string;
  readonly invalid: boolean;
  readonly required: boolean;
}

const FIELD_KEY = Symbol('hl-field');

/** Publish {@link FieldContext} to the descendant controls of a Field. */
export function setFieldContext(ctx: FieldContext): void {
  setContext(FIELD_KEY, ctx);
}

/** Read the nearest {@link FieldContext}, or `undefined` outside a Field. */
export function getFieldContext(): FieldContext | undefined {
  return getContext<FieldContext>(FIELD_KEY);
}

/** Returns attributes (`id`, `aria-describedby`, `aria-invalid`) for a field control. */
export function fieldBindings(): Record<string, string | boolean | undefined> {
  const ctx = getFieldContext();
  if (!ctx) return {};
  const describedBy = [ctx.helpId, ctx.invalid ? ctx.errorId : null].filter(Boolean).join(' ');
  return {
    id: ctx.id,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': ctx.invalid || undefined,
  };
}

/** Shared state a RadioGroup provides to its radios (name, selected value, and a setter). */
export interface RadioGroupContext {
  readonly name: string | undefined;
  readonly value: string | undefined;
  select: (value: string) => void;
}

const RADIO_GROUP_KEY = Symbol('hl-radio-group');

/** Publish {@link RadioGroupContext} to the descendant radios of a group. */
export function setRadioGroupContext(ctx: RadioGroupContext): void {
  setContext(RADIO_GROUP_KEY, ctx);
}

/** Read the nearest {@link RadioGroupContext}, or `undefined` outside a group. */
export function getRadioGroupContext(): RadioGroupContext | undefined {
  return getContext<RadioGroupContext>(RADIO_GROUP_KEY);
}
