import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { enhanceCommand } from '@hydrateless/enhancers';
import { cx } from './util.js';

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Lowercased key that opens the palette's dialog with Cmd/Ctrl. */
  hotkey?: string;
  /** Fires with the chosen item's value when a command runs. */
  onSelect?: (value: string) => void;
}

/**
 * Command palette. Compose with `<CommandInput>`, `<CommandList>`,
 * `<CommandGroup>`, `<CommandItem>`, and `<CommandEmpty>`. The enhancer filters
 * items (text + keywords), provides arrow navigation and an empty state, and
 * runs the active item on Enter. Place inside a `<dialog>` to use `hotkey`.
 */
export function Command({ hotkey, onSelect, children, ...rest }: CommandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dispose = enhanceCommand(el, { hotkey });
    const handler = (e: Event) => {
      const { value } = (e as CustomEvent).detail as { value: string };
      onSelectRef.current?.(value);
    };
    el.addEventListener('hl:command', handler);
    return () => {
      el.removeEventListener('hl:command', handler);
      dispose();
    };
  }, [hotkey]);

  return (
    <div {...rest} ref={ref} data-hl-command data-hl-command-hotkey={hotkey}>
      {children}
    </div>
  );
}

export interface CommandInputProps extends InputHTMLAttributes<HTMLInputElement> {
  styled?: boolean;
}

/** The palette search field. */
export function CommandInput({ styled = true, className, ...rest }: CommandInputProps) {
  return <input {...rest} className={cx(styled && 'hl-input', className)} data-hl-command-input />;
}

export type CommandListProps = HTMLAttributes<HTMLDivElement>;

/** The scrollable list of commands (`role="listbox"`). */
export function CommandList({ children, ...rest }: CommandListProps) {
  return (
    <div {...rest} data-hl-command-list role="listbox">
      {children}
    </div>
  );
}

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional heading shown above the grouped items. */
  label?: ReactNode;
}

/** A labelled group of commands. */
export function CommandGroup({ label, children, ...rest }: CommandGroupProps) {
  return (
    <div {...rest} data-hl-command-group>
      {label != null && (
        <div className="hl-command-group-label" role="presentation">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value: string;
  /** Extra search terms for filtering. */
  keywords?: string;
  /** Leading icon node. */
  icon?: ReactNode;
}

/** A runnable command (`role="option"`). */
export function CommandItem({ value, keywords, icon, children, ...rest }: CommandItemProps) {
  return (
    <div {...rest} role="option" data-hl-value={value} data-hl-keywords={keywords}>
      {icon}
      <span>{children}</span>
    </div>
  );
}

export type CommandEmptyProps = HTMLAttributes<HTMLDivElement>;

/** Shown when no commands match the query. */
export function CommandEmpty({ children = 'No results found.', ...rest }: CommandEmptyProps) {
  return (
    <div {...rest} data-hl-command-empty hidden>
      {children}
    </div>
  );
}
