import { defineEnhancer } from '../core/define.js';
import { Events } from '../core/events.js';

/** Options for {@link enhanceCheckbox}. */
export type EnhanceCheckboxOptions = {
  /** Values of the initially checked boxes. Falls back to the markup's `checked` attributes. */
  defaultValue?: string[];
  /** Called with the checked values after every change. */
  onValueChange?: (value: string[]) => void;
};

/** Imperative handle returned by {@link enhanceCheckbox}. */
export type CheckboxApi = {
  /** Values of the checked boxes, in document order. */
  readonly value: string[];
  /** Check exactly the boxes whose values are listed. */
  setValue: (value: string[]) => void;
};

const ALL = '[data-hl-checkbox-all]';

/** `data-hl-default-value="a b"` or `"a,b"` lists the initially checked boxes. */
const parseList = (raw: string) => raw.split(/[\s,]+/).filter(Boolean);

/**
 * A group of native checkboxes inside `[data-hl-checkbox-group]`, with the two
 * things HTML can't express declaratively: a `[data-hl-checkbox-all]` master
 * box that reflects the group (checked, unchecked, or `indeterminate`) and
 * toggles every enabled box at once, and `data-hl-indeterminate` to render a
 * box in the mixed state until the user touches it. Without JavaScript the
 * boxes are plain form controls. Boxes added or removed later are included.
 * The checked values are observable through `onValueChange`/`hl:change` and
 * controllable through the returned API. Markup can set
 * `data-hl-default-value` on the group.
 */
export const enhanceCheckbox = defineEnhancer<EnhanceCheckboxOptions, CheckboxApi>({
  name: 'checkbox',
  selector: '[data-hl-checkbox-group]',
  defaults: {},
  attributes: { defaultValue: parseList },
  setup({ root, options, on, observe, emit }) {
    const master = () => root.querySelector<HTMLInputElement>(`input[type="checkbox"]${ALL}`);
    const boxes = () =>
      Array.from(root.querySelectorAll<HTMLInputElement>(`input[type="checkbox"]:not(${ALL})`));

    const read = () =>
      boxes()
        .filter((box) => box.checked)
        .map((box) => box.value);

    const prepare = () => {
      for (const box of boxes()) {
        if (box.hasAttribute('data-hl-indeterminate')) {
          box.indeterminate = true;
          box.removeAttribute('data-hl-indeterminate');
        }
      }
    };

    const paintMaster = () => {
      const all = master();
      if (!all) return;
      const list = boxes();
      const checked = list.filter((box) => box.checked).length;
      all.checked = list.length > 0 && checked === list.length;
      all.indeterminate = checked > 0 && checked < list.length;
    };

    let last = read().join('\u0000');
    const notify = () => {
      const value = read();
      const serialized = value.join('\u0000');
      if (serialized === last) return;
      last = serialized;
      options.onValueChange?.(value);
      emit(Events.change, { value });
    };

    const apply = (values: string[]) => {
      for (const box of boxes()) {
        box.checked = values.includes(box.value);
        box.indeterminate = false;
      }
      paintMaster();
    };

    prepare();
    if (options.defaultValue) apply(options.defaultValue);
    else paintMaster();
    last = read().join('\u0000');

    on(root, 'change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type !== 'checkbox') return;
      if (target.matches(ALL)) {
        for (const box of boxes()) {
          if (!box.disabled) {
            box.checked = target.checked;
            box.indeterminate = false;
          }
        }
        paintMaster();
      } else {
        target.indeterminate = false;
        paintMaster();
      }
      notify();
    });

    observe(root, () => {
      prepare();
      paintMaster();
      notify();
    });

    return {
      get value() {
        return read();
      },
      setValue(value) {
        apply(value);
        notify();
      },
    };
  },
});
