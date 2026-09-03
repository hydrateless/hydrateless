import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import {
  enhanceCommand,
  type CommandApi,
  type EnhanceCommandOptions,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

/** Props for {@link Command}. */
export interface CommandProps extends HTMLAttributes<HTMLDivElement> {
  /** Lowercased key that opens the palette's hosting `<dialog>` with Cmd/Ctrl. */
  hotkey?: string;
  /** Controlled filter query (pair with `onQueryChange`). */
  query?: string;
  /** Initial filter query for uncontrolled usage. */
  defaultQuery?: string;
  /** Called with the filter query after every change. */
  onQueryChange?: (query: string) => void;
  /** Fires with the chosen item's value and element when a command runs. */
  onCommand?: (value: string, item: HTMLElement) => void;
}

/**
 * Command palette. Compose with `<CommandInput>`, `<CommandList>`,
 * `<CommandGroup>`, `<CommandItem>`, and `<CommandEmpty>`. The enhancer filters
 * items (text + keywords), provides arrow navigation and an empty state, and
 * runs the active item on Enter. The query works uncontrolled (`defaultQuery`)
 * or controlled (`query` + `onQueryChange`). Place inside a `<dialog>` to use
 * `hotkey`.
 */
export const Command = forwardRef<HTMLDivElement, CommandProps>(function Command(
  { hotkey, query: queryProp, defaultQuery, onQueryChange, onCommand, children, ...rest },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [query, setQuery] = useControlled(queryProp, defaultQuery, onQueryChange);
  const api = useEnhancer<EnhanceCommandOptions, CommandApi>(
    ref,
    enhanceCommand,
    { hotkey, defaultValue: query, onValueChange: setQuery, onCommand },
    [hotkey],
  );
  useSyncApi(api, queryProp, (api, query) => api.setValue(query));

  return (
    <div {...rest} ref={ref} data-hl-command data-hl-command-hotkey={hotkey}>
      {children}
    </div>
  );
});

/** Props for {@link CommandInput}. */
export interface CommandInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Apply the `hl-input` style. Defaults to `true`. */
  styled?: boolean;
}

/** The palette search field. */
export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { styled = true, className, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      className={cx(styled && 'hl-input', className)}
      data-hl-command-input
    />
  );
});

/** Props for {@link CommandList}. */
export type CommandListProps = HTMLAttributes<HTMLDivElement>;

/** The scrollable list of commands (`role="listbox"`). */
export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
  { children, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} data-hl-command-list role="listbox">
      {children}
    </div>
  );
});

/** Props for {@link CommandGroup}. */
export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional heading shown above the grouped items. */
  label?: ReactNode;
}

/** A labelled group of commands. */
export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
  { label, children, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} data-hl-command-group>
      {label != null && (
        <div className="hl-command-group-label" role="presentation">
          {label}
        </div>
      )}
      {children}
    </div>
  );
});

/** Props for {@link CommandItem}. */
export interface CommandItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Value reported to `onCommand`. */
  value: string;
  /** Extra search terms for filtering. */
  keywords?: string;
  /** Leading icon node. */
  icon?: ReactNode;
}

/** A runnable command (`role="option"`). */
export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { value, keywords, icon, children, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} role="option" data-hl-value={value} data-hl-keywords={keywords}>
      {icon}
      <span>{children}</span>
    </div>
  );
});

/** Props for {@link CommandEmpty}. */
export type CommandEmptyProps = HTMLAttributes<HTMLDivElement>;

/** Shown when no commands match the query. */
export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(function CommandEmpty(
  { children = 'No results found.', ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} data-hl-command-empty hidden>
      {children}
    </div>
  );
});
