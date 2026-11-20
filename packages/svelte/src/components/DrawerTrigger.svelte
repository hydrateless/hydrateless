<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLButtonAttributes, 'command' | 'commandfor'> {
    /** Id of the `<Drawer>` dialog this button invokes (`commandfor`). */
    target: string;
    /** Invoker command to dispatch. Defaults to `'show-modal'`. */
    command?: 'show-modal' | 'close';
    /** Button label. */
    children?: Snippet;
  }

  let { target, command = 'show-modal', type = 'button', children, ...rest }: Props = $props();
</script>

<button {...rest} {type} {...{ command, commandfor: target }}>
  {@render children?.()}
</button>
