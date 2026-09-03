<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface SegmentedOption {
    /** Visible label. */
    label: string;
    /** Value reported when the segment is selected. */
    value: string;
    /** Render the segment disabled. */
    disabled?: boolean;
  }

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /** Segments to render, in order. */
    options?: SegmentedOption[];
    /** Selected value; two-way bindable (`bind:value`). */
    value?: string;
    /** Initially selected value for uncontrolled usage. Defaults to the first option. */
    defaultValue?: string;
    /** Called with the new value after every selection change. */
    onValueChange?: (value: string) => void;
    /** Shared `name` of the underlying radios; generated when omitted. */
    name?: string;
    /** Control size. */
    size?: 'sm' | 'md' | 'lg';
  }

  let {
    options = [],
    value = $bindable(),
    defaultValue,
    onValueChange,
    name,
    size,
    class: klass,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (value === undefined) value = defaultValue ?? options[0]?.value;
  // SSR-safe: $props.id() is stable across server and client renders.
  const generatedId = $props.id();
  const groupName = `hl-seg-${generatedId}`;

  function select(next: string) {
    value = next;
    onValueChange?.(next);
  }
</script>

<div {...rest} role="radiogroup" class={['hl-segmented', klass]} data-hl-size={size}>
  {#each options as option (option.value)}
    <label class="hl-segmented-item">
      <input
        type="radio"
        name={name ?? groupName}
        value={option.value}
        checked={value === option.value}
        disabled={option.disabled}
        onchange={() => select(option.value)}
      />
      <span>{option.label}</span>
    </label>
  {/each}
</div>
