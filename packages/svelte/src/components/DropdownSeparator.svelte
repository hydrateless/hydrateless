<script lang="ts">
  import type { HTMLLiAttributes } from 'svelte/elements';

  /** Visual divider between groups of menu items. */
  let { class: klass, ...rest }: Omit<HTMLLiAttributes, 'role'> = $props();
</script>

<li {...rest} role="separator" class={['hl-dropdown-separator', klass]}></li>
