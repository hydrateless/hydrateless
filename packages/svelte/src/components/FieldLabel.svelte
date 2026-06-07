<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { getFieldContext } from '../context.js';

  interface Props extends HTMLLabelAttributes {
    children?: Snippet;
  }

  let { for: htmlFor, class: klass, children, ...rest }: Props = $props();
  const ctx = getFieldContext();
</script>

<label
  {...rest}
  for={htmlFor ?? ctx?.id}
  class={['hl-label', klass]}
  data-hl-required={ctx?.required || undefined}
>
  {@render children?.()}
</label>
