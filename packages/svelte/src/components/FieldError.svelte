<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getFieldContext } from '../context.js';

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
  const ctx = getFieldContext();
</script>

{#if children}
  <p {...rest} id={ctx?.errorId} role="alert" class={['hl-error', klass]}>
    {@render children()}
  </p>
{/if}
