<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Dialog title; the enhancer labels the dialog with this section. */
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-modal-header', klass]}>
  {@render children?.()}
</div>
