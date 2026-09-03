<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Add hover/focus affordances for a clickable card. */
    interactive?: boolean;
    /** Card sections: `<CardHeader>`, `<CardBody>`, `<CardFooter>`. */
    children?: Snippet;
  }

  let { interactive = false, class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-card', klass]} data-hl-interactive={interactive || undefined}>
  {@render children?.()}
</div>
