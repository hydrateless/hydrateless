<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { useField } from '../context.js';

  interface Props extends HTMLTextareaAttributes {
    /** Current value; two-way bindable (`bind:value`). */
    value?: string;
    /** Control size. */
    size?: 'sm' | 'md' | 'lg';
    /** Mark the control invalid; also inherited from an enclosing `<Field invalid>`. */
    invalid?: boolean;
    /** Grow with the content (`field-sizing: content`). */
    autosize?: boolean;
  }

  let {
    value = $bindable(),
    size,
    invalid = false,
    autosize = false,
    id,
    required,
    'aria-describedby': describedBy,
    class: klass,
    ...rest
  }: Props = $props();
  // Optional: wires id/aria-describedby/aria-invalid/required when inside a <Field>.
  const field = useField();
  const isInvalid = $derived(invalid || Boolean(field?.invalid));
</script>

<textarea
  {...rest}
  id={id ?? field?.id}
  required={required ?? (field?.required || undefined)}
  aria-describedby={describedBy ?? field?.describedBy}
  bind:value
  class={['hl-textarea', klass]}
  data-hl-size={size}
  data-hl-autosize={autosize || undefined}
  data-hl-invalid={isInvalid || undefined}
  aria-invalid={isInvalid || undefined}
></textarea>
