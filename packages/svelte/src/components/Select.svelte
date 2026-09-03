<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { useField } from '../context.js';

  interface Props extends Omit<HTMLSelectAttributes, 'size'> {
    /** Selected value; two-way bindable (`bind:value`). */
    value?: string;
    /** Control size. */
    size?: 'sm' | 'md' | 'lg';
    /** Mark the control invalid; also inherited from an enclosing `<Field invalid>`. */
    invalid?: boolean;
    /** `<option>`s. */
    children?: Snippet;
  }

  let {
    value = $bindable(),
    size,
    invalid = false,
    id,
    required,
    'aria-describedby': describedBy,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // Optional: wires id/aria-describedby/aria-invalid/required when inside a <Field>.
  const field = useField();
  const isInvalid = $derived(invalid || Boolean(field?.invalid));
</script>

<span class="hl-select-wrapper">
  <select
    {...rest}
    id={id ?? field?.id}
    required={required ?? (field?.required || undefined)}
    aria-describedby={describedBy ?? field?.describedBy}
    bind:value
    class={['hl-select', klass]}
    data-hl-size={size}
    data-hl-invalid={isInvalid || undefined}
    aria-invalid={isInvalid || undefined}
  >
    {@render children?.()}
  </select>
</span>
