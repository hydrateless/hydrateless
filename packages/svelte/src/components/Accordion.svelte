<script lang="ts">
  import { enhanceAccordion } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { setAccordionContext } from '../context.js';
  import { createRegistry } from '../registry.svelte.js';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Allow more than one panel to stay open at a time. */
    allowMultiple?: boolean;
    /** Open item values; two-way bindable (`bind:value`). */
    value?: string[];
    /** Initially open item values for uncontrolled usage. */
    defaultValue?: string[];
    /** Called with the open item values after every change. */
    onValueChange?: (value: string[]) => void;
    /** One or more `<AccordionItem>`s. */
    children?: Snippet;
  }

  let {
    allowMultiple = false,
    value = $bindable(),
    defaultValue,
    onValueChange,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (value === undefined) value = defaultValue ?? [];

  // Items register in document order so each `<details>` can render `open`
  // on the server from the shared value; indexes stay live for `{#each}`.
  const items = createRegistry();
  setAccordionContext({
    get value() {
      return value ?? [];
    },
    registerItem: () => items.register(),
  });

  const accordion = useEnhancer(enhanceAccordion, () => ({
    allowMultiple,
    defaultValue: untrack(() => value),
    onValueChange: (next) => {
      value = next;
      onValueChange?.(next);
    },
  }));

  $effect(() => {
    if (value != null) accordion.api?.setValue(value);
  });
</script>

<div {...rest} data-hl-accordion {@attach accordion.attach}>
  {@render children?.()}
</div>
