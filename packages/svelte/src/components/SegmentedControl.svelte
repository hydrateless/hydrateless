<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface SegmentedOption {
    label: string;
    value: string;
    disabled?: boolean;
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Selected value; two-way bindable (`bind:value`). */
    value?: string;
    /** Initially selected value for uncontrolled usage. */
    defaultValue?: string;
    options?: SegmentedOption[];
    name?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  let {
    value = $bindable(),
    defaultValue,
    options = [],
    name,
    size,
    class: klass,
    ...rest
  }: Props = $props();
  // SSR-safe: $props.id() is stable across server and client renders.
  const generatedName = $props.id();
  const groupName = $derived(name ?? `hl-seg-${generatedName}`);
  const current = $derived(value ?? defaultValue);
</script>

<div {...rest} role="radiogroup" class={['hl-segmented', klass]} data-hl-size={size}>
  {#each options as option (option.value)}
    <label class="hl-segmented-item">
      <input
        type="radio"
        name={groupName}
        value={option.value}
        checked={current === option.value}
        disabled={option.disabled}
        onchange={() => (value = option.value)}
      />
      <span>{option.label}</span>
    </label>
  {/each}
</div>
