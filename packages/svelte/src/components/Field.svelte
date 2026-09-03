<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { setFieldContext } from '../context.js';
  import FieldLabel from './FieldLabel.svelte';
  import FieldHelp from './FieldHelp.svelte';
  import FieldError from './FieldError.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /**
     * Id given to the control inside the Field (the label's `for` target).
     * Generated when omitted. Help and error text derive their ids from it.
     */
    id?: string;
    /** Label text; renders a `<FieldLabel>` before the control. */
    label?: string;
    /** Help text; renders a `<FieldHelp>` after the control. */
    description?: string;
    /** Validation message; renders a `<FieldError>` and marks the field invalid. */
    error?: string;
    /** Mark the field invalid: sets `aria-invalid` on the control and reveals `<FieldError>`. */
    invalid?: boolean;
    /** Mark the field required: sets `required` on the control and flags the label. */
    required?: boolean;
    /**
     * The control, plus any `<FieldLabel>`/`<FieldHelp>`/`<FieldError>` you
     * compose yourself instead of using the shorthand props.
     */
    children?: Snippet;
  }

  let {
    id,
    label,
    description,
    error,
    invalid = false,
    required = false,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // SSR-safe: $props.id() is stable across server and client renders.
  const generatedId = $props.id();
  const baseId = $derived(id ?? `hl-field-${generatedId}`);
  const hasError = $derived(error != null && error !== '');
  const isInvalid = $derived(invalid || hasError);

  setFieldContext({
    get id() {
      return baseId;
    },
    get helpId() {
      return `${baseId}-help`;
    },
    get errorId() {
      return `${baseId}-error`;
    },
    get invalid() {
      return isInvalid;
    },
    get required() {
      return required;
    },
  });
</script>

<div
  {...rest}
  class={['hl-field', klass]}
  data-hl-invalid={isInvalid || undefined}
  data-hl-required={required || undefined}
>
  {#if label != null}<FieldLabel>{label}</FieldLabel>{/if}
  {@render children?.()}
  {#if description != null}<FieldHelp>{description}</FieldHelp>{/if}
  {#if hasError}<FieldError>{error}</FieldError>{/if}
</div>
