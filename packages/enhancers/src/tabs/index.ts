import { defineEnhancer } from '../core/define.js';
import { ensureId, setAttrs, isRtl } from '../core/dom.js';
import { Events } from '../core/events.js';
import { nextIndex, Keys, type MoveDirection } from '../core/keys.js';

/** Options for {@link enhanceTabs}. */
export type EnhanceTabsOptions = {
  /**
   * `manual` (default): arrows move focus, Enter/Space activates. `automatic`:
   * arrows activate the focused tab immediately.
   */
  activation?: 'manual' | 'automatic';
  orientation?: 'horizontal' | 'vertical';
  /**
   * Value of the initially selected tab. Falls back to the tab whose radio is
   * pre-checked (server-rendered state), then to the first enabled tab. Tab
   * values come from each radio's `value` (or `data-hl-value`), else the index.
   */
  defaultValue?: string;
  /** Called with the new tab value after every selection change. */
  onValueChange?: (value: string) => void;
};

/** Imperative handle returned by {@link enhanceTabs}. */
export type TabsApi = {
  /** Value of the currently selected tab. */
  readonly value: string;
  /** Select the tab with `value`. Pass `focus: true` to also move focus. */
  setValue: (value: string, options?: { focus?: boolean }) => void;
};

type Tab = {
  el: HTMLElement;
  radio: HTMLInputElement | null;
  panel: HTMLElement | null;
  value: string;
  disabled: boolean;
};

/**
 * Upgrade a CSS-only tab group to the full APG tabs pattern. The baseline works
 * with no JavaScript: each tab is a `<label>` wrapping a hidden radio, and the
 * stylesheet reveals the matching panel through `:has(input:checked)`, so
 * panels switch and server-rendered state shows correctly before (or without)
 * this enhancer. When it runs, it layers on the accessibility the radio group
 * can't express on its own: `role="tablist"`/`tab`/`tabpanel`, `aria-selected`,
 * `aria-controls`, roving tabindex, arrow/Home/End navigation with disabled-tab
 * skipping, and manual or automatic activation. The radios stay the single
 * source of truth, so CSS keeps owning panel visibility. Tabs and panels are
 * read live, so ones added or removed later are wired up automatically.
 * Selection is observable through `onValueChange`/`hl:change` and
 * controllable through the returned API. Markup can set
 * `data-hl-activation`, `data-hl-orientation`, and `data-hl-default-value`
 * on the root.
 */
