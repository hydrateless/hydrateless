<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { useField } from '../context.js';

  interface Props extends Omit<HTMLInputAttributes, 'size'> {
    /** Current value; two-way bindable (`bind:value`). */
    value?: string | number;
    /** Control size. */
    size?: 'sm' | 'md' | 'lg';
    /** Mark the control invalid; also inherited from an enclosing `<Field invalid>`. */
    invalid?: boolean;
  }

  let {
    value = $bindable(),
    size,
    invalid = false,
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

<input
  {...rest}
  id={id ?? field?.id}
  required={required ?? (field?.required || undefined)}
  aria-describedby={describedBy ?? field?.describedBy}
  bind:value
  class={['hl-input', klass]}
  data-hl-size={size}
  data-hl-invalid={isInvalid || undefined}
  aria-invalid={isInvalid || undefined}
/>
