import { forwardRef, type InputHTMLAttributes } from 'react';

/** Props for {@link Slider}. */
export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** Range slider primitive: `<input type="range" class="hl-slider">`. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { className, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      type="range"
      className={['hl-slider', className].filter(Boolean).join(' ')}
    />
  );
});
