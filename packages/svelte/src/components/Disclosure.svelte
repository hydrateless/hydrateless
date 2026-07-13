<script lang="ts">
  import { enhanceDisclosure, type DisclosureApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDetailsElement>, 'title'> {
    /** The clickable summary/trigger row. */
    summary?: Snippet;
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Open the disclosure initially for uncontrolled usage. */
    defaultOpen?: boolean;
    /**
     * Group name. Disclosures sharing a `name` are exclusive: the browser
     * closes the others when one opens, with no JavaScript.
     */
    name?: string;
    children?: Snippet;
  }

  let {
    summary,
    defaultOpen = false,
    open = $bindable(),
    name,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;
  let el = $state<HTMLDetailsElement>();
  let api = $state<DisclosureApi | null>(null);

  $effect(() => {
    if (!el) return;
    const handle = enhanceDisclosure(el, {
      defaultOpen: untrack(() => open),
      onOpenChange: (next) => (open = next),
    });
    api = handle.api;
    return () => {
      handle.destroy();
      api = null;
    };
  });

  $effect(() => {
    if (open != null) api?.setOpen(open);
  });
</script>

<details {...rest} bind:this={el} {name} class={['hl-disclosure', klass]} data-hl-disclosure>
  <summary>{@render summary?.()}</summary>
  <div class="hl-disclosure-panel">{@render children?.()}</div>
</details>
