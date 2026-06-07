<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLHeadingElement> {
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<h3 {...rest} class={['hl-card-title', klass]}>
  {@render children?.()}
</h3>
