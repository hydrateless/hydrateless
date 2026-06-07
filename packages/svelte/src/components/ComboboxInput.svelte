<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    styled?: boolean;
  }

  let { styled = true, class: klass, ...rest }: Props = $props();
</script>

<input {...rest} class={[styled && 'hl-input', klass]} />
