<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { getFieldContext } from '../context.js';

  interface Props extends HTMLLabelAttributes {
    /** Label text. */
    children?: Snippet;
  }

  let { for: htmlFor, class: klass, children, ...rest }: Props = $props();
  const field = getFieldContext();
</script>

<label
  {...rest}
  for={htmlFor ?? field?.id}
  class={['hl-label', klass]}
  data-hl-required={field?.required || undefined}
>
  {@render children?.()}
</label>
