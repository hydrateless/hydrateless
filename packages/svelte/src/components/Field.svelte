<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { setFieldContext } from '../context.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    id?: string;
    invalid?: boolean;
    required?: boolean;
    children?: Snippet;
  }

  let { id, invalid = false, required = false, class: klass, children, ...rest }: Props = $props();
  const generatedId = `hl-field-${Math.random().toString(36).slice(2, 8)}`;
  const baseId = $derived(id ?? generatedId);

  setFieldContext({
    get id() {
      return baseId;
    },
    get helpId() {
      return `${baseId}-help`;
    },
    get errorId() {
      return `${baseId}-error`;
    },
    get invalid() {
      return invalid;
    },
    get required() {
      return required;
    },
  });
</script>

<div {...rest} class={['hl-field', klass]} data-hl-invalid={invalid || undefined}>
  {@render children?.()}
</div>
