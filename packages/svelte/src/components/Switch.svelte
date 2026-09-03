<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { useField } from '../context.js';

  interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked' | 'role'> {
    /** On/off state; two-way bindable (`bind:checked`). */
    checked?: boolean;
    /** Label text rendered next to the switch. */
    children?: Snippet;
  }

  let {
    checked = $bindable(),
    id,
    required,
    'aria-describedby': describedBy,
    'aria-invalid': ariaInvalid,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // Optional: wires id/aria-describedby/aria-invalid/required when inside a <Field>.
  const field = useField();
</script>

<label data-hl-switch class={klass}>
  <input
    {...rest}
    id={id ?? field?.id}
    required={required ?? (field?.required || undefined)}
    aria-describedby={describedBy ?? field?.describedBy}
    aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
    type="checkbox"
    role="switch"
    bind:checked
  />
  {@render children?.()}
</label>
