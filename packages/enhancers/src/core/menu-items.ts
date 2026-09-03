import { setAttrs } from './dom.js';
import { nextIndex, type MoveDirection } from './keys.js';

/**
 * Selector matching every kind of menu item the dropdown and menu enhancers
 * understand: plain actions plus checkable `menuitemcheckbox`/`menuitemradio`.
 */
export const MENU_ITEM_SELECTOR =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

const ITEM = ':is([role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"])';

/**
 * Menu items belonging to `scope`, in document order: direct children, items
 * inside its `<li>` children, and items inside a `role="group"` (either a
 * direct child or an `<li>` wrapping a `<ul role="group">` of `<li>` items).
 * Nested submenus are not descended into.
 */
export function menuItemsOf(scope: HTMLElement): HTMLElement[] {
  return Array.from(
    scope.querySelectorAll<HTMLElement>(
      [
        `:scope > ${ITEM}`,
        `:scope > li > ${ITEM}`,
        `:scope > [role="group"] > ${ITEM}`,
        `:scope > [role="group"] > li > ${ITEM}`,
        `:scope > li > [role="group"] > ${ITEM}`,
        `:scope > li > [role="group"] > li > ${ITEM}`,
      ].join(', '),
    ),
  );
}

/** Whether a menu item is disabled through `disabled` or `aria-disabled="true"`. */
export function isDisabledItem(item: HTMLElement): boolean {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true';
}

/**
 * Index of the next enabled item from `from` in `direction`, wrapping at the
 * ends and skipping disabled items. Returns `-1` when nothing is enabled.
 */
export function nextEnabledIndex(
  items: HTMLElement[],
  from: number,
  direction: MoveDirection,
): number {
  if (items.length === 0) return -1;
  let index = nextIndex(from, items.length, direction);
  const step: MoveDirection =
    direction === 'first' ? 'next' : direction === 'last' ? 'prev' : direction;
  for (let i = 0; i < items.length && isDisabledItem(items[index]); i += 1) {
    index = nextIndex(index, items.length, step);
  }
  return isDisabledItem(items[index]) ? -1 : index;
}

/** Result of {@link activateMenuItem}: the item's value and, for checkable items, its new state. */
export interface MenuItemActivation {
  /** `data-hl-value`, falling back to the item's trimmed text. */
  value: string;
  /** New checked state for `menuitemcheckbox`/`menuitemradio`; `undefined` for plain items. */
  checked?: boolean;
}

/** The value a menu item reports: `data-hl-value`, else its trimmed text. */
export function menuItemValue(item: HTMLElement): string {
  return item.dataset.hlValue ?? item.textContent?.trim() ?? '';
}

/**
 * Apply the state change an activation implies. Checkbox items toggle
 * `aria-checked`; radio items become checked and uncheck their siblings in
 * the same `role="group"` (or the same menu when ungrouped). Plain items are
 * left alone. Nothing here closes the menu or notifies anyone.
 */
export function activateMenuItem(item: HTMLElement): MenuItemActivation {
  const value = menuItemValue(item);
  const role = item.getAttribute('role');
  if (role === 'menuitemcheckbox') {
    const checked = item.getAttribute('aria-checked') !== 'true';
    setAttrs(item, { 'aria-checked': checked ? 'true' : 'false' });
    return { value, checked };
  }
  if (role === 'menuitemradio') {
    const group =
      item.closest<HTMLElement>('[role="group"]') ??
      item.closest<HTMLElement>('[role="menu"], [data-hl-dropdown-menu]');
    for (const radio of group?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []) {
      setAttrs(radio, { 'aria-checked': radio === item ? 'true' : 'false' });
    }
    return { value, checked: true };
  }
  return { value };
}

/**
 * Normalize checkable items so every `menuitemcheckbox`/`menuitemradio`
 * carries an explicit `aria-checked` (defaulting to `false`), as the role
 * requires, and take every item out of the sequential tab order.
 */
export function prepareMenuItems(items: HTMLElement[]): void {
  for (const item of items) {
    item.tabIndex = -1;
    const role = item.getAttribute('role');
    if (
      (role === 'menuitemcheckbox' || role === 'menuitemradio') &&
      !item.hasAttribute('aria-checked')
    ) {
      setAttrs(item, { 'aria-checked': 'false' });
    }
  }
}
