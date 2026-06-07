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

<p {...rest} id={ctx?.helpId} class={['hl-help', klass]}>
  {@render children?.()}
</p>
