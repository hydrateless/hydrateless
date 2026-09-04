import { defineEnhancer } from '../core/define.js';
import { setAttrs, isRtl } from '../core/dom.js';
import { Events } from '../core/events.js';
import { Keys, type MoveDirection } from '../core/keys.js';
import { isDisabledItem, nextEnabledIndex } from '../core/menu-items.js';

/** Options for {@link enhanceSegmented}. */
export type EnhanceSegmentedOptions = {
  /** Value of the initially selected segment. Falls back to the markup's checked/pressed segment. */
  defaultValue?: string;
  /** Called with the selected value after every change. */
  onValueChange?: (value: string) => void;
};

/** Imperative handle returned by {@link enhanceSegmented}. */
export type SegmentedApi = {
  /** The selected segment's value. */
  readonly value: string;
  /** Select the segment with `value`. */
  setValue: (value: string) => void;
};

const BUTTON = 'button, [role="radio"]';

/**
 * Single selection for a `[data-hl-segmented]` control. When the segments are
 * `<label><input type="radio">` pairs, the browser already handles selection
 * and arrow keys; the enhancer only mirrors the checked value into
 * `onValueChange`/`hl:change` and the returned API. When the segments are
 * `<button>`s, it applies the APG radio-group pattern: `role="radiogroup"`
 * on the root, `role="radio"` and `aria-checked` on each button, a roving
 * tabindex, and arrow/Home/End navigation that selects as it moves and skips
 * disabled segments. Segment values come from the radio's `value` or the
 * button's `data-hl-value`, defaulting to its text. Markup can set
 * `data-hl-default-value` on the root.
 */
export const enhanceSegmented = defineEnhancer<EnhanceSegmentedOptions, SegmentedApi>({
  name: 'segmented',
  selector: '[data-hl-segmented]',
  defaults: {},
  attributes: { defaultValue: 'string' },
  setup({ root, options, on, observe, emit }) {
    const radios = () => Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const buttons = () => Array.from(root.querySelectorAll<HTMLElement>(BUTTON));
    const useRadios = radios().length > 0;
    if (!useRadios && buttons().length === 0) return;

    let last = '';
    const notify = (value: string) => {
      if (value === last) return;
      last = value;
      options.onValueChange?.(value);
      emit(Events.change, { value });
    };

    if (useRadios) {
      const read = () => radios().find((radio) => radio.checked)?.value ?? '';
      const apply = (value: string) => {
        for (const radio of radios()) radio.checked = radio.value === value;
      };
      if (options.defaultValue !== undefined) apply(options.defaultValue);
      last = read();
      on(root, 'change', () => notify(read()));
      return {
        get value() {
          return read();
        },
        setValue(value) {
          apply(value);
          notify(read());
        },
      };
    }

    const valueOf = (button: HTMLElement) =>
      button.dataset.hlValue ?? button.textContent?.trim() ?? '';
    const isChecked = (button: HTMLElement) =>
      button.getAttribute('aria-checked') === 'true' ||
      button.getAttribute('aria-pressed') === 'true';

    setAttrs(root, { role: root.getAttribute('role') || 'radiogroup' });

    let selected =
      options.defaultValue ??
      (() => {
        const list = buttons();
        return valueOf(
          list.find(isChecked) ?? list[nextEnabledIndex(list, -1, 'first')] ?? list[0],
        );
      })();

    const paint = () => {
      const list = buttons();
      if (!list.some((button) => valueOf(button) === selected)) {
        const first = nextEnabledIndex(list, -1, 'first');
        if (first !== -1) selected = valueOf(list[first]);
      }
      for (const button of list) {
        const checked = valueOf(button) === selected;
        setAttrs(button, {
          role: 'radio',
          'aria-checked': checked ? 'true' : 'false',
          'aria-pressed': null,
        });
        button.tabIndex = checked ? 0 : -1;
      }
    };

    const select = (button: HTMLElement, focus = false) => {
      if (isDisabledItem(button)) return;
      selected = valueOf(button);
      paint();
      if (focus) button.focus();
      notify(selected);
    };

    paint();
    last = selected;
    observe(root, paint);

    on(root, 'click', (e) => {
      const button = (e.target as HTMLElement).closest<HTMLElement>(BUTTON);
      if (button && root.contains(button)) select(button);
    });

    on<KeyboardEvent>(root, 'keydown', (e) => {
      const button = (e.target as HTMLElement).closest<HTMLElement>(BUTTON);
      if (!button) return;
      const list = buttons();
      const current = list.indexOf(button);
      const rtl = isRtl(root);
      let direction: MoveDirection | null = null;
      if (e.key === (rtl ? Keys.ArrowLeft : Keys.ArrowRight) || e.key === Keys.ArrowDown) {
        direction = 'next';
      } else if (e.key === (rtl ? Keys.ArrowRight : Keys.ArrowLeft) || e.key === Keys.ArrowUp) {
        direction = 'prev';
      } else if (e.key === Keys.Home) direction = 'first';
      else if (e.key === Keys.End) direction = 'last';
      else if (e.key === Keys.Space || e.key === Keys.Enter) {
        e.preventDefault();
        select(button);
        return;
      }
      if (!direction) return;
      e.preventDefault();
      const index = nextEnabledIndex(list, current, direction);
      if (index !== -1) select(list[index], true);
    });

    return {
      get value() {
        return selected;
      },
      setValue(value) {
        const button = buttons().find((entry) => valueOf(entry) === value);
        if (button) select(button);
      },
    };
  },
});
