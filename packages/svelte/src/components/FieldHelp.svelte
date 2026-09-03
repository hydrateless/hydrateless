<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getFieldContext } from '../context.js';

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    /** Supplementary help text, referenced by the control's `aria-describedby`. */
    children?: Snippet;
  }

  let { id, class: klass, children, ...rest }: Props = $props();
  const field = getFieldContext();
</script>

<p {...rest} id={id ?? field?.helpId} class={['hl-help', klass]}>
  {@render children?.()}
</p>
