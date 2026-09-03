<script lang="ts">
  import { enhanceDisclosure } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
    /** Plain-text header. Use the `summary` snippet for rich content. */
    title?: string;
    /** The clickable summary/trigger row; overrides `title`. */
    summary?: Snippet;
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Open the disclosure initially for uncontrolled usage. */
    defaultOpen?: boolean;
    /** Called after the disclosure opens or closes. */
    onOpenChange?: (open: boolean) => void;
    /**
     * Group name. Disclosures sharing a `name` are exclusive: the browser
     * closes the others when one opens, with no JavaScript.
     */
    name?: string;
    /** Panel content. */
    children?: Snippet;
  }

  let {
    title,
    summary,
    defaultOpen = false,
    open = $bindable(),
    onOpenChange,
    name,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;

  const disclosure = useEnhancer(enhanceDisclosure, () => ({
    defaultOpen: untrack(() => open),
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    },
  }));

  $effect(() => {
    if (open != null) disclosure.api?.setOpen(open);
  });
</script>

<details
  {...rest}
  {name}
  {open}
  class={['hl-disclosure', klass]}
  data-hl-disclosure
  {@attach disclosure.attach}
>
  <summary
    >{#if summary}{@render summary()}{:else}{title}{/if}</summary
  >
  <div class="hl-disclosure-panel">{@render children?.()}</div>
</details>
