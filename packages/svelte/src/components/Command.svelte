<script lang="ts">
  import { enhanceCommand } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /** Filter query; two-way bindable (`bind:query`). */
    query?: string;
    /** Initial filter query for uncontrolled usage. */
    defaultQuery?: string;
    /** Called with the filter query after every change. */
    onQueryChange?: (query: string) => void;
    /** Called with the chosen item's value when a command runs. */
    onCommand?: (value: string, item: HTMLElement) => void;
    /** Lowercased key that opens the hosting `<dialog>` with Cmd/Ctrl. */
    hotkey?: string;
    /** A `<CommandInput>`, a `<CommandList>`, and optionally a `<CommandEmpty>`. */
    children?: Snippet;
  }

  let {
    query = $bindable(),
    defaultQuery,
    onQueryChange,
    onCommand,
    hotkey,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (query === undefined) query = defaultQuery;
  let syncTick = $state(0);

  const command = useEnhancer(enhanceCommand, () => ({
    hotkey,
    defaultValue: untrack(() => query),
    onValueChange: (next) => {
      query = next;
      onQueryChange?.(next);
      syncTick += 1;
    },
    onCommand: (value, item) => onCommand?.(value, item),
  }));

  $effect(() => {
    void syncTick;
    if (query != null && command.api && command.api.value !== query) {
      command.api.setValue(query, { silent: true });
    }
  });
</script>

<div
  {...rest}
  class={['hl-command', klass]}
  data-hl-command
  data-hl-hotkey={hotkey}
  {@attach command.attach}
>
  {@render children?.()}
</div>