export const enhanceTabs = defineEnhancer<EnhanceTabsOptions, TabsApi>({
  name: 'tabs',
  selector: '[data-hl-tabs]',
  defaults: { activation: 'manual', orientation: 'horizontal' },
  attributes: {
    activation: ['manual', 'automatic'],
    orientation: ['horizontal', 'vertical'],
    defaultValue: 'string',
  },
  setup({ root, options, on, observe, add, emit }) {
    const tablist = root.querySelector<HTMLElement>('[role="tablist"], .hl-tablist');
    if (!tablist) return;
    const panelHost = root.querySelector<HTMLElement>('.hl-tabpanels') ?? root;

    const collect = (): Tab[] => {
      const tabs = Array.from(
        tablist.querySelectorAll<HTMLElement>(':scope > .hl-tab, :scope > [role="tab"]'),
      );
      const panels = Array.from(
        panelHost.querySelectorAll<HTMLElement>(
          ':scope > .hl-tabpanel, :scope > [role="tabpanel"]',
        ),
      );
      return tabs.map((el, i) => {
        const radio = el.querySelector<HTMLInputElement>('input[type="radio"]');
        return {
          el,
          radio,
          panel: panels[i] ?? null,
          value: radio?.value || el.getAttribute('data-hl-value') || String(i),
          disabled:
            el.hasAttribute('disabled') ||
            el.getAttribute('aria-disabled') === 'true' ||
            Boolean(radio?.disabled),
        };
      });
    };

    let tabs = collect();
    if (tabs.length === 0 || !tabs.some((tab) => tab.panel)) return;

    const vertical = options.orientation === 'vertical';
    setAttrs(tablist, { role: 'tablist', 'aria-orientation': options.orientation ?? 'horizontal' });

    // Server-rendered selection: a pre-checked radio (CSS-only baseline) or a
    // pre-set `aria-selected` (button markup) both seed the initial tab.
    const preselected =
      tabs.find((tab) => tab.radio?.checked) ??
      tabs.find((tab) => tab.el.getAttribute('aria-selected') === 'true');
    const firstEnabled = tabs.find((tab) => !tab.disabled) ?? tabs[0];
    let selected: string =
      options.defaultValue != null && tabs.some((tab) => tab.value === options.defaultValue)
        ? options.defaultValue
        : (preselected ?? firstEnabled).value;

    const wired = new WeakSet<HTMLElement>();
    /** Roles, ids, and relationships for every tab and panel; idempotent. */
    const prepare = () => {
      for (const tab of tabs) {
        const tabId = ensureId(tab.el, 'hl-tab');
        setAttrs(tab.el, { role: 'tab' });
        // The radio is the no-JS state holder. Once JS owns the tabs, `role="tab"`
        // sits on the wrapping label, so a still-focusable radio inside it would be
        // a nested interactive control. `hidden` takes it out of the focus order
        // and the accessibility tree while it keeps driving the CSS `:checked`
        // baseline; it's restored on destroy so that baseline returns intact.
        const radio = tab.radio;
        if (radio && !wired.has(radio)) {
          wired.add(radio);
          setAttrs(radio, { tabindex: -1, 'aria-hidden': 'true' });
          radio.hidden = true;
          add(() => {
            radio.hidden = false;
            radio.removeAttribute('tabindex');
            radio.removeAttribute('aria-hidden');
          });
        }
        if (tab.panel) {
          const panelId = ensureId(tab.panel, 'hl-panel');
          setAttrs(tab.el, { 'aria-controls': panelId });
          setAttrs(tab.panel, { role: 'tabpanel', tabindex: 0, 'aria-labelledby': tabId });
        }
      }
    };

    /**
     * Reflect `selected` into ARIA, roving tabindex, panel visibility, and the
     * radios CSS reads. Toggling `hidden` keeps the APG contract and guarantees
     * panels switch even if the `:has(input:checked)` stylesheet isn't loaded;
     * keeping the radios in sync lets the no-JS CSS baseline stay correct.
     */
    const paint = (focus: boolean) => {
      if (!tabs.some((tab) => tab.value === selected)) {
        // The selected tab was removed: fall back to the first enabled one.
        selected = (tabs.find((tab) => !tab.disabled) ?? tabs[0])?.value ?? selected;
      }
      for (const tab of tabs) {
        const isSelected = tab.value === selected;
        setAttrs(tab.el, { 'aria-selected': isSelected ? 'true' : 'false' });
        tab.el.tabIndex = isSelected ? 0 : -1;
        if (tab.radio) tab.radio.checked = isSelected;
        if (tab.panel) tab.panel.hidden = !isSelected;
      }
      if (focus) tabs.find((tab) => tab.value === selected)?.el.focus();
    };

    const select = (index: number, focus = true) => {
      const tab = tabs[index];
      if (!tab || tab.disabled) return;
      const changed = tab.value !== selected;
      selected = tab.value;
      paint(focus);
      if (changed) {
        options.onValueChange?.(selected);
        emit(Events.change, { value: selected });
      }
    };

    /** Next enabled tab in `direction`, skipping disabled ones. */
    const move = (from: number, direction: MoveDirection): number => {
      let index = nextIndex(from, tabs.length, direction);
      const step = direction === 'first' ? 'next' : direction === 'last' ? 'prev' : direction;
      for (let i = 0; i < tabs.length && tabs[index].disabled; i += 1) {
        index = nextIndex(index, tabs.length, step);
      }
      return index;
    };

    // Signal to CSS that JS has upgraded the tabs (e.g. to drop the no-JS
    // "first panel only" fallback). Removed on destroy so the baseline returns.
    root.setAttribute('data-hl-ready', '');
    add(() => root.removeAttribute('data-hl-ready'));

    prepare();
    paint(false);

    // Tabs or panels added or removed later: re-collect, wire, and repaint.
    observe(root, () => {
      tabs = collect();
      if (tabs.length === 0) return;
      prepare();
      paint(false);
    });

    on(tablist, 'click', (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('.hl-tab, [role="tab"]');
      const index = el ? tabs.findIndex((tab) => tab.el === el) : -1;
      if (index === -1 || tabs[index].disabled) return;
      // Own selection ourselves so focus lands on the tab, not its hidden radio.
      e.preventDefault();
      select(index);
    });

    on<KeyboardEvent>(tablist, 'keydown', (e) => {
      const active = (root.ownerDocument.activeElement as HTMLElement) ?? null;
      const current = active ? tabs.findIndex((tab) => tab.el === active) : -1;
      if (current === -1) return;

      const rtl = isRtl(root);
      const prevKey = vertical ? Keys.ArrowUp : rtl ? Keys.ArrowRight : Keys.ArrowLeft;
      const nextKey = vertical ? Keys.ArrowDown : rtl ? Keys.ArrowLeft : Keys.ArrowRight;
      let direction: MoveDirection | null = null;
      if (e.key === nextKey) direction = 'next';
      else if (e.key === prevKey) direction = 'prev';
      else if (e.key === Keys.Home) direction = 'first';
      else if (e.key === Keys.End) direction = 'last';

      if (direction) {
        e.preventDefault();
        const target = move(current, direction);
        if (options.activation === 'automatic') select(target);
        else tabs[target]?.el.focus();
        return;
      }

      if (e.key === Keys.Enter || e.key === Keys.Space) {
        e.preventDefault();
        select(current);
      }
    });

    return {
      get value() {
        return selected;
      },
      setValue(value, { focus = false } = {}) {
        const index = tabs.findIndex((tab) => tab.value === value);
        if (index !== -1) select(index, focus);
      },
    };
  },
});
