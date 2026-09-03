<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { setRadioGroupContext } from '../context.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /** Selected value; two-way bindable (`bind:value`). */
    value?: string;
    /** Initially selected value for uncontrolled usage. */
    defaultValue?: string;
    /** Called with the new value after every selection change. */
    onValueChange?: (value: string) => void;
    /** Shared `name` of the radios; generated when omitted. */
    name?: string;
    /** Layout direction. */
    orientation?: 'horizontal' | 'vertical';
    /** `<Radio>`s. */
    children?: Snippet;
  }

  let {
    value = $bindable(),
    defaultValue,
    onValueChange,
    name,
    orientation,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (value === undefined) value = defaultValue;
  // SSR-safe: $props.id() is stable across server and client renders.
  const generatedId = $props.id();
  const groupName = `hl-radio-${generatedId}`;

  setRadioGroupContext({
    get name() {
      return name ?? groupName;
    },
    get value() {
      return value;
    },
    select: (next: string) => {
      value = next;
      onValueChange?.(next);
    },
  });
</script>

<div
  {...rest}
  role="radiogroup"
  class={['hl-radio-group', klass]}
  data-hl-orientation={orientation}
  aria-orientation={orientation}
>
  {@render children?.()}
</div>
