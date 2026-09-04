import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LiHTMLAttributes,
} from 'react';
import {
  enhanceCombobox,
  type ComboboxApi,
  type EnhanceComboboxOptions,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';
import { useFieldControl } from './internal/useFieldControl.js';

/** Props for {@link Combobox}. */
export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Hide options that don't match the typed query. Defaults to `true`. */
  filter?: EnhanceComboboxOptions['filter'];
  /** Highlight the first match while typing. Defaults to `true`. */
  autoHighlight?: EnhanceComboboxOptions['autoHighlight'];
  /** Controlled committed value (pair with `onValueChange`). */
  value?: string;
  /** Initial committed value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires with the committed value when an option is selected. */
  onValueChange?: (value: string) => void;
  /** Controlled listbox visibility (pair with `onOpenChange`). */
  open?: boolean;
  /** Show the listbox initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the listbox expands or collapses. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Editable combobox (input + listbox) implementing the APG pattern. Compose with
 * `<ComboboxInput>`, `<ComboboxList>`, and `<ComboboxOption>`. The enhancer adds
 * filtering, `aria-activedescendant` navigation, and selection; both the
 * committed value and the open state work uncontrolled or controlled.
 *
 * ```tsx
 * <Combobox value={fruit} onValueChange={setFruit}>
 *   <ComboboxInput placeholder="Search..." />
 *   <ComboboxList>
 *     <ComboboxOption value="apple">Apple</ComboboxOption>
 *     <ComboboxOption value="banana">Banana</ComboboxOption>
 *   </ComboboxList>
 * </Combobox>
 * ```
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  {
    filter,
    autoHighlight,
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen,
    onOpenChange,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [value, setValue] = useControlled(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = useControlled(openProp, defaultOpen ?? false, onOpenChange);
  const api = useEnhancer<EnhanceComboboxOptions, ComboboxApi>(
    ref,
    enhanceCombobox,
    {
      filter,
      autoHighlight,
      defaultValue: value,
      defaultOpen: open,
      onValueChange: setValue,
      onOpenChange: setOpen,
    },
    [filter, autoHighlight],
  );
  useSyncApi(api, valueProp, (api, value) => api.setValue(value));
  // Only a controlled `open` is pushed back in; `defaultOpen` seeds the
  // enhancer once and then leaves it in charge of its own state.
  useSyncApi(api, openProp, (api, open) => api.setOpen(open));

  return (
    <div {...rest} ref={ref} data-hl-combobox>
      {children}
    </div>
  );
});

/** Props for {@link ComboboxInput}. */
export interface ComboboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Apply the `hl-input` style. Defaults to `true`. */
  styled?: boolean;
}

/**
 * The combobox text field. Inside a {@link Field} it picks up `id`,
 * `aria-describedby`, `aria-invalid`, and `required`.
 */
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput({ styled = true, className, ...rest }, ref) {
    const props = useFieldControl(rest);
    return <input {...props} ref={ref} className={cx(styled && 'hl-input', className)} />;
  },
);

/** Props for {@link ComboboxList}. */
export type ComboboxListProps = HTMLAttributes<HTMLUListElement>;

/** The option popup (`role="listbox"`). */
export const ComboboxList = forwardRef<HTMLUListElement, ComboboxListProps>(function ComboboxList(
  { children, ...rest },
  ref,
) {
  return (
    <ul {...rest} ref={ref} role="listbox">
      {children}
    </ul>
  );
});

/** Props for {@link ComboboxOption}. */
export interface ComboboxOptionProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'value'> {
  /** The value committed when this option is selected. */
  value: string;
  /** Skip the option in keyboard navigation and refuse selection. */
  disabled?: boolean;
}

/** A selectable option. The `value` is committed on selection. */
export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  function ComboboxOption({ value, disabled, children, ...rest }, ref) {
    return (
      <li
        {...rest}
        ref={ref}
        role="option"
        aria-disabled={disabled || undefined}
        data-hl-value={value}
      >
        {children ?? value}
      </li>
    );
  },
);
