<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'type'> {
    value?: string | number;
  }

  let { value = $bindable(), class: klass, ...rest }: Props = $props();
</script>

<input {...rest} type="range" class={['hl-slider', klass]} bind:value />
