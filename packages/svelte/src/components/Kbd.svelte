<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<kbd {...rest} class={['hl-kbd', klass]}>
  {@render children?.()}
</kbd>
