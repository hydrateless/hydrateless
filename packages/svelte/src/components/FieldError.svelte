<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getFieldContext } from '../context.js';

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    /** Validation message; nothing renders without content. */
    children?: Snippet;
  }

  let { id, class: klass, children, ...rest }: Props = $props();
  const field = getFieldContext();
</script>

{#if children}
  <p {...rest} id={id ?? field?.errorId} role="alert" class={['hl-error', klass]}>
    {@render children()}
  </p>
{/if}
