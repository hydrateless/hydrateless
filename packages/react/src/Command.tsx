import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { enhanceCommand } from '@hydrateless/enhancers';

export interface CommandItemDef {
  value: string;
  label: ReactNode;
  keywords?: string;
  group?: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  items: CommandItemDef[];
  placeholder?: string;
  emptyLabel?: ReactNode;
  /** Lowercased key that opens the palette's dialog with Cmd/Ctrl. */
  hotkey?: string;
  onSelect?: (value: string) => void;
}

function groupItems(items: CommandItemDef[]): Array<[string, CommandItemDef[]]> {
  const groups = new Map<string, CommandItemDef[]>();
  for (const item of items) {
    const key = item.group ?? '';
    const bucket = groups.get(key) ?? [];
    bucket.push(item);
    groups.set(key, bucket);
  }
  return [...groups.entries()];
}

/**
 * Command palette. The enhancer filters items (text + keywords), provides arrow
 * navigation and an empty state, and runs the active item on Enter; `onSelect`
 * receives the chosen item's value. Place inside a `<dialog>` to use `hotkey`.
 */
export function Command({
  items,
  placeholder = 'Type a command…',
  emptyLabel = 'No results found.',
  hotkey,
  onSelect,
  ...rest
}: CommandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dispose = enhanceCommand(el);
    const handler = (e: Event) => {
      const { value, item } = (e as CustomEvent).detail as { value: string; item: HTMLElement };
      const def = items.find((entry) => entry.value === (item.dataset.hlValue ?? value));
      def?.onSelect?.();
      onSelectRef.current?.(def?.value ?? value);
    };
    el.addEventListener('hl:command', handler);
    return () => {
      el.removeEventListener('hl:command', handler);
      dispose();
    };
  }, [items]);

  return (
    <div {...rest} ref={ref} data-hl-command data-hl-command-hotkey={hotkey}>
      <input className="hl-input" data-hl-command-input placeholder={placeholder} />
      <div data-hl-command-empty hidden>
        {emptyLabel}
      </div>
      <div data-hl-command-list role="listbox">
        {groupItems(items).map(([group, groupEntries]) => (
          <div data-hl-command-group key={group || '_'}>
            {group && (
              <div className="hl-command-group-label" role="presentation">
                {group}
              </div>
            )}
            {groupEntries.map((item) => (
              <div
                role="option"
                data-hl-value={item.value}
                data-hl-keywords={item.keywords}
                key={item.value}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
