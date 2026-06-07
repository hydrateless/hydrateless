<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked'> {
    checked?: boolean;
    children?: Snippet;
  }

  let { checked = $bindable(), class: klass, children, ...rest }: Props = $props();
</script>

<label class={['hl-checkbox', klass]}>
  <input {...rest} type="checkbox" bind:checked />
  {#if children}<span>{@render children()}</span>{/if}
</label>
