import { getContext, setContext } from 'svelte';

export interface FieldContext {
  readonly id: string;
  readonly helpId: string;
  readonly errorId: string;
  readonly invalid: boolean;
  readonly required: boolean;
}

const FIELD_KEY = Symbol('hl-field');

export function setFieldContext(ctx: FieldContext): void {
  setContext(FIELD_KEY, ctx);
}

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

export interface RadioGroupContext {
  readonly name: string | undefined;
  readonly value: string | undefined;
  select: (value: string) => void;
}

const RADIO_GROUP_KEY = Symbol('hl-radio-group');

export function setRadioGroupContext(ctx: RadioGroupContext): void {
  setContext(RADIO_GROUP_KEY, ctx);
}

export function getRadioGroupContext(): RadioGroupContext | undefined {
  return getContext<RadioGroupContext>(RADIO_GROUP_KEY);
}
