<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Header content, typically a `<CardTitle>` and `<CardDescription>`. */
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-card-header', klass]}>
  {@render children?.()}
</div>
