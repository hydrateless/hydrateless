<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLButtonAttributes, 'popovertarget' | 'popovertargetaction'> {
    /** Id of the `<Popover>` surface this button invokes (`popovertarget`). */
    target: string;
    /** Popover action to perform. Defaults to `'toggle'`. */
    action?: 'toggle' | 'show' | 'hide';
    /** Button label. */
    children?: Snippet;
  }

  let { target, action = 'toggle', type = 'button', children, ...rest }: Props = $props();
</script>

<button
  {...rest}
  {type}
  popovertarget={target}
  popovertargetaction={action === 'toggle' ? undefined : action}
>
  {@render children?.()}
</button>
