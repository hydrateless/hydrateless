<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLFieldsetAttributes } from 'svelte/elements';

  interface Props extends HTMLFieldsetAttributes {
    legend?: Snippet;
    children?: Snippet;
  }

  let { legend, class: klass, children, ...rest }: Props = $props();
</script>

<fieldset {...rest} class={['hl-fieldset', klass]}>
  {#if legend}<legend class="hl-legend">{@render legend()}</legend>{/if}
  {@render children?.()}
</fieldset>
