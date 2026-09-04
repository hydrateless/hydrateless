import { defineEnhancer } from '../core/define.js';
import { ensureId, setAttrs } from '../core/dom.js';
import { Events } from '../core/events.js';

/** Options for {@link enhanceSlider}. */
export type EnhanceSliderOptions = {
  /** Initial value; falls back to the input's own `value`. */
  defaultValue?: number;
  /** Text appended to the displayed value, e.g. `%`. */
  unit?: string;
  /**
   * Format the value for the `<output>` and `aria-valuetext`. Defaults to the
   * number followed by `unit`.
   */
  format?: (value: number) => string;
  /** Called with the new value on every change while dragging. */
  onValueChange?: (value: number) => void;
};

/** Imperative handle returned by {@link enhanceSlider}. */
export type SliderApi = {
  /** The current numeric value. */
  readonly value: number;
  /** Set the value (clamped to `min`/`max`) and update the output. */
  setValue: (value: number) => void;
};

/**
 * Live feedback for a native `<input type="range">` inside a
 * `[data-hl-slider]` wrapper. The range input is already fully keyboard
 * accessible, so this enhancer only adds what CSS can't: it keeps an
 * `<output>` in the wrapper in sync with the value, sets `aria-valuetext` when
 * a `unit` or `format` gives the number meaning, and writes the fill
 * percentage to `--hl-slider-progress` on the input so the stylesheet can
 * paint the filled part of the track in every engine. The value is
 * observable through `onValueChange`/`hl:change` and controllable through the
 * returned API. Markup can set `data-hl-default-value` and `data-hl-unit` on
 * the wrapper.
 */
export const enhanceSlider = defineEnhancer<EnhanceSliderOptions, SliderApi>({
  name: 'slider',
  selector: '[data-hl-slider]',
  defaults: {},
  attributes: { defaultValue: 'number', unit: 'string' },
  setup({ root, options, on, add, emit }) {
    const input = root.querySelector<HTMLInputElement>('input[type="range"]');
    if (!input) return;
    const output = root.querySelector<HTMLOutputElement>('output');

    if (output && !output.htmlFor.length) output.htmlFor.add(ensureId(input, 'hl-slider'));

    const read = () => Number(input.value);
    const format = (value: number) =>
      options.format ? options.format(value) : `${value}${options.unit ?? ''}`;

    const paint = () => {
      const value = read();
      const min = Number(input.min || 0);
      const max = Number(input.max || 100);
      const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
      input.style.setProperty('--hl-slider-progress', `${percent}%`);
      const text = format(value);
      if (output) output.value = text;
      setAttrs(input, { 'aria-valuetext': options.format || options.unit ? text : null });
    };
    add(() => {
      input.style.removeProperty('--hl-slider-progress');
      input.removeAttribute('aria-valuetext');
    });

    let last = read();
    const notify = () => {
      const value = read();
      if (value === last) return;
      last = value;
      options.onValueChange?.(value);
      emit(Events.change, { value });
    };

    if (options.defaultValue !== undefined) input.value = String(options.defaultValue);
    last = read();
    paint();

    on(input, 'input', () => {
      paint();
      notify();
    });

    return {
      get value() {
        return read();
      },
      setValue(value) {
        input.value = String(value);
        paint();
        notify();
      },
    };
  },
});
