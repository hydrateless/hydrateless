import { getContext, setContext } from 'svelte';

/**
 * What a Field shares with its descendants. The getters stay live, so controls
 * re-render when `invalid`/`required` change.
 * @internal
 */
export interface FieldContext {
  readonly id: string;
  readonly helpId: string;
  readonly errorId: string;
  readonly invalid: boolean;
  readonly required: boolean;
}

const FIELD_KEY = Symbol('hl-field');

/** Publish a {@link FieldContext}; called by `<Field>` only. @internal */
export function setFieldContext(ctx: FieldContext): void {
  setContext(FIELD_KEY, ctx);
}

/** Read the nearest {@link FieldContext}, or `undefined` outside a Field. @internal */
export function getFieldContext(): FieldContext | undefined {
  return getContext<FieldContext | undefined>(FIELD_KEY);
}

/** Attributes a custom control should render to join the enclosing Field. */
export interface FieldBindings {
  /** The control's `id`; the Field's label points at it. */
  readonly id: string;
  /** Space-separated ids for `aria-describedby` (help text, plus the error when invalid). */
  readonly describedBy: string | undefined;
  /** Whether the Field is currently invalid; render as `aria-invalid`. */
  readonly invalid: boolean;
  /** Whether the Field is required; render as `required`. */
  readonly required: boolean;
}

/**
 * Wire a custom control into the enclosing `<Field>`. Returns `null` outside a
 * Field, so controls can call it unconditionally. Must be called during
 * component initialization, like any context read. The returned object's
 * properties are getters, so they stay reactive in the template:
 *
 * ```svelte
 * <script lang="ts">
 *   const field = useField();
 * </script>
 *
 * <input id={field?.id} aria-describedby={field?.describedBy} aria-invalid={field?.invalid || undefined} />
 * ```
 */
export function useField(): FieldBindings | null {
  const ctx = getFieldContext();
  if (!ctx) return null;
  return {
    get id() {
      return ctx.id;
    },
    get describedBy() {
      const ids = [ctx.helpId, ctx.invalid ? ctx.errorId : null].filter(Boolean).join(' ');
      return ids || undefined;
    },
    get invalid() {
      return ctx.invalid;
    },
    get required() {
      return ctx.required;
    },
  };
}

/** Shared state a RadioGroup provides to its radios (name, selected value, and a setter). @internal */
export interface RadioGroupContext {
  readonly name: string | undefined;
  readonly value: string | undefined;
  select: (value: string) => void;
}

const RADIO_GROUP_KEY = Symbol('hl-radio-group');

/** Publish a {@link RadioGroupContext}; called by `<RadioGroup>` only. @internal */
export function setRadioGroupContext(ctx: RadioGroupContext): void {
  setContext(RADIO_GROUP_KEY, ctx);
}

/** Read the nearest {@link RadioGroupContext}, or `undefined` outside a group. @internal */
export function getRadioGroupContext(): RadioGroupContext | undefined {
  return getContext<RadioGroupContext | undefined>(RADIO_GROUP_KEY);
}

/**
 * Ids a Dropdown generates so the trigger's `popovertarget` and the menu's
 * `id` agree in server-rendered markup, before any script runs.
 * @internal
 */
export interface DropdownContext {
  readonly menuId: string;
  readonly triggerId: string;
}

const DROPDOWN_KEY = Symbol('hl-dropdown');

/** Publish a {@link DropdownContext}; called by `<Dropdown>` only. @internal */
export function setDropdownContext(ctx: DropdownContext): void {
  setContext(DROPDOWN_KEY, ctx);
}

/** Read the nearest {@link DropdownContext}, or `undefined` outside a Dropdown. @internal */
export function getDropdownContext(): DropdownContext | undefined {
  return getContext<DropdownContext | undefined>(DROPDOWN_KEY);
}

/**
 * Selection state a Tabs root shares with its tabs and panels so `aria-selected`,
 * `tabindex`, and `hidden` can be rendered on the server. Tabs and panels
 * register in document order; a panel pairs with the tab at the same index.
 * @internal
 */
export interface TabsContext {
  /** The selected tab's value (falls back to the first registered tab). */
  readonly value: string | undefined;
  /** Register a tab and get its index. `value` defaults to that index. */
  registerTab: (value: string | undefined) => number;
  /** Register a panel and get its index. */
  registerPanel: () => number;
  /** Value of the tab registered at `index`. */
  tabValueAt: (index: number) => string | undefined;
}

const TABS_KEY = Symbol('hl-tabs');

/** Publish a {@link TabsContext}; called by `<Tabs>` only. @internal */
export function setTabsContext(ctx: TabsContext): void {
  setContext(TABS_KEY, ctx);
}

/** Read the nearest {@link TabsContext}, or `undefined` outside Tabs. @internal */
export function getTabsContext(): TabsContext | undefined {
  return getContext<TabsContext | undefined>(TABS_KEY);
}

/**
 * Open-item state an Accordion shares with its items so each `<details>` can
 * render its `open` attribute on the server.
 * @internal
 */
export interface AccordionContext {
  /** Values of the open items. */
  readonly value: readonly string[];
  /** Register an item and get its index, which is its default value. */
  registerItem: () => number;
}

const ACCORDION_KEY = Symbol('hl-accordion');

/** Publish an {@link AccordionContext}; called by `<Accordion>` only. @internal */
export function setAccordionContext(ctx: AccordionContext): void {
  setContext(ACCORDION_KEY, ctx);
}

/** Read the nearest {@link AccordionContext}, or `undefined` outside an Accordion. @internal */
export function getAccordionContext(): AccordionContext | undefined {
  return getContext<AccordionContext | undefined>(ACCORDION_KEY);
}
