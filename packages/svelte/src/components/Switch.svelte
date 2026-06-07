<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked' | 'role'> {
    checked?: boolean;
    children?: Snippet;
  }

  let { checked = $bindable(), class: klass, children, ...rest }: Props = $props();
</script>

<label data-hl-switch class={klass}>
  <input {...rest} type="checkbox" role="switch" bind:checked />
  {@render children?.()}
</label>
