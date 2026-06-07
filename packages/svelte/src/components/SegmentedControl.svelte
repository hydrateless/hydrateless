<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface SegmentedOption {
    label: string;
    value: string;
    disabled?: boolean;
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: string;
    options?: SegmentedOption[];
    name?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  let { value = $bindable(), options = [], name, size, class: klass, ...rest }: Props = $props();
  const generatedName = `hl-seg-${Math.random().toString(36).slice(2, 8)}`;
  const groupName = $derived(name ?? generatedName);
</script>

<div {...rest} role="radiogroup" class={['hl-segmented', klass]} data-hl-size={size}>
  {#each options as option (option.value)}
    <label class="hl-segmented-item">
      <input
        type="radio"
        name={groupName}
        value={option.value}
        checked={value === option.value}
        disabled={option.disabled}
        onchange={() => (value = option.value)}
      />
      <span>{option.label}</span>
    </label>
  {/each}
</div>
