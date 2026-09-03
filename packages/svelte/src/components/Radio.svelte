<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { getRadioGroupContext } from '../context.js';

  interface Props extends Omit<HTMLInputAttributes, 'type' | 'value'> {
    /** Value reported to the enclosing `<RadioGroup>` when selected. */
    value: string;
    /** Label text rendered next to the radio. */
    children?: Snippet;
  }

  let { value, name, class: klass, children, ...rest }: Props = $props();
  const group = getRadioGroupContext();
</script>

<label class={['hl-radio', klass]}>
  <input
    {...rest}
    type="radio"
    name={name ?? group?.name}
    {value}
    checked={group ? group.value === value : undefined}
    onchange={() => group?.select(value)}
  />
  {#if children}<span>{@render children()}</span>{/if}
</label>
