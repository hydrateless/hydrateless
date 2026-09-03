import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from './util.js';
import { useFieldControl } from './internal/useFieldControl.js';

/** Props for {@link Slider}. */
export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/**
 * Range slider primitive: `<input type="range" class="hl-slider">`. Inside a
 * {@link Field} it picks up `id`, `aria-describedby`, `aria-invalid`, and
 * `required`.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { className, ...rest },
  ref,
) {
  const props = useFieldControl(rest);
  return <input {...props} ref={ref} type="range" className={cx('hl-slider', className)} />;
});
