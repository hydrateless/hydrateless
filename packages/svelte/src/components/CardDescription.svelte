<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<p {...rest} class={['hl-card-description', klass]}>
  {@render children?.()}
</p>
