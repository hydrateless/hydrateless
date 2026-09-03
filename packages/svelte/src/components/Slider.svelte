<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { useField } from '../context.js';

  interface Props extends Omit<HTMLInputAttributes, 'type'> {
    /** Current value; two-way bindable (`bind:value`). */
    value?: string | number;
  }

  let {
    value = $bindable(),
    id,
    required,
    'aria-describedby': describedBy,
    'aria-invalid': ariaInvalid,
    class: klass,
    ...rest
  }: Props = $props();
  // Optional: wires id/aria-describedby/aria-invalid/required when inside a <Field>.
  const field = useField();
</script>

<input
  {...rest}
  id={id ?? field?.id}
  required={required ?? (field?.required || undefined)}
  aria-describedby={describedBy ?? field?.describedBy}
  aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
  type="range"
  class={['hl-slider', klass]}
  bind:value
/>
