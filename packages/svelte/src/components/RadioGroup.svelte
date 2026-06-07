<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { setRadioGroupContext } from '../context.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: string;
    name?: string;
    children?: Snippet;
  }

  let { value = $bindable(), name, class: klass, children, ...rest }: Props = $props();

  setRadioGroupContext({
    get name() {
      return name;
    },
    get value() {
      return value;
    },
    select: (next: string) => {
      value = next;
    },
  });
</script>

<div {...rest} role="radiogroup" class={['hl-radio-group', klass]}>
  {@render children?.()}
</div>
