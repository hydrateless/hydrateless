<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    interactive?: boolean;
    children?: Snippet;
  }

  let { interactive = false, class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-card', klass]} data-hl-interactive={interactive || undefined}>
  {@render children?.()}
</div>
