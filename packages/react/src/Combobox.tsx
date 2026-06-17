import {
  useEffect,
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
import { cx, useLatest } from './util.js';

/** Props for {@link Combobox}. */
export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  filter?: EnhanceComboboxOptions['filter'];
  autoHighlight?: EnhanceComboboxOptions['autoHighlight'];
  /** Controlled committed value (pair with `onValueChange`). */
  value?: string;
  /** Initial committed value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires with the committed value when an option is selected. */
  onValueChange?: (value: string) => void;
}

/**
 * Editable combobox (input + listbox) implementing the APG pattern. Compose with
 * `<ComboboxInput>`, `<ComboboxList>`, and `<ComboboxOption>`. The enhancer adds
 * filtering, `aria-activedescendant` navigation, and selection; the committed
 * value works uncontrolled (`defaultValue`) or controlled (`value` +
 * `onValueChange`).
 *
 * ```tsx
 * <Combobox value={fruit} onValueChange={setFruit}>
 *   <ComboboxInput placeholder="Search…" />
 *   <ComboboxList>
 *     <ComboboxOption value="apple">Apple</ComboboxOption>
 *     <ComboboxOption value="banana">Banana</ComboboxOption>
 *   </ComboboxList>
 * </Combobox>
 * ```
 */
export function Combobox({
  filter,
  autoHighlight,
  value,
  defaultValue,
  onValueChange,
  children,
  ...rest
}: ComboboxProps) {
  const onValueChangeRef = useLatest(onValueChange);
  const initialValueRef = useLatest(value ?? defaultValue);

  const { ref, api } = useEnhancer<HTMLDivElement, ComboboxApi>(
    (el) =>
      enhanceCombobox(el, {
        filter,
        autoHighlight,
        defaultValue: initialValueRef.current,
        onValueChange: (next) => onValueChangeRef.current?.(next),
      }),
    [filter, autoHighlight],
  );

  useEffect(() => {
    if (value != null) api.current?.setValue(value);
  }, [value, api]);

  return (
    <div {...rest} ref={ref} data-hl-combobox>
      {children}
    </div>
  );
}

/** Props for {@link ComboboxInput}. */
export interface ComboboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Apply the `hl-input` style. Defaults to `true`. */
  styled?: boolean;
}

/** The combobox text field. */
export function ComboboxInput({ styled = true, className, ...rest }: ComboboxInputProps) {
  return <input {...rest} className={cx(styled && 'hl-input', className)} />;
}

/** Props for {@link ComboboxList}. */
export type ComboboxListProps = HTMLAttributes<HTMLUListElement>;

/** The option popup (`role="listbox"`). */
export function ComboboxList({ children, ...rest }: ComboboxListProps) {
  return (
    <ul {...rest} role="listbox" hidden>
      {children}
    </ul>
  );
}

/** Props for {@link ComboboxOption}. */
export interface ComboboxOptionProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'value'> {
  value: string;
}

/** A selectable option. The `value` is committed on selection. */
export function ComboboxOption({ value, children, ...rest }: ComboboxOptionProps) {
  return (
    <li {...rest} role="option" data-hl-value={value}>
      {children ?? value}
    </li>
  );
}
